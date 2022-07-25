import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsValidPassword } from './is-valid-password';

export class CreateUserDto {
  @IsEmail({}, { message: 'email is not valid' })
  email: string;
  @IsString({ message: 'password is not valid' })
  @MinLength(8, {
    message: 'the password should have at least $constraint1 characters ',
  })
  @MaxLength(14, {
    message:
      'the password should not exceed the maximum of $constraint1 characters',
  })
  @Validate(IsValidPassword, [/[a-z]/, /[A-Z]/, /[!@*"#$%&\/()=]/, /[0-9]/])
  password: string;
}
