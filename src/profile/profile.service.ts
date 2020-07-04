import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import * as cloudinary from 'cloudinary';
import DataUri = require('datauri/parser');
import configuration from '~shared/config/configuration';

import { User } from '../users/models/user.entity';

@Injectable()
export class ProfileService {
    uploader: typeof cloudinary.v2.uploader;


    constructor(@InjectModel(User.modelName)
    protected readonly userEntity: ReturnModelType<typeof User>) {
        const { cloudinary: config } = configuration();
        cloudinary.v2.config({
            cloud_name: config.name,
            api_key: config.key,
            api_secret: config.secret
        })
        this.uploader = cloudinary.v2.uploader
    }
    async uploadAvatar(file: any, userId: string): Promise<void> {
        const dataUri = new DataUri();
        const { content } = dataUri.format(`.${file.originalname.split('.')[0]}`, file.buffer)
        const { secure_url } = await this.uploader.upload(content, { discard_original_filename: true, folder: 'ccn/avatars', public_id: userId });

        await this.userEntity.updateOne({ _id: userId }, { photoUrl: secure_url })
    }
}
