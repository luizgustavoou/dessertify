import {
  AmqpConnection,
  defaultNackErrorHandler,
  Nack,
  RabbitPayload,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Controller, Post } from '@nestjs/common';
import { StripeService } from '@/infra/payments/stripe/stripe.service';
import { CreateCustomerDto, CreateChargeDto } from '@/presentation/dtos';
import { CreateCustomerUseCase } from '@/application/usecases';
import { ProcessOrderUseCase } from '@/application/usecases/process-order.usecase';
import amqplib from 'amqplib';

@Controller()
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly processOrderUseCase: ProcessOrderUseCase,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  @Post()
  testeStripe() {
    return this.stripeService.createPaymentIntent({
      amount: 200,
      orderId: '123',
    });
  }

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'payments.customer_registration',
    queueOptions: {
      deadLetterExchange: 'error-exchange',
      deadLetterRoutingKey: '',
    },
    errorHandler: (
      channel: amqplib.Channel,
      msg: amqplib.ConsumeMessage,
      error: any,
    ) => {
      // https://stackoverflow.com/questions/48508861/changing-the-headers-and-body-of-a-rabbitmq-message-when-retrying-it?utm_source=chatgpt.com
      // Recuperar a contagem de tentativas e incrementá-la
      // const retryCount = (msg.properties.headers['x-retry-count'] || 0) + 1;
      // console.log(`Retrying message, attempt #${retryCount}`);

      // console.log('msg.fields', msg.fields);
      // // Atualizando o cabeçalho com o novo número de tentativas
      // msg.properties.headers['x-retry-count'] = retryCount;

      // if (retryCount <= 3) {
      //   // Reenviar a mensagem para a fila principal com o novo cabeçalho
      //   channel.publish(
      //     msg.fields.exchange,
      //     msg.fields.routingKey,
      //     msg.content,
      //     {
      //       persistent: true,
      //       headers: msg.properties.headers,
      //     },
      //   );
      // } else {
      //   // Se o número máximo de tentativas for alcançado, enviar para a DLX ou realizar outra ação
      //   console.log('Max retry attempts reached, moving to DLX...');
      //   channel.sendToQueue('dlx_queue', msg.content, {
      //     persistent: true,
      //     headers: msg.properties.headers,
      //   });
      // }

      console.log('Enviar para a DLX');
      return channel.nack(msg, false, false); // Confirma que a mensagem foi processada
    },
  })
  public async customerCreatedEventHandler(
    // @RabbitPayload() msg: CreateCustomerDto,
    msg: any,
    amqpMsg: amqplib.ConsumeMessage,
  ) {
    console.log('[PAYMENTS - Customer Created Event Handler]');
    // console.log('msg ', msg)
    // console.log('amqpMsg ', amqpMsg)

    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error('Error on customerCreatedEventHandler');
    await this.createCustomerUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'error-exchange',
    routingKey: '',
    queue: 'requeue-queue',
  })
  public async customerDeadLetterQueue(
    msg: any,
    amqpMsg: amqplib.ConsumeMessage,
  ) {
    console.log('[PAYMENTS - Customer Dead Letter Queue]');

    const {
      'x-first-death-reason': reason,
      'x-first-death-queue': originalQueue,
    } = amqpMsg.properties.headers;

    if (!originalQueue || reason !== 'rejected') {
      console.log('Não é uma mensagem rejeitada ou não tem a fila de origem');
      return;
    }

    console.log(amqpMsg.properties.headers['x-death']);

    const xDeaths = amqpMsg.properties.headers['x-death'] ?? [];

    const rejectsCount =
      xDeaths.find((death) => death.reason === 'rejected').count ?? -1;

    if (rejectsCount === -1 || rejectsCount >= 10) {
      return;
    }

    this.amqpConnection.channel.sendToQueue(
      originalQueue,
      amqpMsg.content,
      amqpMsg.properties,
    );
  }

  @RabbitRPC({
    exchange: 'orders-topic-exchange',
    routingKey: 'orders.created',
    queue: 'rpc-payments.order_registration',
    errorHandler: defaultNackErrorHandler,
  })
  public async orderCreatedEventHandler(@RabbitPayload() msg: CreateChargeDto) {
    console.log('[PAYMENTS - Order Created Event Handler]');

    try {
      const res = await this.processOrderUseCase.execute(msg);

      return { client_secret: res.client_secret };
    } catch (error) {
      console.log('error ', error.message);

      return new Nack(false);
    }
  }
}
