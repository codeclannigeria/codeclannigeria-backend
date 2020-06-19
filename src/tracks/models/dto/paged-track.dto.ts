import { PagedResDto } from '~shared/models/dto/paged-res.dto';

import { TrackDto } from './tack.dto';

export class PagedTrackResDto extends PagedResDto(TrackDto) {}
