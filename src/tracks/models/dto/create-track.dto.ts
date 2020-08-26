import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { BufferedFile } from '~shared/interfaces/buffer-file.interface';

import { TrackDto } from './track.dto';

export class CreateTrackDto extends OmitType(TrackDto, [
  'id',
  'createdAt',
  'updatedAt',
  'thumbnailUrl',
  'userStage'
]) {}

export class CreateWithThumbnailTrackDto extends OmitType(TrackDto, [
  'id',
  'createdAt',
  'updatedAt',
  'thumbnailUrl',
  'userStage'
]) {
  @ApiProperty({ type: 'string', format: 'binary' })
  thumbnail: BufferedFile;
}

export class MentorInput {
  @IsMongoId()
  @Expose()
  mentorId: string;
}
