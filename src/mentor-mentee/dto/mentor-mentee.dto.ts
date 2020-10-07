import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { MentorMentee } from '~/mentor/models/mentor-mentee.entity';
import { PagedListDto } from '~shared/models/dto';

// const applyMixins = (derivedCtor: any, baseCtors: any[]) => {
//     baseCtors.forEach((baseCtor) => {
//       Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
//         if (name !== 'constructor') {
//           derivedCtor.prototype[name] = baseCtor.prototype[name];
//         }
//       });
//     });
//   };

export class MentorMenteeDto extends PickType(MentorMentee, [
  'mentee',
  'mentor',
  'track',
  'id'
]) {}

export class CreateMentorMenteeDto {
  @IsMongoId()
  @Expose()
  trackId: string;
  @IsMongoId()
  @Expose()
  mentorId: string;
  @IsMongoId()
  @Expose()
  menteeId: string;
}
export class PagedMentorMenteeDto extends PagedListDto(MentorMenteeDto) {}
