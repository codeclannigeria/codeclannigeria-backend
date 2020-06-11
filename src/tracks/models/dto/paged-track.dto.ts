import { PaginatedResDto } from '@shared/models/dto/paged-res.dto';

import { TrackDto } from './tack.dto';

export class PagedTrackResDto extends PaginatedResDto(TrackDto) {}
