import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BufferedFile } from '~shared/interfaces/buffer-file.interface';

import { TrackDto } from './track.dto';
import { IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateTrackDto extends OmitType(TrackDto, [
  'id',
  'createdAt',
  'updatedAt',
  'thumbnailUrl'
]) {

}


export class CreateWithThumbnailTrackDto extends OmitType(TrackDto, [
  'id',
  'createdAt',
  'updatedAt',
  'thumbnailUrl'
]) {
  @ApiProperty({ type: 'string', format: 'binary' })
  thumbnail: BufferedFile;
}

export class MentorInput {
  @IsMongoId()
  @Expose()
  mentorId: string;
}