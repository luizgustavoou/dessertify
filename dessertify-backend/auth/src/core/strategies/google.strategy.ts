import { GoogleSigninUseCase } from '@/application/usecases/google-signin.usecase';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly googleSigninUseCase: GoogleSigninUseCase,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: configService.get<string>('callbackURL'),
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    return this.googleSigninUseCase.execute({
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
    });
  }
}
