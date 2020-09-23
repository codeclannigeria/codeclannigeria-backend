import { InternalServerErrorException } from '@nestjs/common';
import {
  getModelForClass,
  index,
  pre,
  prop,
  Ref,
  ReturnModelType
} from '@typegoose/typegoose';
import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import * as crypto from 'crypto';
import { Writable } from '~shared/types/abstract.type';

import { columnSize } from '../../shared/constants';
import { BaseEntity } from '../../shared/models/base.entity';
import { Track } from '../../tracks/models/track.entity';

export enum UserRole {
  MENTEE = 'MENTEE',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNSPECIFIED = 'UNSPECIFIED'
}
@pre<User>('save', async function () {
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
    text: true
  })
  readonly firstName!: string;
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    text: true
  })
  readonly lastName!: string;
  @prop({
    required: true,
    maxlength: columnSize.length64,
    trim: true,
    lowercase: true,
    text: true,
    unique: false
  })
  readonly email!: string;
  @prop({
    maxlength: columnSize.length64,
    trim: true,
    text: true,
    default: null
  })
  readonly phoneNumber!: string;
  @prop({ default: null })
  readonly photoUrl: string = null;
  @prop({
    maxlength: columnSize.length128,
    trim: true,
    text: true,
    default: null
  })
  readonly description!: string;
  @prop({
    maxlength: columnSize.length64,
    trim: true,
    text: true,
    default: null
  })
  readonly city: string = null;
  @prop({
    maxlength: columnSize.length64,
    trim: true,
    text: true,
    default: null
  })
  readonly country: string = null;
  @prop({
    enum: Gender,
    type: String,
    default: Gender.UNSPECIFIED
  })
  readonly gender: Gender = Gender.UNSPECIFIED;
  @prop({ type: Date, default: null })
  readonly dob: Date = null;
  @prop({ type: String, default: null })
  readonly technologies: string[] = [];
  @prop({ required: true, maxlength: columnSize.length64 })
  @Exclude()
  readonly password!: string;
  @Exclude()
  @prop({ default: 0 })
  readonly loginAttemptCount!: number;
  @prop({
    enum: UserRole,
    type: String,
    required: true,
    default: UserRole.MENTEE
  })
  readonly role = UserRole.MENTEE;
  @prop({ required: true, default: false })
  readonly isEmailVerified: boolean;
  @prop({ default: undefined })
  readonly lockOutEndDate?: Date;
  @prop({ required: true, default: 0 })
  readonly failedSignInAttempts!: number;
  @prop({ ref: Track, default: [] })
  readonly tracks: Ref<Track>[] = [];
  @prop({ default: 0 })
  readonly notifyCount: number;
  @prop({ default: 0 })
  readonly notifUnreadCount: number;
  /**
   * Get User's full name
   *
   * @readonly
   * @memberof User
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  setRandomPass(): void {
    (this as Writable<User>).password = crypto
      .randomBytes(columnSize.length32)
      .toString();
  }
  confirmEmail(): void {
    (this as Writable<User>).isEmailVerified = true;
  }
  static get model(): ReturnModelType<typeof User> {
    return getModelForClass(this);
  }
}
