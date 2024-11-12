import { NestFactory } from '@nestjs/core';
import { AuthModule } from '@app/auth/auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);

  await app.startAllMicroservices();

  const port = configService.get<number>('HTTP_PORT');
  await app.listen(port);
}
bootstrap();
