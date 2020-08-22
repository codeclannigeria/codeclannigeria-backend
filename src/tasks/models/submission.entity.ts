import { prop, Ref } from '@typegoose/typegoose';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

import { User } from '../../users/models/user.entity';
import { Task } from './task.entity';

export class Submission extends BaseEntity {
    @prop({
        required: true,
        maxlength: columnSize.length128,
    })
    readonly menteeComment: string;
    @prop({
        required: true,
        maxlength: columnSize.length128,
    })
    readonly mentorComment: string;
    @prop({
        required: true,
        maxlength: columnSize.length128,
        trim: true,
        text: true,
        unique: false
    })
    readonly taskUrl: string;
    @prop({
        min: 0,
        max: 100,
        default: null
    })
    readonly gradePercentage: number;
    @prop({ ref: Task, required: true })
    readonly task: Ref<Task>;
    @prop({ ref: User, required: true })
    readonly mentor: Ref<User>;
}