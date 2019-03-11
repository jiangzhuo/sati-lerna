import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from "../auth/auth.service";
import { InjectBroker } from 'nestjs-moleculer';
import { Context, Errors, Service, ServiceBroker } from 'moleculer';
import * as iap from 'in-app-purchase';
import { Model } from "mongoose";
import { Purchase } from "../interfaces/purchase.interface";
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';

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
                apple: this.apple,
                search: this.search
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

    async search(ctx: Context) {
        let query = {};
        let page = ctx.params.page;
        let limit = ctx.params.limit;
        // 构建条件搜索purchase
        if (!isEmpty(ctx.params.type)) {
            query['type'] = ctx.params.type;
        }
        let data = await this.purchaseModel.find(query, null, { limit: limit, skip: (page - 1) * limit }).exec();
        let total = await this.purchaseModel.countDocuments(query).exec();
        return { total, data }
    }

    async apple(ctx: Context) {
        let receipt = ctx.params.receipt;
        let userId = ctx.params.userId;
        await this.purchaseModel.insertMany({ type: 'received', receipt: receipt });
        let findResult = await this.purchaseModel.findOne({ receipt: receipt });
        if (findResult && findResult.userId) {
            if (findResult.userId.toString() !== userId) {
                throw new Error('other user already had this receipt');
            }
        }
        // let insertResult = await this.purchaseModel.insertMany({
        //     type: 'apple',
        //     userId: ctx.params.userId,
        //     receipt: receipt
        // });
        iap.config({ applePassword: process.env.APPLE_SHARED_SECRECT || '' });
        await iap.setup();
        let validateData = await iap.validate(ctx.params.receipt);
        let isValidated = await iap.isValidated(validateData);
        let purchaseData = iap.getPurchaseData(validateData);
        let isCanceled = await Promise.all(purchaseData.map(data => iap.isCanceled(data)));
        let isExpired = await Promise.all(purchaseData.map(data => iap.isExpired(data)));
        await this.purchaseModel.updateOne({ receipt: receipt }, {
            type: 'apple',
            userId: ctx.params.userId,
            receipt: receipt,
            validateData: JSON.stringify(validateData),
            purchaseData: JSON.stringify(purchaseData)
        }, { upsert: true });
        return { isValidated: isValidated, isCanceled: isCanceled, isExpired: isExpired };
    }
}
