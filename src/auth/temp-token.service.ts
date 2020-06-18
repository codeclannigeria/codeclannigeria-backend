import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { BaseService } from '../shared';
import { TemporaryToken } from '../shared/models/temporary-token.entity';

@Injectable()
export class TempTokensService extends BaseService<TemporaryToken> {
  constructor(
    @InjectModel(TemporaryToken.modelName)
    protected readonly tokenEntity: ReturnModelType<typeof TemporaryToken>
  ) {
    super(tokenEntity);
  }
}
