import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from 'src/shared';

import { EmailToken } from './models/email-token.entity';

@Injectable({ scope: Scope.REQUEST })
export class TempEmailTokenService extends BaseService<EmailToken> {
  constructor(
    @InjectModel(EmailToken.modelName)
    private readonly emailTokenEntity: ReturnModelType<typeof EmailToken>,
  ) {
    super(emailTokenEntity);
  }
}
