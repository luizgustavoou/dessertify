"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Joi = require("joi");
const payments_service_1 = require("./payments.service");
const prisma_module_1 = require("./infra/database/prisma.module");
const rabbitmq_module_1 = require("./infra/messaging/rabbitmq/rabbitmq.module");
const stripe_module_1 = require("./infra/payments/stripe/stripe.module");
const controllers_1 = require("./presentation/controllers");
const usecases_1 = require("./application/usecases");
const services_1 = require("./domain/services");
const repositories_1 = require("./infra/repositories");
const repositories_2 = require("./domain/repositories");
const process_order_usecase_1 = require("./application/usecases/process-order.usecase");
const amqplib = require("amqplib");
let AppModule = class AppModule {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
    }
    async setup() {
        const connection = await amqplib.connect(this.configService.get('RABBITMQ_URL'));
        const main_queue = 'my_queue';
        const requeue_queue = 'requeue-queue2';
        const error_exchange = 'error-exchange2';
        const my_exchange = 'my_exchange';
        const channel = await connection.createChannel();
        await channel.assertExchange(error_exchange, 'fanout', { durable: true });
        await channel.assertExchange(my_exchange, 'topic', { durable: true });
        await channel.assertQueue(main_queue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': error_exchange,
                'x-dead-letter-routing-key': '',
            },
        });
        await channel.assertQueue(requeue_queue, {
            durable: true,
            exclusive: false,
        });
        await channel.bindQueue(main_queue, my_exchange, 'my_key');
        await channel.bindQueue(requeue_queue, error_exchange, '');
        channel.consume(main_queue, async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('[my_queue] vou enviar para a DLX!');
            channel.nack(msg, false, false);
        });
        channel.consume(requeue_queue, (msg) => {
            if (msg !== null) {
                const xDeath = msg.properties.headers['x-death'];
                const originalQueue = msg.properties.headers['x-first-death-queue'];
                if (xDeath) {
                    console.log('xDeath[0].count ', xDeath[0].count);
                    console.log('Dead-letter reason:', xDeath[0].reason);
                    console.log('Original exchange:', xDeath[0].exchange);
                    console.log('Original routing key:', xDeath[0]['routing-keys']);
                }
                channel.sendToQueue(originalQueue, msg.content, msg.properties);
            }
        });
        setTimeout(() => {
            channel.publish(my_exchange, 'my_key', Buffer.from('Hello, world!'));
        }, 3000);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            stripe_module_1.StripeModule,
            rabbitmq_module_1.RabbitMqModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    RABBITMQ_URL: Joi.string().required(),
                    DATABASE_URL: Joi.string().required(),
                    HTTP_PORT: Joi.number().port().required(),
                    STRIPE_SECRET_KEY: Joi.string().required(),
                }),
            }),
            prisma_module_1.PrismaModule,
        ],
        controllers: [controllers_1.PaymentsController, controllers_1.PaymentsIntentsStripeWebhook],
        providers: [
            payments_service_1.PaymentsService,
            controllers_1.PaymentsController,
            { provide: usecases_1.CreateCustomerUseCase, useClass: usecases_1.CreateCustomerUseCaseImpl },
            {
                provide: services_1.CustomersService,
                useClass: services_1.CustomersServiceImpl,
            },
            {
                provide: repositories_2.CustomersRepository,
                useClass: repositories_1.PrismaCustomersRepository,
            },
            {
                provide: process_order_usecase_1.ProcessOrderUseCase,
                useClass: process_order_usecase_1.ProcessOrderUseCaseImpl,
            },
        ],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map