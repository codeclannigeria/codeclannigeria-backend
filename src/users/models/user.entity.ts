import { InternalServerErrorException } from '@nestjs/common';
import { index, pre, prop } from '@typegoose/typegoose';
import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import * as crypto from 'crypto';

import { columnSize } from '../../shared/constants';
import { BaseEntity } from '../../shared/models/base.entity';
import { Writable } from '../../shared/types';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
}

@pre<User>('save', async function() {
  try {
    (this as Writable<User>).password = await hash(this.password, 10);
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
})
@index({ email: 1 }, { unique: true })
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
  readonly lastName!: string;
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    lowercase: true,
    text: true,
    unique: false,
  })
  readonly email!: string;
  @prop({ required: true, maxlength: columnSize.length64 })
  @Exclude()
  readonly password!: string;

  @prop({
    enum: UserRole,
    type: String,
    required: true,
    default: UserRole.USER,
  })
  readonly role: UserRole = UserRole.USER;

  @prop({ required: true, default: false })
  readonly isEmailVerified: boolean;
  @prop({ default: undefined })
  readonly lockOutEndDate?: Date;
  @prop({ required: true, default: 0 })
  readonly failedSignInAttempts!: number;
  /**
   * Get User's full name
   *
   * @readonly
   * @memberof User
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  setRandomPass() {
    (this as Writable<User>).password = crypto
      .randomBytes(columnSize.length32)
      .toString();
  }
  confirmEmail() {
    (this as Writable<User>).isEmailVerified = true;
  }
}
