import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

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
    async appleValidate(req, body, context) {
        const appleValidateRes = await this.userBroker.call('purchase.apple', {
            userId: context.user.id,
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
        }
        return { code: 200, message: 'success', data: appleValidateRes };
    }

    @Query('searchReceipt')
    @Permission('admin')
    async searchPurchase(req, body, context) {
        const appleValidateRes = await this.userBroker.call('purchase.search', {
            type: body.type,
            page: body.page,
            limit: body.limit,
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
        }
        return { code: 200, message: 'success', data: appleValidateRes };
    }
}
