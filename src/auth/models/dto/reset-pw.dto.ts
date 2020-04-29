import { IsNotEmpty } from 'class-validator';

import { ValidateTokenInput } from './validate-token.dto';

export class ResetPassInput extends ValidateTokenInput {
  @IsNotEmpty()
  newPassword: string;
}
