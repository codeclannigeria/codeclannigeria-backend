import { prop } from '@typegoose/typegoose';
import { BaseEntity } from 'src/shared/models/base.entity';

export class User extends BaseEntity {
  @prop()
  firstName: string;
  @prop()
  lastName: string;
  @prop()
  email: string;
  @prop()
  password: string;
}
