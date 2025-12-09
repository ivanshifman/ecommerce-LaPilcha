import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface UserLike {
  authProvider?: string;
  password?: string;
}

@ValidatorConstraint({ name: 'PasswordAuthProvider', async: false })
export class PasswordAuthProviderConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as UserLike;

    if (obj.authProvider && obj.authProvider !== 'local') {
      return !obj.password;
    }

    return true;
  }

  defaultMessage() {
    return 'No puede enviar password cuando authProvider no es local';
  }
}
