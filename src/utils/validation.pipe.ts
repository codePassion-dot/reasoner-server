import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const formattedErrors = {};
      errors.forEach((e) => {
        const messages = Object.values(e.constraints);
        formattedErrors[e.property] = messages.flatMap((message) =>
          // * the custom validation classes returns a comma separated string so we need to divide that string into an ordered list of substrings and assign it to the property
          message.split(','),
        );
      });
      throw new BadRequestException({
        error: { code: 'invalid_body', detail: formattedErrors },
        resource: null,
      });
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
