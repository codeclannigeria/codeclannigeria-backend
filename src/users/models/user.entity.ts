import { columnSize } from '../../shared/constants';
import { BaseEntity } from '../../shared/models/base.entity';
import { prop, pre } from '@typegoose/typegoose';

@pre<User>('save', function() {
  this.password = 'Yeller';
})
export class User extends BaseEntity {
  @prop({ required: true, maxlength: columnSize.length64 })
  firstName: string;
  @prop({ required: true, maxlength: columnSize.length64 })
  lastName: string;
  @prop({ unique: true, index: true, maxlength: columnSize.length64 })
  email: string;
  @prop({ required: true, maxlength: columnSize.length64 })
  password: string;
}
