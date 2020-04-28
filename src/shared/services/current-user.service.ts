import { Injectable, Scope, Optional, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  constructor(@Optional() @Inject(REQUEST) private readonly req) {}
  get currentUser(): string | null {
    return !this.req || !this.req.user ? null : this.req.user.id;
  }
}
