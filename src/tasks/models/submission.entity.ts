import { prop, Ref } from '@typegoose/typegoose';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

import { Task } from './task.entity';

export class Submission extends BaseEntity {
    @prop({
        required: true,
        maxlength: columnSize.length128,
    })
    readonly description: string;
    @prop({
        required: true,
        maxlength: columnSize.length128,
        trim: true,
        text: true,
        unique: false
    })
    readonly taskUrl: string;
    @prop({ ref: 'Task', required: true })
    readonly task: Ref<Task>;
}