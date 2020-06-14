import { OmitType } from '@nestjs/swagger';

import { TrackDto } from './tack.dto';

export class CreateTrackDto extends OmitType(TrackDto, ['id']) {}
