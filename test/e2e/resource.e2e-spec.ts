import { Test } from '@nestjs/testing';
import {INestApplication, INestApplicationContext} from '@nestjs/common';
import * as supertest from 'supertest';
import { ServiceBroker } from 'moleculer';

const mutations = require('./gql/mutations');
const queries = require('./gql/queries');

describe('Resource', () => {
    let app: INestApplication;
    let broker: ServiceBroker;

    beforeAll(async (done) => {
        const { AppModule } = require('../../packages/sati/src/app.module');
        const { ResourceModule } = require('../../packages/sati-resource/src/resource.module');
        const { UserModule } = require('../../packages/sati-user/src/user.module');
        const { StatsModule } = require('../../packages/sati-stats/src/stats.module');

        const appModule = await Test.createTestingModule({
            imports: [AppModule,
                ResourceModule.forRoot(),
                UserModule.forRoot(),
                StatsModule.forRoot()
            ],
        }).compile();
        app = appModule.createNestApplication();
        await app.init();

        broker = appModule.get('MoleculerBroker');

        broker.waitForServices(["discount", "home", "mindfulness", "mindfulnessAlbum", "nature", "natureAlbum", "wander", "wanderAlbum", "scene"
            , "coupon", "user"
            , "operation", "userStats"], 10000, 1000).then(done);

        // done();
    }, 20000000);

    describe('Home', () => {
        it(`sayHomeHello`, async () => {
            // return true;

            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sayHomeHello,
                    variables: {name: "jiangzhuo"}
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.sayHomeHello.code).toBe(200);
            expect(JSON.parse(res.text).data.sayHomeHello.message).toBe("success");
            expect(JSON.parse(res.text).data.sayHomeHello.data).toBe("Home Hello jiangzhuo!");
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
