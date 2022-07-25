import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';

const createUserDto: CreateUserDto = {
  email: 'jhon.doe@gmail.com',
  password: '123456',
};
const createUserDtoInvalidEmail = {
  email: '1',
  password: '123456',
};
const createUserDtoInvalidPassword = {
  email: 'jhon.doe@gmail.com',
  password: 123456,
};
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            signUp: jest
              .spyOn(AuthService.prototype, 'signUp')
              .mockImplementationOnce((user: CreateUserDto) =>
                Promise.resolve({ error: null, resource: { id: 1, ...user } }),
              )
              .mockRejectedValueOnce(() => {
                throw new BadRequestException({
                  error: {
                    code: 'email_already_exists',
                    detail: 'email already exists',
                  },
                  resource: null,
                });
              })
              .mockRejectedValueOnce(() => {
                throw new BadRequestException({
                  error: {
                    code: 'invalid_request',
                    detail: 'email is not valid',
                  },
                  resource: null,
                });
              })
              .mockRejectedValueOnce(() => {
                throw new BadRequestException({
                  error: {
                    code: 'invalid_request',
                    detail: 'password is not valid',
                  },
                  resource: null,
                });
              }),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);

    authController = module.get<AuthController>(AuthController);
  });
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  describe('signUp', () => {
    it('should create a user', async () => {
      expect(authController.signUp(createUserDto)).resolves.toEqual({
        error: null,
        resource: { id: 1, ...createUserDto },
      });
      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    });
    it('should throw an error if email already exists', async () => {
      expect(authController.signUp(createUserDto)).rejects.toThrow(
        new BadRequestException({
          error: {
            code: 'email_already_exists',
            detail: 'email already exists',
          },
          resource: null,
        }),
      );
      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    });
    it('should throw an error if email is not valid', async () => {
      expect(authController.signUp(createUserDtoInvalidEmail)).rejects.toThrow(
        new BadRequestException({
          error: {
            code: 'invalid_request',
            detail: 'email is not valid',
          },
          resource: null,
        }),
      );
      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    });
    it('should throw an error if password is not valid', async () => {
      expect(
        authController.signUp(createUserDtoInvalidPassword as any),
      ).rejects.toThrow(
        new BadRequestException({
          error: {
            code: 'invalid_request',
            detail: 'password is not valid',
          },
          resource: null,
        }),
      );
      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    });
  });
});
