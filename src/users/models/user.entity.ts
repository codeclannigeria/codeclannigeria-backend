import { InternalServerErrorException } from '@nestjs/common';
import { pre, prop } from '@typegoose/typegoose';
import { hash } from 'bcrypt';
import { columnSize } from '../../shared/constants';
import { BaseEntity } from '../../shared/models/base.entity';
@pre<User>('save', async function() {
  try {
    this.password = await hash(this.password, 10);
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
})
export class User extends BaseEntity {
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    text: true,
    unique: false,
  })
  firstName: string;
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    text: true,
    unique: false,
  })
  lastName: string;
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    lowercase: true,
    text: true,
    unique: true,
  })
  email: string;
  @prop({ required: true, maxlength: columnSize.length64 })
  password: string;
}
