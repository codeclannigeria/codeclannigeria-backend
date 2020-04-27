import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import * as crypto from 'crypto';
import { InternalServerErrorException } from '@nestjs/common';
import { pre, prop, index } from '@typegoose/typegoose';

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
  readonly lastName: string;
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
    default: UserRole.User,
  })
  readonly role: UserRole = UserRole.User;

  @prop({ expires: 60, default: undefined })
  readonly passwordResetToken: string;
  @prop({ unique: true, expires: 60 })
  readonly emailConfirmationToken: string;

  @prop({ required: true, default: false })
  readonly isEmailVerified: boolean = false;
  @prop({ default: undefined })
  readonly lockOutEndDate?: Date;
  @prop({ required: true, default: 0 })
  readonly failedSignInAttempts: number;
  /**
   * Get User's full name
   *
   * @readonly
   * @memberof User
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  setRandomPw() {
    (this as Writable<User>).password = crypto
      .randomBytes(columnSize.length32)
      .toString();
  }
  setEmailConfirmationToken() {
    (this as Writable<User>).emailConfirmationToken = `${this.id}3hdafdfadsfa`;
  }
  setPasswordResetToken() {
    (this as Writable<User>).passwordResetToken = `${this.id}3hdafdfadsfa`;
  }
}
