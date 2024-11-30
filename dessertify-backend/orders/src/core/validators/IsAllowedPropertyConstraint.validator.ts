import { Validate } from 'class-validator';

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsAllowedPropertyConstraint implements ValidatorConstraintInterface {
  validate(property: string, args: ValidationArguments) {
    const allowedProperties = args.constraints[0] as string[];
    return allowedProperties.includes(property);
  }

  defaultMessage(args: ValidationArguments) {
    const allowedProperties = args.constraints[0] as string[];
    return `Invalid property "${args.value}". Allowed properties are: ${allowedProperties.join(', ')}`;
  }
}

export function IsAllowedProperty(allowedProperties: string[]) {
  return Validate(IsAllowedPropertyConstraint, [allowedProperties]);
}
