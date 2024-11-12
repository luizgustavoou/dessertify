import { NestFactory } from '@nestjs/core';
import { AuthModule } from '@app/auth/auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log(process.env.HTTP_PORT);
  console.log(process.env.RABBITMQ_URL);

  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('HTTP_PORT');
  await app.listen(port);
}
bootstrap();
