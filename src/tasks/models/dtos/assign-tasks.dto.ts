import { IsArray, IsMongoId } from 'class-validator';

export class AssignTasksDto {
  @IsArray()
  @IsMongoId({ each: true })
  taskIdList: string[];
  @IsArray()
  @IsMongoId({ each: true })
  userIdList: string[];
}
