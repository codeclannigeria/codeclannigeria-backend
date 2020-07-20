import { BufferedFile } from '~shared/interfaces';
import { ProfileService } from './profile.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { UsersService } from '../users/users.service';
import { ProfileController } from './profile.controller';
import { ProfileModule } from './profile.module';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UnsupportedMediaTypeException, BadRequestException } from '@nestjs/common';

describe('Profile Controller', () => {
  let controller: ProfileController;
  const req: any = { user: { userId: "userId" } };
  const profileService: any = { uploadAvatar: () => Promise.resolve() }
  const userService: any = {
    findByIdAsync: () => 'user',
    findById: () => ({ tracks: [], id: 'id' })
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProfileModule, DbTest]
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .overrideProvider(ProfileService)
      .useValue(profileService)
      .compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get current logged in user', async () => {

    const result = await controller.getProfile(req);
    expect(result.id).toBe('id')
  });

  it('should update current user', async () => {
    const input: UpdateProfileDto = {
      firstName: 'firstName',
      lastName: 'lastName',
    }
    userService.updateAsync = () => Promise.resolve();
    return controller.updateProfile(input, req);
  });

  describe('Avatar Upload', () => {
    const file: BufferedFile = {
      fieldname: 'avatar',
      mimetype: 'video/mp4',
      buffer: 'string',
      encoding: 'encoding',
      size: 1024 * 201,
      originalname: 'avatar'
    }
    it(`should throw ${UnsupportedMediaTypeException.name} exception for non-image file`, async () => {
      await expect(controller.uploadFile(file, req)).rejects.toThrowError(UnsupportedMediaTypeException);
    });
    it(`should throw ${BadRequestException.name} exception if image is larger than 200KB`, async () => {
      file.mimetype = "image/jpg"
      await expect(controller.uploadFile(file, req)).rejects.toThrowError(BadRequestException);
    });
    it('should upload file', async () => {
      file.size = 1024 * 200;
      const result = await controller.uploadFile(file, req);
      expect(result).toBe('user')
    });
  });
});
