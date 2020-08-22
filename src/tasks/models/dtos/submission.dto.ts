import { IsNumber, IsUrl, Max, MaxLength, Min } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';

export class SubmissionDto {
    @MaxLength(columnSize.length128)
    menteeComment: string;
    @MaxLength(columnSize.length128)
    mentorComment: string;
    @IsUrl()
    taskUrl: string;
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    gradePercentage: number;
}

export class PagedListSubmissionDto extends PagedListDto(SubmissionDto) { }
