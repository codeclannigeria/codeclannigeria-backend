import * as cloudinary from 'cloudinary';
import DataURIParser = require('datauri/parser');
import configuration from '~shared/config/configuration';
import { BufferedFile } from '~shared/interfaces';

export const uploadFileToCloud = async (file: BufferedFile, folderName: string, uniqId?: string): Promise<string> => {

    const { cloudinary: config } = configuration();
    cloudinary.v2.config({
        cloud_name: config.name,
        api_key: config.key,
        api_secret: config.secret
    })

    const dataUri = new DataURIParser()
    const { content } = dataUri.format(`.${file.originalname.split('.')[0]}`, file.buffer)
    const { secure_url } = await cloudinary.v2.uploader.upload(content,
        { discard_original_filename: true, folder: `ccn/${folderName}`, public_id: uniqId });

    return secure_url;
}