import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Query, Resolver, Mutation } from '@nestjs/graphql';

import { AuthGuard } from '../../user/auth/auth.guard';
import { ServiceBroker } from 'moleculer';
import { InjectBroker } from 'nestjs-moleculer';
import { LoggingInterceptor } from '../../../common/interceptors';
import { Permission } from '../../../common/decorators';

@Resolver()
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class PurchaseResolver {
    onModuleInit() {
    }

    constructor(
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    private logger = new Logger('purchase');

    @Query('sayPurchaseHello')
    async sayPurchaseHello(req, body) {
        return { code: 200, message: 'success', data: `hello ${body.name}` };
    }

    @Query('appleValidate')
    async appleValidate(req, body, context, resolveInfo) {
        const isReValidate = !!body.userId;
        const appleValidateRes = await this.userBroker.call('purchase.apple', {
            userId: body.userId || context.user.id,
            receipt: body.receipt
        }, {
            meta: {
                udid: context.udid,
                operationName: context.operationName,
                clientIp: context.clientIp,
            },
        });
        // 判断appleValidateRes然后做点什么
        if (appleValidateRes.isValidated) {
            // 验证过了的话，要不要给加上对应的钱
            // let purchaseData = [{
            //     "bundleId": "com.mindmobapp.MindMob",
            //     "appItemId": "521129812",
            //     "originalTransactionId": "1000000046178817",
            //     "transactionId": "1000000046178817",
            //     "productId": "com.mindmobapp.download",
            //     "originalPurchaseDate": "1335798355868",
            //     "purchaseDate": "1335798355868",
            //     "quantity": 1,
            //     "expirationDate": 0,
            //     "isTrial": false,
            //     "cancellationDate": 0
            // }];
            // let validateData = {
            //     "receipt": {
            //         "original_purchase_date_pst": "2012-04-30 08:05:55 America/Los_Angeles",
            //         "original_transaction_id": "1000000046178817",
            //         "original_purchase_date_ms": "1335798355868",
            //         "transaction_id": "1000000046178817",
            //         "quantity": "1",
            //         "product_id": "com.mindmobapp.download",
            //         "bvrs": "20120427",
            //         "purchase_date_ms": "1335798355868",
            //         "purchase_date": "2012-04-30 15:05:55 Etc/GMT",
            //         "original_purchase_date": "2012-04-30 15:05:55 Etc/GMT",
            //         "purchase_date_pst": "2012-04-30 08:05:55 America/Los_Angeles",
            //         "bid": "com.mindmobapp.MindMob",
            //         "item_id": "521129812"
            //     },
            //     "status": 0,
            //     "sandbox": true,
            //     "service": "apple"
            // }
            const validateData = JSON.parse(appleValidateRes.purchaseRecord.validateData);
            const purchaseData = await this.userBroker.call('purchase.getPurchaseByProductId', { productId: validateData.receipt.product_id });
            if (purchaseData && purchaseData.bundleId === validateData.receipt.bid && purchaseData.productId === validateData.receipt.product_id) {
                if (!appleValidateRes.isProcessed) {
                    await this.userBroker.call('user.changeBalance', {
                        id: body.userId || context.user.id,
                        changeValue: purchaseData.price * 100,
                        type: 'changeByIAP',
                        extraInfo: JSON.stringify({
                            operatorId: context.user.id,
                            operatorExtraInfo: body.extraInfo,
                            validateData: appleValidateRes,
                            purchaseData: purchaseData
                        }),
                    });
                }
            } else {
                throw new Error('no purchase')
            }
        }
        if(isReValidate){
            this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(appleValidateRes)}`);
        }
        return { code: 200, message: 'success', data: appleValidateRes };
    }

    @Query('searchReceipt')
    @Permission('admin')
    async searchReceipt(req, body, context) {
        const appleValidateRes = await this.userBroker.call('purchase.searchReceipt', {
            type: body.type,
            page: body.page,
            limit: body.limit,
            keyword: body.keyword
        }, {
            meta: {
                udid: context.udid,
                operationName: context.operationName,
                clientIp: context.clientIp,
            },
        });
        return { code: 200, message: 'success', data: appleValidateRes };
    }

    @Mutation('createPurchase')
    @Permission('editor')
    async createPurchase(req, body, context, resolveInfo) {
        const data = await this.userBroker.call('purchase.createPurchase', body.data);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('deletePurchase')
    @Permission('editor')
    async deletePurchase(req, body: { id: string }, context, resolveInfo) {
        const data = await this.userBroker.call('purchase.deletePurchase', body);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Query('searchPurchase')
    @Permission('editor')
    async searchPurchase(req, body, context, resolveInfo) {
        const data = await this.userBroker.call('purchase.searchPurchase', {
            type: body.type,
            page: body.page,
            limit: body.limit,
        });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }
}
