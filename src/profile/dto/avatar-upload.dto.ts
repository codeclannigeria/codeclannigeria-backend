import { ApiProperty } from "@nestjs/swagger";

export class AvatarUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
