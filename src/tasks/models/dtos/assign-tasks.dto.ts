import { IsArray, IsMongoId } from 'class-validator';

export class AssignTasksDto {
  @IsArray()
  @IsMongoId({ each: true })
  taskIdList: string[];
  @IsMongoId()
  userId: string;
}