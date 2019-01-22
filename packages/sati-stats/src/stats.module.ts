import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserStatsSchema } from './schemas/userStats.schema';
import { UserStatsService } from './services/userStats.service';
import { OperationSchema } from './schemas/operation.schema';
import { OperationService } from './services/operation.service';
import { UserSchema } from './schemas/user.schema';

import { MoleculerModule } from 'nestjs-moleculer';
import { UserStatsController } from './controllers/userStats.controller';
import * as jaeger from 'moleculer-jaeger';

@Module({
    imports: [
        MoleculerModule.forRoot({
            namespace: "sati",
            metrics: true,
            transporter: process.env.TRANSPORTER,
            logLevel: process.env.LOG_LEVEL
        }),
        MoleculerModule.forFeature([{
            name: 'jaeger',
            schema: jaeger,
        }]),
        MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STR,
            { connectionName: 'sati', useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }),
        MongooseModule.forFeature([{ name: 'UserStats', schema: UserStatsSchema, collection: 'userStats' }], 'sati'),
        MongooseModule.forFeature([{ name: 'Operation', schema: OperationSchema, collection: 'operation' }], 'sati'),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema, collection: 'user' }], 'sati'),
    ],
    controllers: [
        UserStatsController,
    ],
    providers: [
        UserStatsService,
        OperationService
    ],
    exports: []
})
export class StatsModule implements OnModuleInit {
    constructor() {
    }

    static forRoot(): DynamicModule {
        return {
            module: StatsModule
        };
    }

    async onModuleInit() {
    }
}
