import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from "../auth/auth.service";
import { InjectBroker } from 'nestjs-moleculer';
import { Context, Errors, Service, ServiceBroker } from 'moleculer';
import * as iap from 'in-app-purchase';
import { Model } from "mongoose";
import { Purchase } from "../interfaces/purchase.interface";
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PurchaseController extends Service {
    constructor(
        @InjectBroker() broker: ServiceBroker,
        @InjectModel('Purchase') private readonly purchaseModel: Model<Purchase>,
        @Inject(AuthService) private readonly authService: AuthService
    ) {
        super(broker);

        this.parseServiceSchema({
            name: "purchase",
            meta: {
                scalable: true
            },
            settings: {
                upperCase: true
            },
            actions: {
                apple: this.apple
            },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }

    serviceCreated() {
        this.logger.info("purchase service created.");
    }

    async serviceStarted() {
        this.logger.info("purchase service started.");
    }

    async serviceStopped() {
        this.logger.info("purchase service stopped.");
    }

    async apple(ctx: Context) {
        let receipt = ctx.params.receipt;
        let insertResult = await this.purchaseModel.insertMany({ type: 'apple', receipt: receipt });
        iap.config({ applePassword: process.env.APPLE_SHARED_SECRECT || '' });
        await iap.setup({
            test: false,
            verbose: true
        });
        let validateData = await iap.validate(ctx.params.receipt);
        let isValidated = await iap.isValidated(validateData);
        let purchaseData = iap.getPurchaseData(validateData);
        await this.purchaseModel.updateOne({_id:insertResult[0]._id},{validateData:validateData,purchaseData:purchaseData});
        return { data: isValidated };
    }
}
