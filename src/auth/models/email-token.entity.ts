import { modelOptions, prop } from '@typegoose/typegoose';

import { TemporaryToken } from '../../shared/models/temporary-token.entity';

@modelOptions({ options: { customName: 'temp_email_tokens' } })
export class EmailToken extends TemporaryToken {
  @prop({
    type: Date,
    required: true,
    default: Date.now,
    expires: 90000,
  })
  readonly expiresAt!: Date;
  @prop({ required: true })
  readonly email!: string;
}
