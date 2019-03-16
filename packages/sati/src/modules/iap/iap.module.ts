import { Module } from '@nestjs/common';
import { IAPController } from './iap.controller';
import { MoleculerModule } from 'nestjs-moleculer';
import * as jaeger from 'moleculer-jaeger';

@Module({
    imports:[
        MoleculerModule.forRoot({
            namespace: 'sati',
            metrics: true,
            // logger: bindings => new Logger(),
            transporter: process.env.TRANSPORTER,
            cacher: "Memory",
            logLevel: process.env.LOG_LEVEL,
        }),
        MoleculerModule.forFeature([{
            name: 'jaeger',
            schema: jaeger,
        }])
    ],
    controllers: [IAPController],
})
export class IAPModule {}
