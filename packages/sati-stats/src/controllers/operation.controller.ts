import { Inject, Injectable } from '@nestjs/common';

import { InjectBroker } from 'nestjs-moleculer';
import { ServiceBroker, Service, Context, Errors } from 'moleculer';
import MoleculerError = Errors.MoleculerError;
import { OperationService } from '../services/operation.service';

@Injectable()
export class OperationController extends Service {
    constructor(
        @InjectBroker() broker: ServiceBroker,
        @Inject(OperationService) private readonly operationService: OperationService
    ) {
        super(broker);

        this.parseServiceSchema({
            name: "operation",
            //version: "v2",
            meta: {
                scalable: true
            },
            settings: {
                upperCase: true
            },
            actions: {
                getOperation: this.getOperation
            },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }

    serviceCreated() {
        this.logger.info("operation service created.");
    }

    async serviceStarted() {
        this.logger.info("operation service started.");
    }

    async serviceStopped() {
        this.logger.info("operation service stopped.");
    }

    async getOperation(ctx: Context) {
        return {
            total: await this.operationService.countOperation(ctx.params.page, ctx.params.limit, ctx.params.namespace, ctx.params.module, ctx.params.operationName, ctx.params.fieldName),
            data: await this.operationService.getOperation(ctx.params.page, ctx.params.limit, ctx.params.namespace, ctx.params.module, ctx.params.operationName, ctx.params.fieldName)
        };
    }
}
