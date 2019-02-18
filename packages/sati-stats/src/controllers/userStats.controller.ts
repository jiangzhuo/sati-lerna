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
                loginCount: this.loginCount,
                registerCount: this.registerCount,
                verificationCodeCount: this.verificationCodeCount,
                renewTokenCount: this.renewTokenCount,
                userCount: this.userCount,
            },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }

    serviceCreated() {
        this.logger.info("userStats service created.");
    }

    async serviceStarted() {
        this.logger.info("userStats service started.");
    }

    async serviceStopped() {
        this.logger.info("userStats service stopped.");
    }

    async userCount(ctx: Context) {
        return { data: await this.userStatsService.userCount(ctx.params.from, ctx.params.to) };
    }

    async loginCount(ctx: Context) {
        return { data: await this.userStatsService.loginCount(ctx.params.from, ctx.params.to) }
    }

    async registerCount(ctx: Context) {
        return { data: await this.userStatsService.registerCount(ctx.params.from, ctx.params.to) };
    }

    async verificationCodeCount(ctx: Context) {
        return { data: await this.userStatsService.verificationCodeCount(ctx.params.from, ctx.params.to) };
    }

    async renewTokenCount(ctx: Context) {
        return { data: await this.userStatsService.renewTokenCount(ctx.params.from, ctx.params.to) };
    }
}
