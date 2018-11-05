import {Module, Inject, OnModuleInit} from '@nestjs/common';
import {OnsModule} from 'nestjs-ali-ons';
import {MongooseModule} from '@nestjs/mongoose';
import {MindfulnessConsumer} from "./consumers/mindfulness.consumer";
import { MindfulnessSchema } from './schemas/mindfulness.schema';
import { NatureSchema } from "./schemas/nature.schema";
import { WanderSchema } from './schemas/wander.schema';
import { WanderAlbumSchema } from './schemas/wanderAlbum.schema';

const httpclient = require('urllib');
const logger = {
    info() {
    },
    warn() {
    },
    error(...args) {
        console.error(...args);
    },
    debug() {
    },
};

@Module({
    imports: [
        OnsModule.register({
            httpclient,
            accessKeyId: 'LTAIhIOInA2pDmga',
            accessKeySecret: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
            consumerGroup: 'CID_RESOURCE_MINDFULNESS',
            logger: logger
        }, [{topic: 'sati_debug', tags: 'mindfulness', type: 'consumer'}]),
        OnsModule.register({
            httpclient,
            accessKeyId: 'LTAIhIOInA2pDmga',
            accessKeySecret: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
            consumerGroup: 'CID_RESOURCE_WANDER',
            logger: logger
        }, [{topic: 'sati_debug', tags: 'wander', type: 'consumer'}]),
        OnsModule.register({
            httpclient,
            accessKeyId: 'LTAIhIOInA2pDmga',
            accessKeySecret: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
            consumerGroup: 'CID_RESOURCE_NATURE',
            logger: logger
        }, [{topic: 'sati_debug', tags: 'nature', type: 'consumer'}]),
        OnsModule.register({
            httpclient,
            accessKeyId: 'LTAIhIOInA2pDmga',
            accessKeySecret: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
            consumerGroup: 'CID_RESOURCE_WANDERALBUM',
            logger: logger
        }, [{topic: 'sati_debug', tags: 'wander_album', type: 'consumer'}]),
        MongooseModule.forRoot('mongodb://sati:kjhguiyIUYkjh32kh@dds-2zee21d7f4fff2f41890-pub.mongodb.rds.aliyuncs.com:3717,dds-2zee21d7f4fff2f42351-pub.mongodb.rds.aliyuncs.com:3717/sati_resource?replicaSet=mgset-9200157',
            // MongooseModule.forRoot('mongodb://localhost:27017/module_resource',
            {connectionName: 'resource', useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true}),
        MongooseModule.forFeature([{name: 'Mindfulness', schema: MindfulnessSchema, collection: 'mindfulness'},
            {name: 'Nature', schema: NatureSchema, collection: 'nature'},
            {name: 'Wander', schema: WanderSchema, collection: 'wander'},
            {name: 'WanderAlbum', schema: WanderAlbumSchema, collection: 'wanderAlbum'}
        ], 'resource'),
    ],
    controllers: [MindfulnessConsumer]
})
export class ApplicationModule {
    constructor() {
    }

    onModuleInit() {
        console.log('ApplicationModule init')
        // this.onsService.getConsumer().on('error', err => {
        //     // todo sentry
        //     console.log(err)
        // })
    }
}
