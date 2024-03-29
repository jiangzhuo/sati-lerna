import { Inject, Injectable } from '@nestjs/common';

import { NatureService } from '../services/nature.service';
import { Context, Service, ServiceBroker } from "moleculer";
import { InjectBroker } from 'nestjs-moleculer';
// import { LoggingInterceptor } from "../interceptors/logging.interceptor";
// import { ErrorsInterceptor } from "../interceptors/exception.interceptor";

@Injectable()
// @UseInterceptors(LoggingInterceptor, ErrorsInterceptor)
export class NatureController extends Service {
    constructor(
        @InjectBroker() broker: ServiceBroker,
        @Inject(NatureService) private readonly natureService: NatureService
    ) {
        super(broker);

        this.parseServiceSchema({
            name: "nature",
            //version: "v2",
            // dependencies: [
            // 	"auth",
            // 	"users"
            // ],
            settings: {
                upperCase: true
            },
            actions: {
                sayHello: this.sayHello,

                getNature: this.getNature,
                getNatureById: this.getNatureById,
                getNatureByIds: this.getNatureByIds,
                createNature: this.createNature,
                updateNature: this.updateNature,
                deleteNature: this.deleteNature,
                revertDeletedNature: this.revertDeletedNature,
                favoriteNature: this.favoriteNature,
                startNature: this.startNature,
                finishNature: this.finishNature,
                getNatureRecordByNatureId: this.getNatureRecordByNatureId,
                getNatureRecordByNatureIds: this.getNatureRecordByNatureIds,
                searchNatureRecord: this.searchNatureRecord,
                buyNature: this.buyNature,
                searchNature: this.searchNature,

                getNatureByNatureAlbumId: this.getNatureByNatureAlbumId,
                // welcome: {
                //     cache: {
                //         keys: ["name"]
                //     },
                //     params: {
                //         name: "string"
                //     },
                //     handler: this.welcome
                // }
            },
            // events: {
            //     "user.created": this.userCreated
            // },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }

    serviceCreated() {
        this.logger.info("nature service created.");
    }

    async serviceStarted() {
        this.logger.info("nature service started.");
    }

    async serviceStopped() {
        this.logger.info("nature service stopped.");
    }

    async sayHello(ctx: Context) {
        return this.natureService.sayHello(ctx.params.name);
    }

    async getNature(ctx: Context) {
        return { data: await this.natureService.getNature(ctx.params.first, ctx.params.after, ctx.params.before, ctx.params.status) };
    }

    async getNatureById(ctx: Context) {
        return { data: await this.natureService.getNatureById(ctx.params.id) };
    }

    async getNatureByIds(ctx: Context) {
        return { data: await this.natureService.getNatureByIds(ctx.params.ids) };
    }

    async createNature(ctx: Context) {
        return { data: await this.natureService.createNature(ctx.params) };
    }

    async updateNature(ctx: Context) {
        return { data: await this.natureService.updateNature(ctx.params.id, ctx.params) };
    }

    async deleteNature(ctx: Context) {
        return { data: await this.natureService.deleteNature(ctx.params.id) };
    }

    async revertDeletedNature(ctx: Context) {
        return { data: await this.natureService.revertDeletedNature(ctx.params.id) };
    }

    async favoriteNature(ctx: Context) {
        return { data: await this.natureService.favoriteNature(ctx.params.userId, ctx.params.natureId) };
    }

    async startNature(ctx: Context) {
        return { data: await this.natureService.startNature(ctx.params.userId, ctx.params.natureId) };
    }

    async finishNature(ctx: Context) {
        return { data: await this.natureService.finishNature(ctx.params.userId, ctx.params.natureId, ctx.params.duration) };
    }

    async getNatureRecordByNatureId(ctx: Context) {
        return { data: await this.natureService.getNatureRecord(ctx.params.userId, ctx.params.natureId) };
    }

    async getNatureRecordByNatureIds(ctx: Context) {
        return { data: await this.natureService.getNatureRecord(ctx.params.userId, ctx.params.natureIds) };
    }

    async searchNatureRecord(ctx: Context) {
        return { data: await this.natureService.searchNatureRecord(ctx.params.userId, ctx.params.page, ctx.params.limit, ctx.params.sort, ctx.params.favorite, ctx.params.boughtTime) };
    }

    async buyNature(ctx: Context) {
        const discount = await ctx.call('discount.getDiscountByResourceId', { resourceId: ctx.params.mindfulnessId });
        return { data: await this.natureService.buyNature(ctx.params.userId, ctx.params.natureId, discount) };
    }

    async searchNature(ctx: Context) {
        return await this.natureService.searchNature(ctx.params.keyword, (ctx.params.page - 1) * ctx.params.limit, ctx.params.limit);
    }

    async getNatureByNatureAlbumId(ctx: Context) {
        return { data: await this.natureService.getNatureByNatureAlbumId(ctx.params.id) };
    }
}
