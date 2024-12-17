"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let AppModule = class AppModule {
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
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map