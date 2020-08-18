import { UserDto } from './../../users/models/dto/user.dto';
import { PickType } from "@nestjs/swagger";

export class MentorDto extends PickType(UserDto, ["firstName", "lastName", "technologies", "photoUrl", "description", "id"]) { }