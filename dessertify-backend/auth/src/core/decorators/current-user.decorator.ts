import { ITokenPayload } from '@/domain/interfaces/token-payload';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentCustomerByContext = (ctx: ExecutionContext): ITokenPayload => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
};

export const CurrentUser = createParamDecorator<
  keyof ITokenPayload | undefined,
  ExecutionContext
>((data: unknown, ctx: ExecutionContext) => getCurrentCustomerByContext(ctx));
