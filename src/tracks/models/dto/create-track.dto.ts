import { PickType } from '@nestjs/swagger';

import { TrackDto } from './tack.dto';

export class CreateTrackDto extends PickType(TrackDto, [
  'title',
  'description'
]) {}
