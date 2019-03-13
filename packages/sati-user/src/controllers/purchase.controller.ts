import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from "../auth/auth.service";
import { InjectBroker } from 'nestjs-moleculer';
import { Context, Errors, Service, ServiceBroker } from 'moleculer';
import * as iap from 'in-app-purchase';
import { Model } from "mongoose";
import { Receipt } from "../interfaces/receipt.interface";
import { Purchase } from "../interfaces/purchase.interface";
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import * as moment from "moment";

@Injectable()
export class PurchaseController extends Service {
    constructor(
        @InjectBroker() broker: ServiceBroker,
        @InjectModel('Receipt') private readonly receiptModel: Model<Receipt>,
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
                searchReceipt: this.searchReceipt,
                searchPurchase: this.searchPurchase,
                createPurchase: this.createPurchase,
                deletePurchase: this.deletePurchase,
                getPurchaseByProductId: this.getPurchaseByProductId
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

    async searchPurchase(ctx: Context) {
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

    async createPurchase(ctx: Context) {
        let data = ctx.params;
        if (!["appleConsumable", "appleNonConsumable", "appleAutoRenewableSubscription", "appleNonRenewingSubscription"].includes(data.type)) {
            throw new Error('wrong iap type')
        }
        data.createTime = moment().unix();
        data.updateTime = moment().unix();
        return await this.purchaseModel.create(data)
    }

    async deletePurchase(ctx: Context) {
        return await this.purchaseModel.findOneAndRemove({ _id: ctx.params.id });
    }

    async getPurchaseByProductId(ctx: Context) {
        return await this.purchaseModel.findOne({ productId: ctx.params.productId })
    }

    async searchReceipt(ctx: Context) {
        let query = {};
        let page = ctx.params.page;
        let limit = ctx.params.limit;
        // 构建条件搜索purchase
        if (!isEmpty(ctx.params.type)) {
            query['type'] = ctx.params.type;
        }
        let data = await this.receiptModel.find(query, null, { limit: limit, skip: (page - 1) * limit }).exec();
        let total = await this.receiptModel.countDocuments(query).exec();
        return { total, data }
    }

    async apple(ctx: Context) {
        let receipt = ctx.params.receipt;
        let userId = ctx.params.userId;
        await this.receiptModel.insertMany({ createTime: moment().unix(), updateTime: moment().unix(), type: 'received', receipt: receipt, userId: ctx.params.userId });
        let findResult = await this.receiptModel.find({ receipt: receipt, type: 'apple' }).exec();
        // if (findResult && findResult.length > 0) {
        //     if (findResult.userId.toString() !== userId) {
        //         throw new Error('other user already had this receipt');
        //     }
        //     // else if (findResult.validateData) {
        //     //     throw new Error('you already commit this receipt and already validate')
        //     // }
        // }
        let isProcessed = false;
        for (let res of findResult) {
            if (res.userId.toString() !== userId) {
                throw new Error('other user already had this receipt');
            }
            isProcessed = isProcessed || res.isProcessed
        }
        iap.config({ applePassword: process.env.APPLE_SHARED_SECRECT || '' });
        await iap.setup();
        let validateData = await iap.validate(ctx.params.receipt);
        let isValidated = await iap.isValidated(validateData);
        let purchaseData = iap.getPurchaseData(validateData);
        let isCanceled = await Promise.all(purchaseData.map(data => iap.isCanceled(data)));
        let isExpired = await Promise.all(purchaseData.map(data => iap.isExpired(data)));
        let purchaseRecord = await this.receiptModel.insertMany({
            createTime: moment().unix(),
            updateTime: moment().unix(),
            type: 'apple',
            userId: ctx.params.userId,
            receipt: receipt,
            validateData: JSON.stringify(validateData),
            purchaseData: JSON.stringify(purchaseData),
            isProcessed: isProcessed
        });
        return {
            isValidated: isValidated,
            isCanceled: isCanceled,
            isExpired: isExpired,
            purchaseRecord: purchaseRecord[0],
            isProcessed: isProcessed
        };
    }
}
