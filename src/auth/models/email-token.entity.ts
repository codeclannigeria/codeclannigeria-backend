import { index, modelOptions } from '@typegoose/typegoose';

import { TemporaryToken } from '../../shared/models/temporary-token.entity';

@modelOptions({ options: { customName: 'email_confirmation_tokens' } })
@index({ createdAt: 1 }, { expireAfterSeconds: 1 })
export class EmailToken extends TemporaryToken {}
