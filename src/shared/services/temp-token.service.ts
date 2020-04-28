import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';

import { TemporaryToken } from '../models/temporary-token.entity';
import { BaseService } from './base.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TemporaryTokenService<
  T extends TemporaryToken
> extends BaseService<T> {
  protected entity: ReturnModelType<AnyParamConstructor<T>>;

  constructor(entity: ReturnModelType<AnyParamConstructor<T>>) {
    super(entity);
    this.entity = entity;
  }
}
