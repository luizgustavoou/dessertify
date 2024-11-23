import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const port = configService.get<number>('HTTP_PORT');


  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [configService.get<string>('RABBITMQ_URL')],
  //     queue: 'payments',
  //     noAck: false,
  //   },
  // });

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [configService.get<string>('RABBITMQ_URL')],
  //     queue: 'customers',
  //     noAck: false,
  //   },
  // });

  // await app.startAllMicroservices();
  await app.listen(port);

}
bootstrap();
