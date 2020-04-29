import { modelOptions, prop } from '@typegoose/typegoose';

import { TemporaryToken } from '../../shared/models/temporary-token.entity';

@modelOptions({ options: { customName: 'temp_email_tokens' } })
export class EmailToken extends TemporaryToken {
  @prop({ type: Date, required: true, default: Date.now, expires: '5m' })
  expiresAt!: Date;
  @prop({ required: true })
  email!: string;
}
