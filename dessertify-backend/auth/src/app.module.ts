import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { AuthService, AuthServiceImpl } from '@/domain/services/auth.service';
import { PrismaModule } from '@/infra/database/prisma.module';
import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import { PrismaAuthRepository } from '@/infra/repositories/auth.repository';
import {
  SigninUseCase,
  SigninUseCaseImpl,
} from '@/application/usecases/signin.usecase';
import {
  SignupUseCase,
  SignupUseCaseImpl,
} from '@/application/usecases/signup.usecase';
import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';
import { BcryptHashProvider } from '@/infra/providers/bcrypt-hash.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().port().required(),
        RABBITMQ_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'PAYMENTS_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          name: 'PAYMENTS_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'payments',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashProvider,
      useClass: BcryptHashProvider,
    },
    {
      provide: SignupUseCase,
      useClass: SignupUseCaseImpl,
    },
    {
      provide: SigninUseCase,
      useClass: SigninUseCaseImpl,
    },
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
})
export class AppModule {}
