import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'customers-topic-exchange',
            type: 'topic',
          },
          {
            name: 'orders-topic-exchange',
            type: 'topic',
          },
          {
            name: 'payments-topic-exchange',
            type: 'topic',
          },
          {
            name: 'error-exchange',
            type: 'fanout',
          },
          {
            name: 'wait-exchange',
            type: 'fanout',
          },
          {
            name: 'requeue-exchange',
            type: 'fanout',
          },
        ],
        queues: [
          {
            exchange: 'wait-exchange',
            routingKey: '',
            name: 'wait-queue',
            options: {
              deadLetterExchange: 'requeue-exchange',
              deadLetterRoutingKey: '',
            },
          },
        ],
        uri: configService.get<string>('RABBITMQ_URL'),
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMqModule {}
