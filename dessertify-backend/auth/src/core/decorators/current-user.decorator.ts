import { ITokenPayload } from '@/application/interfaces/token-payload';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator<
  keyof ITokenPayload | undefined,
  ExecutionContext
>((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user = request.user;

  return typeof data === 'undefined' ? user : user[data];
});
