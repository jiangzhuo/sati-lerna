import * as _ from 'lodash';
import { Test } from '@nestjs/testing';
import {INestApplication, INestApplicationContext} from '@nestjs/common';
import * as supertest from 'supertest';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
const replSet = new MongoMemoryReplSet();

import { ServiceBroker } from 'moleculer';
import {NestFactory} from '@nestjs/core';
import * as Moleculer from "moleculer";

describe('Cats', () => {
    let app: INestApplication;
    let broker: ServiceBroker;
    // let queryClient;

    beforeAll(async (done) => {
        await replSet.waitUntilRunning();
        process.env = _.merge(process.env, {
            SENTRY_DSN: 'https://f788de537d2648cb96b4b9f5081165c1@sentry.io/1318216',
            HTTP_PORT: '5000',
            HTTPS_PORT: '442',
            LOG_LEVEL: 'info',
            OSS_REGION: 'oss-cn-shanghai',
            OSS_ACCESS_KEY_ID: 'LTAIhIOInA2pDmga',
            OSS_ACCESS_KEY_SECRET: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
            OSS_BUCKET: 'sati-test-hd',
            OSS_BASE_URL: 'https://sati-test-hd.oss-cn-shanghai.aliyuncs.com',
            BASE_URL: 'https://sati-test-hd.oss-cn-shanghai.aliyuncs.com',
            WHITELIST_OPERATION_NAME:
                '["IntrospectionQuery", "sayHello", "test", "adminTest", "home", "getHome", "getHomeById", "getNew", "loginBySMSCode","loginByMobileAndPassword", "sendRegisterVerificationCode", "sendLoginVerificationCode", "registerBySMSCode"]',
            AUTH_TOKEN_SECRET_KEY: 'secretKey',
            TRANSPORTER: 'TCP',
            MONGODB_CONNECTION_STR:
                await replSet.getConnectionString(),
            SMS_ACCESS_KEY_ID: 'LTAIhIOInA2pDmga',
            SMS_ACCESS_KEY_SECRET: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
            SMS_SIGN_NAME: 'ewtf234rfrf',
            SMS_REGISTER_TEMPLATE_CODE: 'SMS_144942599',
            SMS_LOGIN_TEMPLATE_CODE: 'SMS_144853217'
        });


        const { AppModule } = require('../../packages/sati/src/app.module');
        const { ResourceModule } = require('../../packages/sati-resource/src/resource.module');
        const { UserModule } = require('../../packages/sati-user/src/user.module');
        const { StatsModule } = require('../../packages/sati-stats/src/stats.module');

        // resource = await NestFactory.createApplicationContext({modules: [ResourceModule, UserModule, StatsModule]});
        // console.log('jiangzhuo1');

        // const resourceModule = await Test.createTestingModule({
        //     imports: [ResourceModule.forRoot()],
        // }).compile();
        // resource = resourceModule.createNestApplication();
        // resource = await NestFactory.createApplicationContext(ResourceModule.forRoot());
        // console.warn('jiangzhuo1');

        // const userModule = await Test.createTestingModule({
        //     imports: [UserModule],
        // }).compile();
        // user = userModule.createNestApplication();
        // user = await NestFactory.createApplicationContext(UserModule.forRoot());
        // console.warn('jiangzhuo2');

        // const statsModule = await Test.createTestingModule({
        //     imports: [StatsModule],
        // }).compile();
        // stats = statsModule.createNestApplication();
        // stats = await NestFactory.createApplicationContext(StatsModule.forRoot());
        // console.warn('jiangzhuo3');

        const appModule = await Test.createTestingModule({
            imports: [AppModule,
                ResourceModule.forRoot(),
                UserModule.forRoot(),
                StatsModule.forRoot()
            ],
        }).compile();
        app = appModule.createNestApplication();
        await app.init();

        // setTimeout(done, 5000);
        // broker = new ServiceBroker({namespace: 'sati', logLevel: "debug", transporter: "TCP"});
        broker = appModule.get('MoleculerBroker');

        // await broker.start();
        broker.waitForServices(["discount", "home", "mindfulness", "mindfulnessAlbum", "nature", "natureAlbum", "wander", "wanderAlbum", "scene"
            , "coupon", "user"
            , "operation", "userStats"], 10000, 1000).then(done);

        // done();
    }, 20000000);

    it(`/GET cats`, async () => {
        // return true;

        const res = await supertest(app.getHttpServer())
            .post('/graphql')
            .send({
                query: 'query sayHomeHello {  sayHomeHello(name:"jiangzhuo") {    code    message  }}',
            });
        console.log(res);
        expect(res.status).toBe(200);
        expect(JSON.parse(res.text).data.sayHomeHello.code).toBe(200)


    });

    afterAll(async () => {
        console.log(22222);
        await app.close();
        console.log(333333);
        await replSet.stop();
        console.log(444444);
        await broker.stop();
    });
});
