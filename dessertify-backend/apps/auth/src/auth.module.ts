import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { CommonModule } from '@app/common';
import { AuthController } from '@app/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PAYMENTS_SERVICE',
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
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().port().required(),
        RABBITMQ_URL: Joi.string().required(),
        // PAYMENTS_HOST: Joi.string().required(),
        // PAYMENTS_TCP_PORT: Joi.number().port().required(),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
