import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('TCP_PORT'),
    },
    // transport: Transport.RMQ,
    // options: {
    //   urls: [configService.get<string>('RABBITMQ_URL')],
    //   queue: 'payments',
    // },
  });

  await app.startAllMicroservices();
}
bootstrap();
