import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';

import { InternalServerErrorException } from '@nestjs/common';
import { pre, prop } from '@typegoose/typegoose';

import { columnSize } from '../../shared/constants';
import { BaseEntity } from '../../shared/models/base.entity';
import { Writable } from '../../shared/utils/writable';

export enum UserRole {
  User = 'User',
  Admin = 'Admin',
}

@pre<User>('save', async function() {
  try {
    (this as Writable<User>).password = await hash(this.password, 10);
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
  readonly firstName!: string;
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    text: true,
    unique: false,
  })
  readonly lastName: string;
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    lowercase: true,
    text: true,
    unique: true,
  })
  readonly email!: string;
  @prop({ required: true, maxlength: columnSize.length64 })
  @Exclude()
  readonly password!: string;

  @prop({
    enum: UserRole,
    type: String,
    required: true,
    default: UserRole.User,
  })
  readonly role: UserRole = UserRole.User;
  /**
   * Get User's full name
   *
   * @readonly
   * @memberof User
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
