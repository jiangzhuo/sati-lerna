import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ServiceBroker } from "moleculer";
import { InjectBroker } from 'nestjs-moleculer';

@Controller()
export class IAPController {
    constructor(
        @InjectBroker() private readonly userBroker: ServiceBroker,
    ) {
    }

    @Post('apple/subscription')
    @HttpCode(200)
    async appleSubscription(@Body() body) {
        await this.userBroker.call('purchase.appleSubscription', body);

        // body = {
        //     "environment": "PROD",
        //     "auto_renew_status": "false",
        //     "web_order_line_item_id": "***",
        //     "latest_expired_receipt_info": {
        //         "original_purchase_date_pst": "2018-03-17 05:09:03 America/Los_Angeles",
        //         "cancellation_date_ms": "1522134672000",
        //         "quantity": "1",
        //         "cancellation_reason": "0",
        //         "unique_vendor_identifier": "***",
        //         "original_purchase_date_ms": "1521288543000",
        //         "expires_date_formatted": "2019-03-24 12:09:02 Etc/GMT",
        //         "is_in_intro_offer_period": "false",
        //         "purchase_date_ms": "1521893342000",
        //         "expires_date_formatted_pst": "2019-03-24 05:09:02 America/Los_Angeles",
        //         "is_trial_period": "false",
        //         "item_id": "***",
        //         "unique_identifier": "***",
        //         "original_transaction_id": "***",
        //         "expires_date": "1553429342000",
        //         "app_item_id": "***",
        //         "transaction_id": "***",
        //         "bvrs": "2",
        //         "web_order_line_item_id": "***",
        //         "version_external_identifier": "***",
        //         "bid": "com.busuu.english.app",
        //         "cancellation_date": "2018-03-27 07:11:12 Etc/GMT",
        //         "product_id": "com.busuu.app.subs12month_FT_jan_18",
        //         "purchase_date": "2018-03-24 12:09:02 Etc/GMT",
        //         "cancellation_date_pst": "2018-03-27 00:11:12 America/Los_Angeles",
        //         "purchase_date_pst": "2018-03-24 05:09:02 America/Los_Angeles",
        //         "original_purchase_date": "2018-03-17 12:09:03 Etc/GMT"
        //     },
        //     "cancellation_date_ms": "1522134672000",
        //     "latest_expired_receipt": "***",
        //     "cancellation_date": "2018-03-27 07:11:12 Etc/GMT",
        //     "password": "***",
        //     "cancellation_date_pst": "2018-03-27 00:11:12 America/Los_Angeles",
        //     "auto_renew_product_id": "com.busuu.app.subs12month_FT_jan_18",
        //     "notification_type": "CANCEL"
        // }

    }
}
