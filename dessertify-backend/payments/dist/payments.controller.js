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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const common_1 = require("@nestjs/common");
const amqplib_1 = require("amqplib");
let PaymentsController = class PaymentsController {
    async customerCreatedEventHandler(msg, amqpMsg) {
        console.log(`Received message: ${JSON.stringify(msg)}`);
        console.log('amqpMsg ', amqpMsg);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, nestjs_rabbitmq_1.RabbitSubscribe)({
        exchange: 'customers-topic-exchange',
        routingKey: 'customers.created',
        queue: 'payments',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof amqplib_1.ConsumeMessage !== "undefined" && amqplib_1.ConsumeMessage) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "customerCreatedEventHandler", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)()
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map