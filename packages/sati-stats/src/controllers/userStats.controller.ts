import { Inject, Injectable } from '@nestjs/common';

import { UserStatsService } from '../services/userStats.service';
import { InjectBroker } from 'nestjs-moleculer';
import { ServiceBroker, Service, Context, Errors } from 'moleculer';
import MoleculerError = Errors.MoleculerError;

@Injectable()
export class UserStatsController extends Service {
    constructor(
        @InjectBroker() broker: ServiceBroker,
        @Inject(UserStatsService) private readonly userStatsService: UserStatsService
    ) {
        super(broker);

        this.parseServiceSchema({
            name: "userStats",
            //version: "v2",
            meta: {
                scalable: true
            },
            settings: {
                upperCase: true
            },
            actions: {
                loginCount: this.loginBySMSCode
            },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }

    serviceCreated() {
        this.logger.info("user service created.");
    }

    serviceStarted() {
        this.logger.info("user service started.");
    }

    serviceStopped() {
        this.logger.info("user service stopped.");
    }

    async loginBySMSCode(ctx: Context) {
        return { data: await this.userStatsService.loginCount(1, 2548080174858) };
    }
}
