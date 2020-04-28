import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { TemporaryToken } from '../models/temporary-token.entity';
import { BaseService } from './base.service';

@Injectable()
export abstract class TemporaryTokenService<
  T extends TemporaryToken
> extends BaseService<T> {
  protected entity: ReturnModelType<AnyParamConstructor<T>>;

  protected constructor(entity: ReturnModelType<AnyParamConstructor<T>>) {
    super(entity);
    this.entity = entity;
  }
}
