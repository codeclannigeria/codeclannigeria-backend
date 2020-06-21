import { Test, TestingModule } from '@nestjs/testing';

import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    process.env.MAILER_API_KEY = 'api_key_mailgun';
    process.env.MAILER_DOMAIN = 'mailer_domain_mailgun';
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService]
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
