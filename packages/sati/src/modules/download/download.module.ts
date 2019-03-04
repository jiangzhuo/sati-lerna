import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
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
        }]),
    ],
    controllers: [DownloadController],
})
export class DownloadModule {}
