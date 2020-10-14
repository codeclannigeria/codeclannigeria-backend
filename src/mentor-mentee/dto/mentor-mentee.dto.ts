import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { SimpleUserDto } from '~/tasks/models/dtos/submission.dto';
import { TrackDto } from '~/tracks/models/dto/track.dto';
import { BaseDto, PagedListDto } from '~shared/models/dto';

// const applyMixins = (derivedCtor: any, baseCtors: any[]) => {
//     baseCtors.forEach((baseCtor) => {
//       Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
//         if (name !== 'constructor') {
//           derivedCtor.prototype[name] = baseCtor.prototype[name];
//         }
//       });
//     });
//   };
export class SimpleTrackDto extends PickType(TrackDto, ['title', 'id']) {}

export class MentorMenteeDto extends BaseDto {
  @Expose()
  readonly mentor: SimpleUserDto;
  @Expose()
  readonly mentee: SimpleUserDto;
  @Expose()
  readonly track: SimpleTrackDto;
}

export class CreateMentorMenteeDto {
  @IsMongoId()
  @Expose()
  track: string;
  @IsMongoId()
  @Expose()
  mentor: string;
  @IsMongoId()
  @Expose()
  mentee: string;
}
export class PagedMentorMenteeDto extends PagedListDto(MentorMenteeDto) {}
