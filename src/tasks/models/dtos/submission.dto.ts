import { IsMongoId, IsUrl, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';

export class SubmissionDto {
    @MaxLength(columnSize.length128)
    description: string;
    @IsMongoId()
    taskId: string;
    @IsUrl()
    taskUrl: string;
}