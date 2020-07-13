import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BufferedFile } from '~shared/interfaces';
import { uploadImg } from '~shared/utils/upload-img.util';

import { User } from '../users/models/user.entity';

@Injectable()
export class ProfileService {


    constructor(@InjectModel(User.modelName)
    protected readonly userEntity: ReturnModelType<typeof User>) { }

    async uploadAvatar(file: BufferedFile, userId: string): Promise<void> {
        const photoUrl = await uploadImg(file, "avatars", userId);
        await this.userEntity.updateOne({ _id: userId }, { photoUrl })
    }
}
