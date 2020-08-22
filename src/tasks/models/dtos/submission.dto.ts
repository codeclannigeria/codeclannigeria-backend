import { IsNumber, IsUrl, Max, MaxLength, Min, IsOptional } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto, BaseDto } from '~shared/models/dto';

export class SubmissionDto extends BaseDto {
    @MaxLength(columnSize.length128)
    @IsOptional()
    menteeComment?: string;
    @MaxLength(columnSize.length128)
    @IsOptional()
    mentorComment?: string;
    @IsUrl()
    taskUrl: string;
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    gradePercentage: number;
}

export class PagedListSubmissionDto extends PagedListDto(SubmissionDto) { }
