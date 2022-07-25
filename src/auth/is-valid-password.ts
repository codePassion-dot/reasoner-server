import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidPassword', async: false })
export class IsValidPassword implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return args.constraints.every((pattern) => pattern.test(text));
  }

  defaultMessage(args: ValidationArguments) {
    const messages = [
      'the password should has at least one lower case',
      'the password should has at least one upper case',
      'the password should has at least one special character',
      'the password should has at least one number',
    ];
    const triggeredErrors = args.constraints
      .map((pattern, index) => {
        const testPassed = pattern.test(args.value);
        if (!testPassed) {
          return messages[index];
        }
        return null;
      })
      .filter(Boolean)
      .toString();
    return triggeredErrors;
  }
}
