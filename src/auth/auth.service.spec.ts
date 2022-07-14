import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

const response = {
  error: null,
  resource: {
    email: 'jhon.doe@gmail.com',
    password: '$2b$10$G9LwKWnjSTsP/DeMMI.Rl.NahX97azHbQtZKR1t86iAGq1opciAe.',
    id: 1,
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

describe('UserService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findBy: jest
              .spyOn(Repository.prototype, 'findBy')
              .mockResolvedValueOnce([])
              .mockRejectedValueOnce(() => {
                throw new BadRequestException({
                  error: {
                    code: 'email_already_exists',
                    detail: 'email already exists',
                  },
                  resource: null,
                });
              }),
            save: jest
              .fn()
              .mockResolvedValue({ id: 1, ...payloadWithHashedPassword }),
            create: jest
              .fn()
              .mockImplementationOnce(() => payloadWithHashedPassword),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('sign up new user', () => {
    it('should successfully create a user', async () => {
      const hash = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          () => '$2b$10$G9LwKWnjSTsP/DeMMI.Rl.NahX97azHbQtZKR1t86iAGq1opciAe.',
        );
      const salt = jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => 2);
      const result = await authService.signUp(payload);
      expect(result).toEqual(response);
      expect(usersRepository.findBy).toHaveBeenCalledWith({
        email: payload.email,
      });
      expect(usersRepository.create).toHaveBeenCalledWith(
        payloadWithHashedPassword,
      );
      expect(usersRepository.save).toHaveBeenCalledWith(
        payloadWithHashedPassword,
      );
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
      expect(usersRepository.findBy).toHaveBeenCalledWith({
        email: payload.email,
      });
    });
  });
});
