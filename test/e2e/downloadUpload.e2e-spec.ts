import { INestApplication} from '@nestjs/common';
import * as supertest from 'supertest';
import { Test } from "@nestjs/testing";
// import * as OSS from '../../packages/sati/node_modules/ali-oss';

jest.mock('../../packages/sati/node_modules/ali-oss');

// const mutations = require('./gql/mutations');
const queries = require('./gql/queries');

describe.only('Upload/Download', () => {
    let app: INestApplication;

    let adminToken;
    beforeAll(async () => {
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

        global['__app__'] = app;
        process['__app__'] = app;

        const broker = appModule.get('MoleculerBroker');

        await broker.waitForServices(["discount", "home", "mindfulness", "mindfulnessAlbum", "nature", "natureAlbum", "wander", "wanderAlbum", "scene"
            , "coupon", "user"
            , "operation", "userStats"], 10000, 1000);
        app = process['__app__'];

        const res = await supertest(app.getHttpServer())
            .post('/graphql')
            .send({
                query: queries.loginBySMSCode,
                variables: {
                    mobile: "13800138000",
                    verificationCode: "666"
                }
            });
        expect(res.status).toBe(200);
        let resObj = JSON.parse(res.text);
        adminToken = resObj.data.loginBySMSCode.data.accessToken;
    }, 20000000);
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('Upload', () => {
        it(`upload`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/upload')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file','/home/jiangzhuo/Desktop/sati-lerna/test/e2e/jest-e2e.json');
            expect(res.status).toBe(201);
            let resObj = JSON.parse(res.text);
            expect(resObj.data).toBe('93b8409840e31189b3f5e47da7ff7f93.json')
        });

        it(`uploadAvatar`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/uploadAvatar')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file','/home/jiangzhuo/Desktop/sati-lerna/test/e2e/jest-e2e.json');
            expect(res.status).toBe(201);
            let resObj = JSON.parse(res.text);
            expect(resObj.message).toBe('upload avatar success')
        });

        it(`uploadBackground`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/uploadBackground')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file','/home/jiangzhuo/Desktop/sati-lerna/test/e2e/jest-e2e.json');
            expect(res.status).toBe(201);
            let resObj = JSON.parse(res.text);
            expect(resObj.message).toBe('upload background success')
        });

        it(`uploadAudio`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/uploadAudio')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file','/home/jiangzhuo/Desktop/sati-lerna/test/e2e/jest-e2e.json');
            expect(res.status).toBe(201);
            let resObj = JSON.parse(res.text);
            expect(resObj.message).toBe('upload audio success')
        });
    });

    describe('Download', () => {
        it(`download-background/avatar`, async () => {
            let type = 'background';
            let resourceId = '000000000000000000000000';
            let fileName = '93b8409840e31189b3f5e47da7ff7f93.json';
            const res = await supertest(app.getHttpServer())
                .get(`/download/${type}/${resourceId}/${fileName}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(302);
        });
    });
});
