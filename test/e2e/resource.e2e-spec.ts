import { INestApplication, INestApplicationContext } from '@nestjs/common';
import * as supertest from 'supertest';

const mutations = require('./gql/mutations');
const queries = require('./gql/queries');

describe('Resource', () => {
    let app: INestApplication;

    beforeAll(async () => {
        // done();
        app = process['__app__'];
    }, 20000000);

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
        let adminToken = '';
        beforeAll(async () => {
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
        });
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
        let adminToken = '';
        let userId = '';
        let mindfulnessId;
        beforeAll(async () => {
            let res = await supertest(app.getHttpServer())
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

            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            resObj = JSON.parse(res.text);
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
            expect(JSON.parse(res.text).data.buyMindfulness.data.boughtTime).toBe(Math.floor(Date.now() / 1000));
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
        it.todo('startMindfulness');
        it.todo('finishMindfulness');

        it.todo('getMindfulness');
        it.todo('getMindfulnessById');
        it.todo('getMindfulnessByIds');
        it.todo('searchMindfulness');
        it.todo('getMindfulnessRecordByMindfulnessId');
        it.todo('searchMindfulnessRecord');
    });

    describe('MindfulnessAlbum', () => {
        it.todo('createMindfulnessAlbum');
        it.todo('updateMindfulnessAlbum');
        it.todo('deleteMindfulnessAlbum');
        it.todo('revertDeletedMindfulnessAlbum');
        it.todo('favoriteMindfulnessAlbum');
        it.todo('buyMindfulnessAlbum');
        it.todo('startMindfulnessAlbum');
        it.todo('finishMindfulnessAlbum');

        it.todo('getMindfulnessAlbum');
        it.todo('getMindfulnessAlbumById');
        it.todo('getMindfulnessAlbumByIds');
        it.todo('searchMindfulnessAlbum');
        it.todo('getMindfulnessAlbumRecordByMindfulnessAlbumId');
        it.todo('searchMindfulnessAlbumRecord');

        it.todo('getMindfulnessByMindfulnessAlbumId');
    });

    describe('Nature', () => {
        it.todo('createNature');
        it.todo('updateNature');
        it.todo('deleteNature');
        it.todo('revertDeletedNature');
        it.todo('favoriteNature');
        it.todo('buyNature');
        it.todo('startNature');
        it.todo('finishNature');

        it.todo('getNature');
        it.todo('getNatureById');
        it.todo('getNatureByIds');
        it.todo('searchNature');
        it.todo('getNatureRecordByNatureId');
        it.todo('searchNatureRecord');
    });

    describe('NatureAlbum', () => {
        it.todo('createNatureAlbum');
        it.todo('updateNatureAlbum');
        it.todo('deleteNatureAlbum');
        it.todo('revertDeletedNatureAlbum');
        it.todo('favoriteNatureAlbum');
        it.todo('buyNatureAlbum');
        it.todo('startNatureAlbum');
        it.todo('finishNatureAlbum');

        it.todo('getNatureAlbum');
        it.todo('getNatureAlbumById');
        it.todo('getNatureAlbumByIds');
        it.todo('searchNatureAlbum');
        it.todo('getNatureAlbumRecordByNatureAlbumId');
        it.todo('searchNatureAlbumRecord');

        it.todo('getNatureByNatureAlbumId');
    });

    describe('Wander', () => {
        it.todo('createWander');
        it.todo('updateWander');
        it.todo('deleteWander');
        it.todo('revertDeletedWander');
        it.todo('favoriteWander');
        it.todo('buyWander');
        it.todo('startWander');
        it.todo('finishWander');

        it.todo('getWander');
        it.todo('getWanderById');
        it.todo('getWanderByIds');
        it.todo('searchWander');
        it.todo('getWanderRecordByWanderId');
        it.todo('searchWanderRecord');
    });

    describe('WanderAlbum', () => {
        it.todo('createWanderAlbum');
        it.todo('updateWanderAlbum');
        it.todo('deleteWanderAlbum');
        it.todo('revertDeletedWanderAlbum');
        it.todo('favoriteWanderAlbum');
        it.todo('buyWanderAlbum');
        it.todo('startWanderAlbum');
        it.todo('finishWanderAlbum');

        it.todo('getWanderAlbum');
        it.todo('getWanderAlbumById');
        it.todo('getWanderAlbumByIds');
        it.todo('searchWanderAlbum');
        it.todo('getWanderAlbumRecordByWanderAlbumId');
        it.todo('searchWanderAlbumRecord');

        it.todo('getWanderByWanderAlbumId');
    });

    describe('Home', () => {
        let adminToken = '';
        beforeAll(async () => {
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
        });
        it.todo('createHome');
        it.todo('updateHome');
        it.todo('deleteScene');
        it.todo('getHome');
        it.todo('getHomeByPageAndLimit');
        it.todo('countHome');
        it.todo('getHomeById');
    });

    describe('New', () => {
        it.todo('getNew');
    });

    describe('Discount', () => {
        it.todo('getDiscount');
        it.todo('getFree');
        it.todo('getDiscountByPageAndLimit');
        it.todo('countDiscount');
        it.todo('getDiscountByIds');
        it.todo('createDiscount');
        it.todo('updateDiscount');
        it.todo('deleteDiscount');
    });
});
