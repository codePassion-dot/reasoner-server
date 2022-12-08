import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './refreshToken.entity';
import { UsersService } from 'src/users/users.service';
import { RefreshTokensRepository } from './refreshTokens.repository';

const responseSignUp = {
  resource: {
    id: 1,
    email: 'jhon.doe@gmail.com',
  },
};

const responseSignIn = {
  error: null,
  resource: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  },
};

const payload = {
  email: 'jhon.doe@gmail.com',
  password: '123456',
};
const payloadWithHashedPassword = {
  email: 'jhon.doe@gmail.com',
  password: '$2b$10$G9LwKWnjSTsP/DeMMI.Rl.NahX97azHbQtZKR1t86iAGq1opciAe.',
};
const refreshTokenEntity = {
  user: { id: 1, ...payloadWithHashedPassword, refreshTokens: [] },
  refreshToken: 'refreshToken',
  expiresAt: new Date('December 31, 2022 00:00:00'),
};

describe('UserService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let usersService: UsersService;
  let refreshTokensRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date('December 01, 2022 00:00:00'));
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: UsersService,
          useValue: {
            findOneBy: jest
              .spyOn(UsersService.prototype, 'findOneBy')
              .mockResolvedValueOnce(null)
              .mockResolvedValueOnce({
                id: 1,
                ...payloadWithHashedPassword,
                refreshTokens: [],
              }),
            save: jest.fn(UsersService.prototype.save).mockResolvedValue({
              id: 1,
              refreshTokens: [],
              ...payloadWithHashedPassword,
            }),
            create: jest
              .fn(UsersService.prototype.create)
              .mockImplementationOnce(() => ({
                id: 1,
                refreshTokens: [],
                ...payloadWithHashedPassword,
              })),
            findByRefreshToken: jest
              .spyOn(UsersService.prototype, 'findByRefreshToken')
              .mockResolvedValueOnce({
                id: 1,
                ...payloadWithHashedPassword,
                refreshTokens: [],
              })
              .mockResolvedValueOnce(null)
              .mockResolvedValueOnce(null),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest
              .spyOn(JwtService.prototype, 'sign')
              .mockReturnValueOnce('refreshToken')
              .mockReturnValueOnce('accessToken')
              .mockReturnValueOnce('refreshToken')
              .mockReturnValueOnce('accessToken'),
            verify: jest
              .spyOn(JwtService.prototype, 'verify')
              .mockReturnValueOnce({
                sub: 1,
                email: 'jhon.doe@gmail.com',
              })
              .mockReturnValueOnce({
                sub: 1,
                email: 'jhon.doe@gmail.com',
              })
              .mockImplementationOnce(() => {
                throw new Error('Invalid token');
              }),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            save: jest
              .fn(RefreshTokensRepository.prototype.save)
              .mockImplementation(() =>
                Promise.resolve({
                  id: 1,
                  ...refreshTokenEntity,
                }),
              ),
            create: jest
              .fn(RefreshTokensRepository.prototype.create)
              .mockReturnValue({ id: 1, ...refreshTokenEntity }),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
    refreshTokensRepository = module.get(getRepositoryToken(RefreshToken));
    configService = module.get<ConfigService>(ConfigService);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('sign up new user', () => {
    it('should succesfully create a user', async () => {
      const hash = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          () => '$2b$10$G9LwKWnjSTsP/DeMMI.Rl.NahX97azHbQtZKR1t86iAGq1opciAe.',
        );
      const salt = jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => 2);
      const result = await authService.signUp(payload);
      expect(result).toEqual(responseSignUp);
      expect(usersService.findOneBy).toHaveBeenCalledWith({
        email: payload.email,
      });
      expect(usersService.create).toHaveBeenCalledWith(
        payloadWithHashedPassword,
      );
      expect(usersService.save).toHaveBeenCalledWith({
        id: 1,
        ...payloadWithHashedPassword,
        refreshTokens: [],
      });
      expect(hash).toHaveBeenCalledWith(payload.password, 2);
      expect(salt).toHaveBeenCalled();
    });
    it('should throw an error if user already exists', async () => {
      expect(authService.signUp(payload)).rejects.toThrow(
        new BadRequestException({
          error: {
            code: 'email_already_exists',
            detail: 'email already exists',
          },
          resource: null,
        }),
      );
      expect(usersService.findOneBy).toHaveBeenCalledWith({
        email: payload.email,
      });
    });
  });
  describe('sign in user', () => {
    it('should successfully sign in a user', async () => {
      jest.spyOn(ConfigService.prototype, 'get').mockReturnValueOnce('30d');
      jest
        .spyOn(ConfigService.prototype, 'get')
        .mockReturnValueOnce('refreshSecret');
      jest.spyOn(ConfigService.prototype, 'get').mockReturnValueOnce('10min');
      jest
        .spyOn(ConfigService.prototype, 'get')
        .mockReturnValueOnce('accessSecret');

      const user = {
        id: 1,
        ...payloadWithHashedPassword,
        refreshTokens: [],
      };
      const result = await authService.signIn(user);
      expect(result).toEqual(responseSignIn);
      expect(refreshTokensRepository.create).toHaveBeenCalledWith(
        refreshTokenEntity,
      );
      expect(refreshTokensRepository.save).toHaveBeenCalledWith({
        id: 1,
        ...refreshTokenEntity,
      });
      expect(configService.get).nthCalledWith(1, 'JWT_REFRESH_EXPIRATION_TIME');
      expect(configService.get).nthCalledWith(2, 'JWT_REFRESH_SECRET');
      expect(configService.get).nthCalledWith(3, 'JWT_ACCESS_EXPIRATION_TIME');
      expect(configService.get).nthCalledWith(4, 'JWT_ACCESS_SECRET');
      expect(jwtService.sign).nthCalledWith(
        1,
        {
          email: payload.email,
          sub: 1,
        },
        { expiresIn: '30d', secret: 'refreshSecret' },
      );
      expect(jwtService.sign).nthCalledWith(
        2,
        {
          email: payload.email,
          sub: 1,
        },
        { expiresIn: '10min', secret: 'accessSecret' },
      );
    });
  });
  describe('refresh token', () => {
    it('should succesfully refresh token', async () => {
      jest
        .spyOn(ConfigService.prototype, 'get')
        .mockReturnValueOnce('refreshSecret');
      jest.spyOn(ConfigService.prototype, 'get').mockReturnValueOnce('30d');
      jest
        .spyOn(ConfigService.prototype, 'get')
        .mockReturnValueOnce('refreshSecret');
      jest.spyOn(ConfigService.prototype, 'get').mockReturnValueOnce('10min');
      jest
        .spyOn(ConfigService.prototype, 'get')
        .mockReturnValueOnce('accessSecret');
      const result = await authService.refreshToken('oldRefreshToken');
      expect(result).toEqual(responseSignIn);
      expect(usersService.findByRefreshToken).toHaveBeenCalledWith(
        'oldRefreshToken',
      );
      expect(jwtService.verify).toHaveBeenCalledWith('oldRefreshToken', {
        secret: 'refreshSecret',
      });
      expect(refreshTokensRepository.delete).toHaveBeenCalledWith({
        refreshToken: 'oldRefreshToken',
      });
      expect(jwtService.sign).nthCalledWith(
        1,
        {
          email: payload.email,
          sub: 1,
        },
        { expiresIn: '30d', secret: 'refreshSecret' },
      );
      expect(configService.get).nthCalledWith(1, 'JWT_REFRESH_EXPIRATION_TIME');
      expect(configService.get).nthCalledWith(2, 'JWT_REFRESH_SECRET');

      expect(refreshTokensRepository.create).toHaveBeenCalledWith(
        refreshTokenEntity,
      );
      expect(refreshTokensRepository.save).toHaveBeenCalledWith({
        id: 1,
        ...refreshTokenEntity,
      });
      expect(jwtService.sign).nthCalledWith(
        2,
        {
          email: payload.email,
          sub: 1,
        },
        {
          expiresIn: '10min',
          secret: 'accessSecret',
        },
      );
      expect(configService.get).nthCalledWith(3, 'JWT_ACCESS_EXPIRATION_TIME');
      expect(configService.get).nthCalledWith(4, 'JWT_ACCESS_SECRET');
    });
    it('should delete user refresh token if detected reuse of refresh token', async () => {
      jest
        .spyOn(ConfigService.prototype, 'get')
        .mockReturnValueOnce('refreshSecret');
      const result = await authService.refreshToken('oldRefreshToken');
      expect(result).toEqual({
        error: {
          code: 'refresh_token_hacked',
          detail: 'refresh token was hacked',
        },
        resource: null,
      });
      expect(usersService.findByRefreshToken).toHaveBeenCalledWith(
        'oldRefreshToken',
      );
      expect(jwtService.verify).toHaveBeenCalledWith('oldRefreshToken', {
        secret: 'refreshSecret',
      });
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
      expect(usersService.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(refreshTokensRepository.delete).toHaveBeenCalled();
    });
  });
  it('should throw an error when the user was not found and the refresh token is not valid', async () => {
    jest
      .spyOn(ConfigService.prototype, 'get')
      .mockReturnValueOnce('refreshSecret');
    expect(authService.refreshToken('oldRefreshToken')).rejects.toThrow(
      new UnauthorizedException({
        error: {
          code: 'refresh_token_not_valid',
          detail: 'refresh token is not valid',
        },
        resource: null,
      }),
    );
    expect(usersService.findByRefreshToken).toHaveBeenCalledWith(
      'oldRefreshToken',
    );
    expect(jwtService.verify).toHaveBeenCalledWith('oldRefreshToken', {
      secret: 'refreshSecret',
    });
    expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
  });
});
