import { index, modelOptions } from '@typegoose/typegoose';

import { TemporaryToken } from '../../shared/models/temporary-token.entity';

@modelOptions({ options: { customName: 'password_reset_tokens' } })
@index({ createdAt: 1 }, { expireAfterSeconds: 1 })
export class PasswordToken extends TemporaryToken {}
