import { INestApplication, INestApplicationContext } from '@nestjs/common';
import * as supertest from 'supertest';

const { Test } = require("@nestjs/testing");

const mutations = require('./gql/mutations');
const queries = require('./gql/queries');

describe('Resource', () => {
    let app: INestApplication;
    let adminToken;
    beforeAll(async () => {
        // if (!process['__app__']) {
        // } else {
        //     app = process['__app__'];
        // }

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
        process['jiangzhuo'] = 'aaaaaaa';

        // this.global.__app__ = app;

        const broker = appModule.get('MoleculerBroker');

        await broker.waitForServices(["discount", "home", "mindfulness", "mindfulnessAlbum", "nature", "natureAlbum", "wander", "wanderAlbum", "scene"
            , "coupon", "user"
            , "operation", "userStats"], 10000, 1000);


        // // 进行一些require保证计算覆盖率的时候算到这些
        // require('../../packages/sati/src/app.module');
        // require('../../packages/sati-resource/src/resource.module');
        // require('../../packages/sati-user/src/user.module');
        // require('../../packages/sati-stats/src/stats.module');
        // done();
        const res = await supertest(app.getHttpServer())
            .post('/graphql')
            .send({
                query: queries.loginBySMSCode,
                variables: {
                    mobile: '1',
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
    describe('Hello', () => {
        it(`sayMindfulnessHello`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sayMindfulnessHello,
                    variables: { name: "jiangzhuo" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.sayMindfulnessHello.code).toBe(200);
            expect(JSON.parse(res.text).data.sayMindfulnessHello.message).toBe("success");
            expect(JSON.parse(res.text).data.sayMindfulnessHello.data).toBe("Mindfulness Hello jiangzhuo!");
        });
        it(`sayNatureHello`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sayNatureHello,
                    variables: { name: "jiangzhuo" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.sayNatureHello.code).toBe(200);
            expect(JSON.parse(res.text).data.sayNatureHello.message).toBe("success");
            expect(JSON.parse(res.text).data.sayNatureHello.data).toBe("Nature Hello jiangzhuo!");
        });
        it(`sayWanderHello`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sayWanderHello,
                    variables: { name: "jiangzhuo" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.sayWanderHello.code).toBe(200);
            expect(JSON.parse(res.text).data.sayWanderHello.message).toBe("success");
            expect(JSON.parse(res.text).data.sayWanderHello.data).toBe("Wander Hello jiangzhuo!");
        });
        it(`saySceneHello`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.saySceneHello,
                    variables: { name: "jiangzhuo" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.saySceneHello.code).toBe(200);
            expect(JSON.parse(res.text).data.saySceneHello.message).toBe("success");
            expect(JSON.parse(res.text).data.saySceneHello.data).toBe("Scene Hello jiangzhuo!");
        });
        it(`sayHomeHello`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sayHomeHello,
                    variables: { name: "jiangzhuo" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.sayHomeHello.code).toBe(200);
            expect(JSON.parse(res.text).data.sayHomeHello.message).toBe("success");
            expect(JSON.parse(res.text).data.sayHomeHello.data).toBe("Home Hello jiangzhuo!");
        });
        it(`sayDiscountHello`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sayDiscountHello,
                    variables: { name: "jiangzhuo" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.sayDiscountHello.code).toBe(200);
            expect(JSON.parse(res.text).data.sayDiscountHello.message).toBe("success");
            expect(JSON.parse(res.text).data.sayDiscountHello.data).toBe("Discount Hello jiangzhuo!");
        });
    });

    describe('Scene', () => {
        let sceneId = '';
        let sceneId2 = '';
        it('createScene', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createScene,
                    variables: { name: "湖畔" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createScene.code).toBe(200);
            expect(JSON.parse(res.text).data.createScene.message).toBe("success");
            expect(JSON.parse(res.text).data.createScene.data).toHaveProperty('id');
            sceneId = JSON.parse(res.text).data.createScene.data.id;
            expect(JSON.parse(res.text).data.createScene.data.name).toBe('湖畔');
        });
        it('updateScene', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateScene,
                    variables: { id: sceneId, name: "新湖畔" }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateScene.code).toBe(200);
            expect(JSON.parse(res.text).data.updateScene.message).toBe("success");
            expect(JSON.parse(res.text).data.updateScene.data.id).toBe(sceneId);
            expect(JSON.parse(res.text).data.updateScene.data.name).toBe('新湖畔');
        });
        it('deleteScene', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteScene,
                    variables: { id: sceneId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.deleteScene.code).toBe(200);
            expect(JSON.parse(res.text).data.deleteScene.message).toBe("success");
            expect(JSON.parse(res.text).data.deleteScene.data.id).toBe(sceneId);
            expect(JSON.parse(res.text).data.deleteScene.data.name).toBe('新湖畔');
        });
        it('getScene', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createScene,
                    variables: { name: "大海" }
                });
            expect(res.status).toBe(200);
            sceneId = JSON.parse(res.text).data.createScene.data.id;

            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createScene,
                    variables: { name: "湖畔" }
                });
            expect(res.status).toBe(200);
            sceneId2 = JSON.parse(res.text).data.createScene.data.id;
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createScene,
                    variables: { name: "沙漠" }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createScene,
                    variables: { name: "森林" }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createScene,
                    variables: { name: "星空" }
                });

            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.getScene,
                    variables: { first: 2, after: sceneId }
                });
            expect(JSON.parse(res.text).data.getScene.code).toBe(200);
            expect(JSON.parse(res.text).data.getScene.message).toBe("success");
            expect(JSON.parse(res.text).data.getScene.data.length).toBe(2);
            expect(JSON.parse(res.text).data.getScene.data[0].id).toBe(sceneId);
            expect(JSON.parse(res.text).data.getScene.data[1].name).toBe('湖畔');

        });
        it('getSceneById', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.getSceneById,
                    variables: { id: sceneId }
                });
            expect(JSON.parse(res.text).data.getSceneById.code).toBe(200);
            expect(JSON.parse(res.text).data.getSceneById.message).toBe("success");
            expect(JSON.parse(res.text).data.getSceneById.data.name).toBe('大海');
            expect(JSON.parse(res.text).data.getSceneById.data.id).toBe(sceneId);
        });
        it('getSceneByIds', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.getSceneByIds,
                    variables: { ids: [sceneId, sceneId2] }
                });
            expect(JSON.parse(res.text).data.getSceneByIds.code).toBe(200);
            expect(JSON.parse(res.text).data.getSceneByIds.message).toBe("success");
            expect(JSON.parse(res.text).data.getSceneByIds.data.length).toBe(2);
            expect(JSON.parse(res.text).data.getSceneByIds.data[0].id).toBe(sceneId);
            expect(JSON.parse(res.text).data.getSceneByIds.data[1].id).toBe(sceneId2);
        });
    });

    describe('Mindfulness', () => {
        let userId = '';
        let mindfulnessId;
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });

        it('createMindfulness', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulness,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "面子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            mindfulnessAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                            natureId: '000000000000000000000000',
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createMindfulness.code).toBe(200);
            expect(JSON.parse(res.text).data.createMindfulness.message).toBe("success");
            expect(JSON.parse(res.text).data.createMindfulness.data).toHaveProperty('id');
            mindfulnessId = JSON.parse(res.text).data.createMindfulness.data.id;
            expect(JSON.parse(res.text).data.createMindfulness.data.name).toBe('面子');
            expect(JSON.parse(res.text).data.createMindfulness.data.status).toBe(0);
        });
        it('updateMindfulness', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateMindfulness,
                    variables: { id: mindfulnessId, data: { name: "新面子" } }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateMindfulness.code).toBe(200);
            expect(JSON.parse(res.text).data.updateMindfulness.message).toBe("success");
            expect(JSON.parse(res.text).data.updateMindfulness.data.id).toBe(mindfulnessId);
            expect(JSON.parse(res.text).data.updateMindfulness.data.name).toBe('新面子');
        });
        it('deleteMindfulness', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteMindfulness,
                    variables: { id: mindfulnessId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.deleteMindfulness.code).toBe(200);
            expect(JSON.parse(res.text).data.deleteMindfulness.message).toBe("success");
            expect(JSON.parse(res.text).data.deleteMindfulness.data.id).toBe(mindfulnessId);
            expect(JSON.parse(res.text).data.deleteMindfulness.data.status).toBe(1);
        });
        it('revertDeletedMindfulness', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.revertDeletedMindfulness,
                    variables: { id: mindfulnessId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedMindfulness.code).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedMindfulness.message).toBe("success");
            expect(JSON.parse(res.text).data.revertDeletedMindfulness.data.id).toBe(mindfulnessId);
            expect(JSON.parse(res.text).data.revertDeletedMindfulness.data.status).toBe(0);
        });
        it('favoriteMindfulness', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteMindfulness,
                    variables: { id: mindfulnessId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.favoriteMindfulness.code).toBe(200);
            expect(JSON.parse(res.text).data.favoriteMindfulness.message).toBe("success");
            expect(JSON.parse(res.text).data.favoriteMindfulness.data.mindfulnessId).toBe(mindfulnessId);
            expect(JSON.parse(res.text).data.favoriteMindfulness.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.favoriteMindfulness.data.favorite).toBe(1);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteMindfulness,
                    variables: { id: mindfulnessId }
                });
            expect(JSON.parse(res.text).data.favoriteMindfulness.data.favorite).toBe(2);
        });
        it('buyMindfulness', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 1000000,
                        extraInfo: "change in e2e test for buyMindfulness test"
                    }
                });
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyMindfulness,
                    variables: { id: mindfulnessId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.buyMindfulness.code).toBe(200);
            expect(JSON.parse(res.text).data.buyMindfulness.message).toBe("success");
            expect(JSON.parse(res.text).data.buyMindfulness.data.mindfulnessId).toBe(mindfulnessId);
            expect(JSON.parse(res.text).data.buyMindfulness.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.buyMindfulness.data.boughtTime).not.toBe(0);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyMindfulness,
                    variables: { id: mindfulnessId }
                });
            expect(JSON.parse(res.text).data.buyMindfulness.code).toBe(400);
            expect(JSON.parse(res.text).data.buyMindfulness.message).toBe("already bought");
        });
        it('startMindfulness', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.startMindfulness,
                    variables: { id: mindfulnessId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.startMindfulness.data.startCount).toBe(1);
        });
        it('finishMindfulness', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishMindfulness,
                    variables: { id: mindfulnessId, duration: 10 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishMindfulness.data.finishCount).toBe(1);
            expect(JSON.parse(res.text).data.finishMindfulness.data.totalDuration).toBe(10);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishMindfulness,
                    variables: { id: mindfulnessId, duration: 15 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishMindfulness.data.finishCount).toBe(2);
            expect(JSON.parse(res.text).data.finishMindfulness.data.totalDuration).toBe(25);
            expect(JSON.parse(res.text).data.finishMindfulness.data.longestDuration).toBe(15);
        });

        it('getMindfulness', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulness,
                    variables: { first: 5, after: 0, before: Math.floor(Date.now() / 1000) + 1000, status: 0 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulness.data.length).toBe(1);
        });
        it('getMindfulnessById', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulnessById,
                    variables: { id: mindfulnessId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulnessById.data.id).toBe(mindfulnessId);
        });
        it('getMindfulnessByIds', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulnessByIds,
                    variables: { ids: [mindfulnessId] }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulnessByIds.data.length).toBe(1);
            expect(JSON.parse(res.text).data.getMindfulnessByIds.data[0].id).toBe(mindfulnessId);
        });
        it('searchMindfulness', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulness,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "饺子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            mindfulnessAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                            natureId: '000000000000000000000000',
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulness,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "馒头",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            mindfulnessAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                            natureId: '000000000000000000000000',
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulness,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "红豆面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            mindfulnessAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                            natureId: '000000000000000000000000',
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulness,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "抹茶面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            mindfulnessAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                            natureId: '000000000000000000000000',
                        }
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchMindfulness,
                    variables: { keyword: "面包", page: 1, limit: 1 }
                });
            expect(res.status).toBe(200);

            expect(JSON.parse(res.text).data.searchMindfulness.data.total).toBe(2);
            expect(JSON.parse(res.text).data.searchMindfulness.data.data.length).toBe(1);
        });
        it('getMindfulnessRecordByMindfulnessId', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulnessRecordByMindfulnessId,
                    variables: { mindfulnessId: mindfulnessId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulnessRecordByMindfulnessId.data.mindfulnessId).toBe(mindfulnessId);
        });
        it('searchMindfulnessRecord', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchMindfulnessRecord,
                    variables: { page: 1, limit: 10, sort: '+id' }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.searchMindfulnessRecord.data.length).toBe(1);
        });
    });

    describe('MindfulnessAlbum', () => {
        let userId = '';
        let mindfulnessAlbumId;
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });

        it('createMindfulnessAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulnessAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "面子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createMindfulnessAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.createMindfulnessAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.createMindfulnessAlbum.data).toHaveProperty('id');
            mindfulnessAlbumId = JSON.parse(res.text).data.createMindfulnessAlbum.data.id;
            expect(JSON.parse(res.text).data.createMindfulnessAlbum.data.name).toBe('面子');
            expect(JSON.parse(res.text).data.createMindfulnessAlbum.data.status).toBe(0);
        });
        it('updateMindfulnessAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId, data: { name: "新面子" } }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateMindfulnessAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.updateMindfulnessAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.updateMindfulnessAlbum.data.id).toBe(mindfulnessAlbumId);
            expect(JSON.parse(res.text).data.updateMindfulnessAlbum.data.name).toBe('新面子');
        });
        it('deleteMindfulnessAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.deleteMindfulnessAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.deleteMindfulnessAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.deleteMindfulnessAlbum.data.id).toBe(mindfulnessAlbumId);
            expect(JSON.parse(res.text).data.deleteMindfulnessAlbum.data.status).toBe(1);
        });
        it('revertDeletedMindfulnessAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.revertDeletedMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedMindfulnessAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedMindfulnessAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.revertDeletedMindfulnessAlbum.data.id).toBe(mindfulnessAlbumId);
            expect(JSON.parse(res.text).data.revertDeletedMindfulnessAlbum.data.status).toBe(0);
        });
        it('favoriteMindfulnessAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.favoriteMindfulnessAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.favoriteMindfulnessAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.favoriteMindfulnessAlbum.data.mindfulnessAlbumId).toBe(mindfulnessAlbumId);
            expect(JSON.parse(res.text).data.favoriteMindfulnessAlbum.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.favoriteMindfulnessAlbum.data.favorite).toBe(1);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(JSON.parse(res.text).data.favoriteMindfulnessAlbum.data.favorite).toBe(2);
        });
        it('buyMindfulnessAlbum', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 1000000,
                        extraInfo: "change in e2e test for buyMindfulnessAlbum test"
                    }
                });
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.buyMindfulnessAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.buyMindfulnessAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.buyMindfulnessAlbum.data.mindfulnessAlbumId).toBe(mindfulnessAlbumId);
            expect(JSON.parse(res.text).data.buyMindfulnessAlbum.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.buyMindfulnessAlbum.data.boughtTime).not.toBe(0);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(JSON.parse(res.text).data.buyMindfulnessAlbum.code).toBe(400);
            expect(JSON.parse(res.text).data.buyMindfulnessAlbum.message).toBe("already bought");
        });
        it('startMindfulnessAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.startMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.startMindfulnessAlbum.data.startCount).toBe(1);
        });
        it('finishMindfulnessAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId, duration: 10 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishMindfulnessAlbum.data.finishCount).toBe(1);
            expect(JSON.parse(res.text).data.finishMindfulnessAlbum.data.totalDuration).toBe(10);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishMindfulnessAlbum,
                    variables: { id: mindfulnessAlbumId, duration: 15 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishMindfulnessAlbum.data.finishCount).toBe(2);
            expect(JSON.parse(res.text).data.finishMindfulnessAlbum.data.totalDuration).toBe(25);
            expect(JSON.parse(res.text).data.finishMindfulnessAlbum.data.longestDuration).toBe(15);
        });

        it('getMindfulnessAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulnessAlbum,
                    variables: { first: 5, after: 0, before: Math.floor(Date.now() / 1000) + 1000, status: 0 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulnessAlbum.data.length).toBe(1);
        });
        it('getMindfulnessAlbumById', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulnessAlbumById,
                    variables: { id: mindfulnessAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulnessAlbumById.data.id).toBe(mindfulnessAlbumId);
        });
        it('getMindfulnessAlbumByIds', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulnessAlbumByIds,
                    variables: { ids: [mindfulnessAlbumId] }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulnessAlbumByIds.data.length).toBe(1);
            expect(JSON.parse(res.text).data.getMindfulnessAlbumByIds.data[0].id).toBe(mindfulnessAlbumId);
        });
        it('searchMindfulnessAlbum', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulnessAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "饺子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulnessAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "馒头",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulnessAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "红豆面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createMindfulnessAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "抹茶面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchMindfulnessAlbum,
                    variables: { keyword: "面包", page: 1, limit: 1 }
                });
            expect(res.status).toBe(200);

            expect(JSON.parse(res.text).data.searchMindfulnessAlbum.data.total).toBe(2);
            expect(JSON.parse(res.text).data.searchMindfulnessAlbum.data.data.length).toBe(1);
        });
        it('getMindfulnessAlbumRecordByMindfulnessAlbumId', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getMindfulnessAlbumRecordByMindfulnessAlbumId,
                    variables: { mindfulnessAlbumId: mindfulnessAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getMindfulnessAlbumRecordByMindfulnessAlbumId.data.mindfulnessAlbumId).toBe(mindfulnessAlbumId);
        });
        it('searchMindfulnessAlbumRecord', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchMindfulnessAlbumRecord,
                    variables: { page: 1, limit: 10, sort: '+id' }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.searchMindfulnessAlbumRecord.data.length).toBe(1);
        });

        it.todo('getMindfulnessByMindfulnessAlbumId');
    });

    describe('Nature', () => {
        let userId = '';
        let natureId;
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });

        it('createNature', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNature,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "面子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            natureAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createNature.code).toBe(200);
            expect(JSON.parse(res.text).data.createNature.message).toBe("success");
            expect(JSON.parse(res.text).data.createNature.data).toHaveProperty('id');
            natureId = JSON.parse(res.text).data.createNature.data.id;
            expect(JSON.parse(res.text).data.createNature.data.name).toBe('面子');
            expect(JSON.parse(res.text).data.createNature.data.status).toBe(0);
        });
        it('updateNature', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateNature,
                    variables: { id: natureId, data: { name: "新面子" } }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateNature.code).toBe(200);
            expect(JSON.parse(res.text).data.updateNature.message).toBe("success");
            expect(JSON.parse(res.text).data.updateNature.data.id).toBe(natureId);
            expect(JSON.parse(res.text).data.updateNature.data.name).toBe('新面子');
        });
        it('deleteNature', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteNature,
                    variables: { id: natureId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.deleteNature.code).toBe(200);
            expect(JSON.parse(res.text).data.deleteNature.message).toBe("success");
            expect(JSON.parse(res.text).data.deleteNature.data.id).toBe(natureId);
            expect(JSON.parse(res.text).data.deleteNature.data.status).toBe(1);
        });
        it('revertDeletedNature', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.revertDeletedNature,
                    variables: { id: natureId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedNature.code).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedNature.message).toBe("success");
            expect(JSON.parse(res.text).data.revertDeletedNature.data.id).toBe(natureId);
            expect(JSON.parse(res.text).data.revertDeletedNature.data.status).toBe(0);
        });

        it('favoriteNature', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteNature,
                    variables: { id: natureId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.favoriteNature.code).toBe(200);
            expect(JSON.parse(res.text).data.favoriteNature.message).toBe("success");
            expect(JSON.parse(res.text).data.favoriteNature.data.natureId).toBe(natureId);
            expect(JSON.parse(res.text).data.favoriteNature.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.favoriteNature.data.favorite).toBe(1);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteNature,
                    variables: { id: natureId }
                });
            expect(JSON.parse(res.text).data.favoriteNature.data.favorite).toBe(2);
        });
        it('buyNature', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 1000000,
                        extraInfo: "change in e2e test for buyNature test"
                    }
                });
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyNature,
                    variables: { id: natureId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.buyNature.code).toBe(200);
            expect(JSON.parse(res.text).data.buyNature.message).toBe("success");
            expect(JSON.parse(res.text).data.buyNature.data.natureId).toBe(natureId);
            expect(JSON.parse(res.text).data.buyNature.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.buyNature.data.boughtTime).not.toBe(0);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyNature,
                    variables: { id: natureId }
                });
            expect(JSON.parse(res.text).data.buyNature.code).toBe(400);
            expect(JSON.parse(res.text).data.buyNature.message).toBe("already bought");
        });
        it('startNature', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.startNature,
                    variables: { id: natureId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.startNature.data.startCount).toBe(1);
        });
        it('finishNature', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishNature,
                    variables: { id: natureId, duration: 10 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishNature.data.finishCount).toBe(1);
            expect(JSON.parse(res.text).data.finishNature.data.totalDuration).toBe(10);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishNature,
                    variables: { id: natureId, duration: 15 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishNature.data.finishCount).toBe(2);
            expect(JSON.parse(res.text).data.finishNature.data.totalDuration).toBe(25);
            expect(JSON.parse(res.text).data.finishNature.data.longestDuration).toBe(15);
        });

        it('getNature', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNature,
                    variables: { first: 5, after: 0, before: Math.floor(Date.now() / 1000) + 1000, status: 0 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNature.data.length).toBe(1);
        });
        it('getNatureById', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNatureById,
                    variables: { id: natureId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNatureById.data.id).toBe(natureId);
        });
        it('getNatureByIds', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNatureByIds,
                    variables: { ids: [natureId] }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNatureByIds.data.length).toBe(1);
            expect(JSON.parse(res.text).data.getNatureByIds.data[0].id).toBe(natureId);
        });
        it('searchNature', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNature,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "饺子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            natureAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNature,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "馒头",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            natureAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNature,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "红豆面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            natureAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNature,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "抹茶面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            natureAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchNature,
                    variables: { keyword: "面包", page: 1, limit: 1 }
                });
            expect(res.status).toBe(200);

            expect(JSON.parse(res.text).data.searchNature.data.total).toBe(2);
            expect(JSON.parse(res.text).data.searchNature.data.data.length).toBe(1);
        });
        it('getNatureRecordByNatureId', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNatureRecordByNatureId,
                    variables: { natureId: natureId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNatureRecordByNatureId.data.natureId).toBe(natureId);
        });
        it('searchNatureRecord', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchNatureRecord,
                    variables: { page: 1, limit: 10, sort: '+id' }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.searchNatureRecord.data.length).toBe(1);
        });
    });

    describe('NatureAlbum', () => {
        let userId = '';
        let natureAlbumId;
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });

        it('createNatureAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNatureAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "面子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createNatureAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.createNatureAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.createNatureAlbum.data).toHaveProperty('id');
            natureAlbumId = JSON.parse(res.text).data.createNatureAlbum.data.id;
            expect(JSON.parse(res.text).data.createNatureAlbum.data.name).toBe('面子');
            expect(JSON.parse(res.text).data.createNatureAlbum.data.status).toBe(0);
        });
        it('updateNatureAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateNatureAlbum,
                    variables: { id: natureAlbumId, data: { name: "新面子" } }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateNatureAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.updateNatureAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.updateNatureAlbum.data.id).toBe(natureAlbumId);
            expect(JSON.parse(res.text).data.updateNatureAlbum.data.name).toBe('新面子');
        });
        it('deleteNatureAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteNatureAlbum,
                    variables: { id: natureAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.deleteNatureAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.deleteNatureAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.deleteNatureAlbum.data.id).toBe(natureAlbumId);
            expect(JSON.parse(res.text).data.deleteNatureAlbum.data.status).toBe(1);
        });
        it('revertDeletedNatureAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.revertDeletedNatureAlbum,
                    variables: { id: natureAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedNatureAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedNatureAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.revertDeletedNatureAlbum.data.id).toBe(natureAlbumId);
            expect(JSON.parse(res.text).data.revertDeletedNatureAlbum.data.status).toBe(0);
        });
        it('favoriteNatureAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteNatureAlbum,
                    variables: { id: natureAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.favoriteNatureAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.favoriteNatureAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.favoriteNatureAlbum.data.natureAlbumId).toBe(natureAlbumId);
            expect(JSON.parse(res.text).data.favoriteNatureAlbum.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.favoriteNatureAlbum.data.favorite).toBe(1);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteNatureAlbum,
                    variables: { id: natureAlbumId }
                });
            expect(JSON.parse(res.text).data.favoriteNatureAlbum.data.favorite).toBe(2);
        });
        it('buyNatureAlbum', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 1000000,
                        extraInfo: "change in e2e test for buyNatureAlbum test"
                    }
                });
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyNatureAlbum,
                    variables: { id: natureAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.buyNatureAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.buyNatureAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.buyNatureAlbum.data.natureAlbumId).toBe(natureAlbumId);
            expect(JSON.parse(res.text).data.buyNatureAlbum.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.buyNatureAlbum.data.boughtTime).not.toBe(0);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyNatureAlbum,
                    variables: { id: natureAlbumId }
                });
            expect(JSON.parse(res.text).data.buyNatureAlbum.code).toBe(400);
            expect(JSON.parse(res.text).data.buyNatureAlbum.message).toBe("already bought");
        });
        it('startNatureAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.startNatureAlbum,
                    variables: { id: natureAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.startNatureAlbum.data.startCount).toBe(1);
        });
        it('finishNatureAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishNatureAlbum,
                    variables: { id: natureAlbumId, duration: 10 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishNatureAlbum.data.finishCount).toBe(1);
            expect(JSON.parse(res.text).data.finishNatureAlbum.data.totalDuration).toBe(10);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishNatureAlbum,
                    variables: { id: natureAlbumId, duration: 15 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishNatureAlbum.data.finishCount).toBe(2);
            expect(JSON.parse(res.text).data.finishNatureAlbum.data.totalDuration).toBe(25);
            expect(JSON.parse(res.text).data.finishNatureAlbum.data.longestDuration).toBe(15);
        });

        it('getNatureAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNatureAlbum,
                    variables: { first: 5, after: 0, before: Math.floor(Date.now() / 1000) + 1000, status: 0 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNatureAlbum.data.length).toBe(1);
        });
        it('getNatureAlbumById', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNatureAlbumById,
                    variables: { id: natureAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNatureAlbumById.data.id).toBe(natureAlbumId);
        });
        it('getNatureAlbumByIds', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNatureAlbumByIds,
                    variables: { ids: [natureAlbumId] }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNatureAlbumByIds.data.length).toBe(1);
            expect(JSON.parse(res.text).data.getNatureAlbumByIds.data[0].id).toBe(natureAlbumId);
        });
        it('searchNatureAlbum', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNatureAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "饺子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNatureAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "馒头",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNatureAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "红豆面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNatureAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "抹茶面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchNatureAlbum,
                    variables: { keyword: "面包", page: 1, limit: 1 }
                });
            expect(res.status).toBe(200);

            expect(JSON.parse(res.text).data.searchNatureAlbum.data.total).toBe(2);
            expect(JSON.parse(res.text).data.searchNatureAlbum.data.data.length).toBe(1);
        });
        it('getNatureAlbumRecordByNatureAlbumId', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getNatureAlbumRecordByNatureAlbumId,
                    variables: { natureAlbumId: natureAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getNatureAlbumRecordByNatureAlbumId.data.natureAlbumId).toBe(natureAlbumId);
        });
        it('searchNatureAlbumRecord', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchNatureAlbumRecord,
                    variables: { page: 1, limit: 10, sort: '+id' }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.searchNatureAlbumRecord.data.length).toBe(1);
        });

        it.todo('getNatureByNatureAlbumId');
    });

    describe('Wander', () => {
        let userId = '';
        let wanderId;
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });

        it('createWander', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWander,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "面子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            wanderAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createWander.code).toBe(200);
            expect(JSON.parse(res.text).data.createWander.message).toBe("success");
            expect(JSON.parse(res.text).data.createWander.data).toHaveProperty('id');
            wanderId = JSON.parse(res.text).data.createWander.data.id;
            expect(JSON.parse(res.text).data.createWander.data.name).toBe('面子');
            expect(JSON.parse(res.text).data.createWander.data.status).toBe(0);
        });
        it('updateWander', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateWander,
                    variables: { id: wanderId, data: { name: "新面子" } }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateWander.code).toBe(200);
            expect(JSON.parse(res.text).data.updateWander.message).toBe("success");
            expect(JSON.parse(res.text).data.updateWander.data.id).toBe(wanderId);
            expect(JSON.parse(res.text).data.updateWander.data.name).toBe('新面子');
        });
        it('deleteWander', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteWander,
                    variables: { id: wanderId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.deleteWander.code).toBe(200);
            expect(JSON.parse(res.text).data.deleteWander.message).toBe("success");
            expect(JSON.parse(res.text).data.deleteWander.data.id).toBe(wanderId);
            expect(JSON.parse(res.text).data.deleteWander.data.status).toBe(1);
        });
        it('revertDeletedWander', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.revertDeletedWander,
                    variables: { id: wanderId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedWander.code).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedWander.message).toBe("success");
            expect(JSON.parse(res.text).data.revertDeletedWander.data.id).toBe(wanderId);
            expect(JSON.parse(res.text).data.revertDeletedWander.data.status).toBe(0);
        });

        it('favoriteWander', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteWander,
                    variables: { id: wanderId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.favoriteWander.code).toBe(200);
            expect(JSON.parse(res.text).data.favoriteWander.message).toBe("success");
            expect(JSON.parse(res.text).data.favoriteWander.data.wanderId).toBe(wanderId);
            expect(JSON.parse(res.text).data.favoriteWander.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.favoriteWander.data.favorite).toBe(1);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteWander,
                    variables: { id: wanderId }
                });
            expect(JSON.parse(res.text).data.favoriteWander.data.favorite).toBe(2);
        });
        it('buyWander', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 1000000,
                        extraInfo: "change in e2e test for buyWander test"
                    }
                });
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyWander,
                    variables: { id: wanderId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.buyWander.code).toBe(200);
            expect(JSON.parse(res.text).data.buyWander.message).toBe("success");
            expect(JSON.parse(res.text).data.buyWander.data.wanderId).toBe(wanderId);
            expect(JSON.parse(res.text).data.buyWander.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.buyWander.data.boughtTime).not.toBe(0);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyWander,
                    variables: { id: wanderId }
                });
            expect(JSON.parse(res.text).data.buyWander.code).toBe(400);
            expect(JSON.parse(res.text).data.buyWander.message).toBe("already bought");
        });
        it('startWander', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.startWander,
                    variables: { id: wanderId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.startWander.data.startCount).toBe(1);
        });
        it('finishWander', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishWander,
                    variables: { id: wanderId, duration: 10 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishWander.data.finishCount).toBe(1);
            expect(JSON.parse(res.text).data.finishWander.data.totalDuration).toBe(10);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishWander,
                    variables: { id: wanderId, duration: 15 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishWander.data.finishCount).toBe(2);
            expect(JSON.parse(res.text).data.finishWander.data.totalDuration).toBe(25);
            expect(JSON.parse(res.text).data.finishWander.data.longestDuration).toBe(15);
        });

        it('getWander', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWander,
                    variables: { first: 5, after: 0, before: Math.floor(Date.now() / 1000) + 1000, status: 0 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWander.data.length).toBe(1);
        });
        it('getWanderById', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWanderById,
                    variables: { id: wanderId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWanderById.data.id).toBe(wanderId);
        });
        it('getWanderByIds', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWanderByIds,
                    variables: { ids: [wanderId] }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWanderByIds.data.length).toBe(1);
            expect(JSON.parse(res.text).data.getWanderByIds.data[0].id).toBe(wanderId);
        });
        it('searchWander', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWander,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "饺子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            wanderAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWander,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "馒头",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            wanderAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWander,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "红豆面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            wanderAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWander,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "抹茶面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            wanderAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchWander,
                    variables: { keyword: "面包", page: 1, limit: 1 }
                });
            expect(res.status).toBe(200);

            expect(JSON.parse(res.text).data.searchWander.data.total).toBe(2);
            expect(JSON.parse(res.text).data.searchWander.data.data.length).toBe(1);
        });
        it('getWanderRecordByWanderId', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWanderRecordByWanderId,
                    variables: { wanderId: wanderId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWanderRecordByWanderId.data.wanderId).toBe(wanderId);
        });
        it('searchWanderRecord', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchWanderRecord,
                    variables: { page: 1, limit: 10, sort: '+id' }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.searchWanderRecord.data.length).toBe(1);
        });
    });

    describe('WanderAlbum', () => {
        let userId = '';
        let wanderAlbumId;
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });

        it('createWanderAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWanderAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "面子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createWanderAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.createWanderAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.createWanderAlbum.data).toHaveProperty('id');
            wanderAlbumId = JSON.parse(res.text).data.createWanderAlbum.data.id;
            expect(JSON.parse(res.text).data.createWanderAlbum.data.name).toBe('面子');
            expect(JSON.parse(res.text).data.createWanderAlbum.data.status).toBe(0);
        });
        it('updateWanderAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateWanderAlbum,
                    variables: { id: wanderAlbumId, data: { name: "新面子" } }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateWanderAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.updateWanderAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.updateWanderAlbum.data.id).toBe(wanderAlbumId);
            expect(JSON.parse(res.text).data.updateWanderAlbum.data.name).toBe('新面子');
        });
        it('deleteWanderAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteWanderAlbum,
                    variables: { id: wanderAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.deleteWanderAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.deleteWanderAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.deleteWanderAlbum.data.id).toBe(wanderAlbumId);
            expect(JSON.parse(res.text).data.deleteWanderAlbum.data.status).toBe(1);
        });
        it('revertDeletedWanderAlbum', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.revertDeletedWanderAlbum,
                    variables: { id: wanderAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedWanderAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.revertDeletedWanderAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.revertDeletedWanderAlbum.data.id).toBe(wanderAlbumId);
            expect(JSON.parse(res.text).data.revertDeletedWanderAlbum.data.status).toBe(0);
        });
        it('favoriteWanderAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteWanderAlbum,
                    variables: { id: wanderAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.favoriteWanderAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.favoriteWanderAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.favoriteWanderAlbum.data.wanderAlbumId).toBe(wanderAlbumId);
            expect(JSON.parse(res.text).data.favoriteWanderAlbum.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.favoriteWanderAlbum.data.favorite).toBe(1);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.favoriteWanderAlbum,
                    variables: { id: wanderAlbumId }
                });
            expect(JSON.parse(res.text).data.favoriteWanderAlbum.data.favorite).toBe(2);
        });
        it('buyWanderAlbum', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 1000000,
                        extraInfo: "change in e2e test for buyWanderAlbum test"
                    }
                });
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyWanderAlbum,
                    variables: { id: wanderAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.buyWanderAlbum.code).toBe(200);
            expect(JSON.parse(res.text).data.buyWanderAlbum.message).toBe("success");
            expect(JSON.parse(res.text).data.buyWanderAlbum.data.wanderAlbumId).toBe(wanderAlbumId);
            expect(JSON.parse(res.text).data.buyWanderAlbum.data.userId).toBe(userId);
            expect(JSON.parse(res.text).data.buyWanderAlbum.data.boughtTime).not.toBe(0);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.buyWanderAlbum,
                    variables: { id: wanderAlbumId }
                });
            expect(JSON.parse(res.text).data.buyWanderAlbum.code).toBe(400);
            expect(JSON.parse(res.text).data.buyWanderAlbum.message).toBe("already bought");
        });
        it('startWanderAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.startWanderAlbum,
                    variables: { id: wanderAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.startWanderAlbum.data.startCount).toBe(1);
        });
        it('finishWanderAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishWanderAlbum,
                    variables: { id: wanderAlbumId, duration: 10 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishWanderAlbum.data.finishCount).toBe(1);
            expect(JSON.parse(res.text).data.finishWanderAlbum.data.totalDuration).toBe(10);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.finishWanderAlbum,
                    variables: { id: wanderAlbumId, duration: 15 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.finishWanderAlbum.data.finishCount).toBe(2);
            expect(JSON.parse(res.text).data.finishWanderAlbum.data.totalDuration).toBe(25);
            expect(JSON.parse(res.text).data.finishWanderAlbum.data.longestDuration).toBe(15);
        });

        it('getWanderAlbum', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWanderAlbum,
                    variables: { first: 5, after: 0, before: Math.floor(Date.now() / 1000) + 1000, status: 0 }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWanderAlbum.data.length).toBe(1);
        });
        it('getWanderAlbumById', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWanderAlbumById,
                    variables: { id: wanderAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWanderAlbumById.data.id).toBe(wanderAlbumId);
        });
        it('getWanderAlbumByIds', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWanderAlbumByIds,
                    variables: { ids: [wanderAlbumId] }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWanderAlbumByIds.data.length).toBe(1);
            expect(JSON.parse(res.text).data.getWanderAlbumByIds.data[0].id).toBe(wanderAlbumId);
        });
        it('searchWanderAlbum', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWanderAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "饺子",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWanderAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "馒头",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWanderAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "红豆面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createWanderAlbum,
                    variables: {
                        data: {
                            background: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
                            name: "抹茶面包",
                            description: "韩国人真实爱面子",
                            scenes: [],
                            price: 100,
                            author: userId,
                            copy: '韩国人这个车、房子、衣服、长相啊 什么都要比',
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000)
                        }
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchWanderAlbum,
                    variables: { keyword: "面包", page: 1, limit: 1 }
                });
            expect(res.status).toBe(200);

            expect(JSON.parse(res.text).data.searchWanderAlbum.data.total).toBe(2);
            expect(JSON.parse(res.text).data.searchWanderAlbum.data.data.length).toBe(1);
        });
        it('getWanderAlbumRecordByWanderAlbumId', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getWanderAlbumRecordByWanderAlbumId,
                    variables: { wanderAlbumId: wanderAlbumId }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.getWanderAlbumRecordByWanderAlbumId.data.wanderAlbumId).toBe(wanderAlbumId);
        });
        it('searchWanderAlbumRecord', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchWanderAlbumRecord,
                    variables: { page: 1, limit: 10, sort: '+id' }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.searchWanderAlbumRecord.data.length).toBe(1);
        });

        it.todo('getWanderByWanderAlbumId');
    });

    describe('Home', () => {
        let userId = '';
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });
        let homeNatureId;
        it('createHome', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createHome,
                    variables: {
                        data: {
                            type: "nature",
                            resourceId: "000000000000000000000000",
                            background: ["https://i0.hdslb.com/bfs/live/225c6cba878929cd0ca775d118fee75526c78d02.png"],
                            name: "首页空白自然标签",
                            description: "自然就是盖亚",
                            author: userId,
                            position: 0,
                            validTime: Math.floor(Date.now() / 1000),
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createHome.code).toBe(200);
            expect(JSON.parse(res.text).data.createHome.message).toBe("success");
            expect(JSON.parse(res.text).data.createHome.data).toHaveProperty('id');
            homeNatureId = JSON.parse(res.text).data.createHome.data.id;
            expect(JSON.parse(res.text).data.createHome.data.name).toBe('首页空白自然标签');
        });
        it('updateHome', async () => {
            let newDescription = '自然其实是乌拉诺斯';
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateHome,
                    variables: {
                        id: homeNatureId,
                        data: {
                            description: newDescription
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateHome.code).toBe(200);
            expect(JSON.parse(res.text).data.updateHome.message).toBe("success");
            expect(JSON.parse(res.text).data.updateHome.data).toHaveProperty('id');
            expect(JSON.parse(res.text).data.updateHome.data.description).toBe(newDescription);
            expect(JSON.parse(res.text).data.updateHome.data.name).toBe("首页空白自然标签");
        });
        it('deleteHome', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteHome,
                    variables: {
                        id: homeNatureId
                    }
                });
            expect(JSON.parse(res.text).data.deleteHome.data.id).toBe(homeNatureId);
        });
        it('getHome', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createHome,
                    variables: {
                        data: {
                            type: "mindfulness",
                            resourceId: "000000000000000000000000",
                            background: ["https://i0.hdslb.com/bfs/live/225c6cba878929cd0ca775d118fee75526c78d02.png"],
                            name: "正念",
                            description: "正念描述",
                            author: userId,
                            position: 0,
                            validTime: Math.floor(Date.now() / 1000),
                        }
                    }
                });
            let natureRes = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createHome,
                    variables: {
                        data: {
                            type: "nature",
                            resourceId: "000000000000000000000000",
                            background: ["https://i0.hdslb.com/bfs/live/225c6cba878929cd0ca775d118fee75526c78d02.png"],
                            name: "自然",
                            description: "自然描述",
                            author: userId,
                            position: 1,
                            validTime: Math.floor(Date.now() / 1000),
                        }
                    }
                });
            homeNatureId = JSON.parse(natureRes.text).data.createHome.data.id;
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createHome,
                    variables: {
                        data: {
                            type: "wander",
                            resourceId: "000000000000000000000000",
                            background: ["https://i0.hdslb.com/bfs/live/225c6cba878929cd0ca775d118fee75526c78d02.png"],
                            name: "漫步",
                            description: "漫步",
                            author: userId,
                            position: 2,
                            validTime: Math.floor(Date.now() / 1000),
                        }
                    }
                });
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getHome,
                    variables: {
                        first: 5
                    }
                });
            expect(JSON.parse(res.text).data.getHome.data.length).toBe(3);
        });
        it('getHomeByPageAndLimit', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getHomeByPageAndLimit,
                    variables: {
                        page: 1,
                        limit: 2
                    }
                });
            expect(JSON.parse(res.text).data.getHomeByPageAndLimit.data.length).toBe(2);
            expect(JSON.parse(res.text).data.getHomeByPageAndLimit.data[1].position).toBe(1);
        });
        it('countHome', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.countHome,
                    variables: {
                        position: 1
                    }
                });
            expect(JSON.parse(res.text).data.countHome.data).toBe(1);
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.countHome
                });
            expect(JSON.parse(res.text).data.countHome.data).toBe(3);
        });
        it('getHomeById', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getHomeById,
                    variables: {
                        id: homeNatureId
                    }
                });
            expect(JSON.parse(res.text).data.getHomeById.data.id).toBe(homeNatureId);
        });
    });

    describe('New', () => {
        it('getNew', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.getNew,
                    variables: {
                        first: 50,
                    }
                });
            expect(JSON.parse(res.text).data.getNew.data.length).toBe(30);
        });
    });

    describe('Discount', () => {
        let userId = '';
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            userId = resObj.data.getCurrentUser.data.id
        });
        let discountId;
        let natureId;
        it('createDiscount', async () => {
            let createNatureRes = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createNature,
                    variables: {
                        data: {
                            background: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            name: "天生注定被打折",
                            description: "天生注定被打折的自然",
                            scenes: [],
                            price: 100,
                            author: userId,
                            audio: 'https://archive.org/download/testmp3testfile/testmp3testfile_64kb.m3u',
                            copy: '打折的一概不买，只买原价的',
                            natureAlbums: [],
                            status: 0,
                            validTime: Math.floor(Date.now() / 1000),
                        }
                    }
                });
            natureId = JSON.parse(createNatureRes.text).data.createNature.data.id;

            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createDiscount,
                    variables: {
                        data: {
                            type: "nature",
                            resourceId: natureId,
                            background: ["https://i0.hdslb.com/bfs/live/225c6cba878929cd0ca775d118fee75526c78d02.png"],
                            name: "自然某个打九折",
                            discount: 90,
                            beginTime: Math.floor(Date.now() / 1000) - 10000,
                            endTime: Math.floor(Date.now() / 1000) + 10000,
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.createDiscount.code).toBe(200);
            expect(JSON.parse(res.text).data.createDiscount.message).toBe("success");
            expect(JSON.parse(res.text).data.createDiscount.data).toHaveProperty('id');
            discountId = JSON.parse(res.text).data.createDiscount.data.id;
            expect(JSON.parse(res.text).data.createDiscount.data.name).toBe('自然某个打九折');
            expect(JSON.parse(res.text).data.createDiscount.data.resourceId).toBe(natureId);
        });
        it('updateDiscount', async () => {
            let newName = '打折一时爽，一直打折一直爽';
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateDiscount,
                    variables: {
                        id: discountId,
                        data: {
                            name: newName
                        }
                    }
                });
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).data.updateDiscount.code).toBe(200);
            expect(JSON.parse(res.text).data.updateDiscount.message).toBe("success");
            expect(JSON.parse(res.text).data.updateDiscount.data).toHaveProperty('id');
            expect(JSON.parse(res.text).data.updateDiscount.data.name).toBe(newName);
            expect(JSON.parse(res.text).data.updateDiscount.data.discount).toBe(90);
        });
        it('deleteDiscount', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.deleteDiscount,
                    variables: {
                        id: discountId
                    }
                });
            expect(JSON.parse(res.text).data.deleteDiscount.data.id).toBe(discountId);
        });
        it('getDiscount', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getDiscount,
                    variables: {
                        id: discountId
                    }
                });
            expect(JSON.parse(res.text).data.getDiscount.data.length).toBe(0);
        });
        it('getFree', async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createDiscount,
                    variables: {
                        data: {
                            type: "nature",
                            resourceId: "000000000000000000000000",
                            background: ["https://i0.hdslb.com/bfs/live/225c6cba878929cd0ca775d118fee75526c78d02.png"],
                            name: "自然某个不要钱",
                            discount: 0,
                            beginTime: Math.floor(Date.now() / 1000) - 10000,
                            endTime: Math.floor(Date.now() / 1000) + 10000,
                        }
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.createDiscount,
                    variables: {
                        data: {
                            type: "nature",
                            resourceId: "000000000000000000000000",
                            background: ["https://i0.hdslb.com/bfs/live/225c6cba878929cd0ca775d118fee75526c78d02.png"],
                            name: "自然某个打八折",
                            discount: 80,
                            beginTime: Math.floor(Date.now() / 1000) - 10000,
                            endTime: Math.floor(Date.now() / 1000) + 10000,
                        }
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getDiscount,
                    variables: {
                        id: discountId,
                        discount: 80
                    }
                });
            expect(JSON.parse(res.text).data.getDiscount.data.length).toBe(2);

            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getFree,
                    variables: {
                        id: discountId
                    }
                });
            expect(JSON.parse(res.text).data.getFree.data.length).toBe(1);
            expect(JSON.parse(res.text).data.getFree.data[0].discount).toBe(0);
        });
        let discountIds = [];
        it('getDiscountByPageAndLimit', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getDiscountByPageAndLimit,
                    variables: {
                        page: 1,
                        limit: 5
                    }
                });
            expect(JSON.parse(res.text).data.getDiscountByPageAndLimit.data.length).toBe(2);
            discountIds = JSON.parse(res.text).data.getDiscountByPageAndLimit.data.map((discount) => discount.id);
        });
        it('countDiscount', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.countDiscount
                });
            expect(JSON.parse(res.text).data.countDiscount.data).toBe(2);
        });
        it('getDiscountByIds', async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getDiscountByIds,
                    variables: { ids: discountIds }
                });
            expect(JSON.parse(res.text).data.getDiscountByIds.data[0].id).toBe(discountIds[0]);
            expect(JSON.parse(res.text).data.getDiscountByIds.data[1].id).toBe(discountIds[1]);
        });
    });
});
