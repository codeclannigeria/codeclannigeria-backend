import { Inject, Injectable, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  constructor(@Optional() @Inject(REQUEST) private readonly req: Request) {}
  get currentUser(): string | null {
    return !this.req || !this.req.user ? null : this.req.user['id'];
  }
}
