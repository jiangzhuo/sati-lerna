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
        return { code: 200, message: 'success',data:`hello ${body.name}` };
    }

    @Query('appleValidate')
    async appleValidate(req, body) {
        const { data } = await this.userBroker.call('purchase.apple', body);
        return { code: 200, message: 'success', data: data };
    }
}
