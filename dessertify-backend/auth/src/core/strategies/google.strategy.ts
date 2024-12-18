import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
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
    console.log({ profile });
    console.log(profile.photos)
    console.log(profile.emails)

    return {
      email: profile.emails[0].value,
      name: profile.displayName,
      photo: profile.photos[0].value,
    }
  }
}
