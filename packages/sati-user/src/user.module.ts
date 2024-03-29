import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth/auth.service';

import { UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';

import { AccountSchema } from './schemas/account.schema';

import { CryptoUtil } from './utils/crypto.util';

import { MoleculerModule } from 'nestjs-moleculer';
import { UserController } from './controllers/user.controller';
import { CouponController } from './controllers/coupon.controller';
import { ReceiptSchema } from "./schemas/receipt.schema";
import { PurchaseSchema } from "./schemas/purchase.schema";
import { PurchaseController } from "./controllers/purchase.controller";
import { CouponSchema } from './schemas/coupon.schema';
import { CouponService } from "./services/coupon.service";
import * as jaeger from 'moleculer-jaeger';

@Module({
    imports: [
        MoleculerModule.forRoot({
            namespace: "sati",
            // logger: bindings => new Logger(),
            metrics: true,
            transporter: process.env.TRANSPORTER,
            // hotReload: true,
            cacher: "Memory",
            logLevel: process.env.LOG_LEVEL
        }),
        MoleculerModule.forFeature([{
            name: 'jaeger',
            schema: jaeger,
        }]),
        MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STR,
            //     MongooseModule.forRoot('mongodb://localhost:27017/sati',
            //     MongooseModule.forRoot('mongodb://root:kjhguiyIUYkjh32kh@dds-2ze5f8fcc72702b41188-pub.mongodb.rds.aliyuncs.com:3717,dds-2ze5f8fcc72702b42191-pub.mongodb.rds.aliyuncs.com:3717/sati?replicaSet=mgset-10924097&authDB=admin',
            { connectionName: 'sati', useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema, collection: 'user' }], 'sati'),
        MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema, collection: 'account' }], 'sati'),
        MongooseModule.forFeature([{ name: 'Coupon', schema: CouponSchema, collection: 'coupon' }], 'sati'),
        MongooseModule.forFeature([{ name: 'Receipt', schema: ReceiptSchema, collection: 'receipt' }], 'sati'),
        MongooseModule.forFeature([{ name: 'Purchase', schema: PurchaseSchema, collection: 'purchase' }], 'sati'),
    ],
    controllers: [
        // UserController,
        // CouponController,
    ],
    providers: [
        UserController,
        CouponController,
        PurchaseController,
        AuthService,
        UserService,
        CouponService,
        CryptoUtil
    ],
    exports: []
})
export class UserModule implements OnModuleInit {
    constructor() {
    }

    static forRoot(): DynamicModule {
        return {
            module: UserModule
        };
    }

    async onModuleInit() {
    }

    // /**
    //  * Create a system super administrator
    //  */
    // private async createSuperAdmin() {
    //     const sadmin = await this.userRepo.findOne({ where: { username: 'sadmin' } });
    //     if (sadmin) return;
    //     await this.userService.createUser({ username: 'sadmin', password: 'sadmin' });
    // }
}
