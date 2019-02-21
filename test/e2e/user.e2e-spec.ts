import {Test} from '@nestjs/testing';
import {INestApplication, INestApplicationContext} from '@nestjs/common';
import * as supertest from 'supertest';
import {ServiceBroker} from 'moleculer';

const mutations = require('./gql/mutations');
const queries = require('./gql/queries');

describe('User', () => {
    let app: INestApplication;
    let broker: ServiceBroker;

    beforeAll(async (done) => {
        const {AppModule} = require('../../packages/sati/src/app.module');
        const {ResourceModule} = require('../../packages/sati-resource/src/resource.module');
        const {UserModule} = require('../../packages/sati-user/src/user.module');
        const {StatsModule} = require('../../packages/sati-stats/src/stats.module');

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

    describe('User', () => {
        const mobile = `13800138000-${Date.now()}`;
        const nickname = `test-${Date.now()}`;
        const password = `pw-${Date.now()}`;
        const avatar = "https://www.baidu.com/img/bd_logo1.png";
        let token = '';
        let userId = '';
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
        it(`registerBySMSCode`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: mutations.registerBySMSCode,
                    variables: {
                        registerUserInput: {
                            mobile: mobile,
                            password: password,
                            nickname: nickname,
                            avatar: avatar
                        },
                        verificationCode: "666"
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.registerBySMSCode.code).toBe(200);
            expect(resObj.data.registerBySMSCode.message).toBe("success");
            expect(resObj.data.registerBySMSCode.data).toHaveProperty('id');
            expect(resObj.data.registerBySMSCode.data.mobile).toBe(mobile);
            expect(resObj.data.registerBySMSCode.data.nickname).toBe(nickname);
            expect(resObj.data.registerBySMSCode.data.avatar).toBe(avatar);
            expect(resObj.data.registerBySMSCode.data.status).toBe(1);
            expect(resObj.data.registerBySMSCode.data.balance).toBe(0);
            expect(resObj.data.registerBySMSCode.data.role).toBe(0);
        });

        it(`loginBySMSCode`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.loginBySMSCode,
                    variables: {
                        mobile: mobile,
                        verificationCode: "666"
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.loginBySMSCode.code).toBe(200);
            expect(resObj.data.loginBySMSCode.message).toBe("success");
            expect(resObj.data.loginBySMSCode.data).toHaveProperty('accessToken');
            expect(resObj.data.loginBySMSCode.data).toHaveProperty('expiresIn');
            token = resObj.data.loginBySMSCode.data.accessToken;
        });

        it(`loginByMobileAndPassword`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.loginByMobileAndPassword,
                    variables: {
                        mobile: mobile,
                        password: password
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.loginByMobileAndPassword.code).toBe(200);
            expect(resObj.data.loginByMobileAndPassword.message).toBe("success");
            expect(resObj.data.loginByMobileAndPassword.data).toHaveProperty('accessToken');
            expect(resObj.data.loginByMobileAndPassword.data).toHaveProperty('expiresIn');
            token = resObj.data.loginByMobileAndPassword.data.accessToken;
        });

        it(`sendLoginVerificationCode`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sendLoginVerificationCode,
                    variables: {
                        mobile: mobile
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.sendLoginVerificationCode.code).toBe(200);
            expect(resObj.data.sendLoginVerificationCode.message).toBe("success");
        });

        it(`sendRegisterVerificationCode`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.sendRegisterVerificationCode,
                    variables: {
                        mobile: mobile
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.sendRegisterVerificationCode.code).toBe(200);
            expect(resObj.data.sendRegisterVerificationCode.message).toBe("success");
        });

        it(`getCurrentUser`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.getCurrentUser.code).toBe(200);
            expect(resObj.data.getCurrentUser.message).toBe("userInfo from context");
            expect(resObj.data.getCurrentUser.data).toHaveProperty('id');
            userId = resObj.data.getCurrentUser.data.id;
            expect(resObj.data.getCurrentUser.data.mobile).toBe(mobile);
            expect(resObj.data.getCurrentUser.data.nickname).toBe(nickname);
            expect(resObj.data.getCurrentUser.data.avatar).toBe(avatar);
            expect(resObj.data.getCurrentUser.data.status).toBe(1);
            expect(resObj.data.getCurrentUser.data.balance).toBe(0);
            expect(resObj.data.getCurrentUser.data.role).toBe(0);
        });

        it(`getUserById`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: queries.getUserById,
                    variables: {
                        id: userId
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.getUserById.code).toBe(200);
            expect(resObj.data.getUserById.message).toBe("success");
            expect(resObj.data.getUserById.data.id).toBe(userId);
            expect(resObj.data.getUserById.data.mobile).toBe(mobile);
            expect(resObj.data.getUserById.data.nickname).toBe(nickname);
            expect(resObj.data.getUserById.data.avatar).toBe(avatar);
            expect(resObj.data.getUserById.data.status).toBe(1);
            expect(resObj.data.getUserById.data.balance).toBe(0);
            expect(resObj.data.getUserById.data.role).toBe(0);
        });

        it(`getUserByMobile`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getUserByMobile,
                    variables: {
                        mobile: mobile
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.getUserByMobile.code).toBe(200);
            expect(resObj.data.getUserByMobile.message).toBe("success");
            expect(resObj.data.getUserByMobile.data.mobile).toBe(mobile);
            expect(resObj.data.getUserByMobile.data.nickname).toBe(nickname);
            expect(resObj.data.getUserByMobile.data.avatar).toBe(avatar);
            expect(resObj.data.getUserByMobile.data.status).toBe(1);
            expect(resObj.data.getUserByMobile.data.balance).toBe(0);
            expect(resObj.data.getUserByMobile.data.role).toBe(0);
        });

        it(`getUser`, async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getUser,
                    variables: {
                        first: 2
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.getUser.code).toBe(200);
            expect(resObj.data.getUser.message).toBe("success");
            expect(resObj.data.getUser.data.length).toBe(2);

            let firstId = resObj.data.getUser.data[0].id;
            let secondId = resObj.data.getUser.data[1].id;

            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.getUser,
                    variables: {
                        first: 2,
                        after: secondId
                    }
                });
            expect(res.status).toBe(200);
            resObj = JSON.parse(res.text);
            expect(resObj.data.getUser.code).toBe(200);
            expect(resObj.data.getUser.message).toBe("success");
            expect(resObj.data.getUser.data.length).toBe(2);
            expect(resObj.data.getUser.data[0].id).toBe(secondId);
        });

        it(`searchUser`, async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchUser,
                    variables: {
                        keyword: "月",
                        page: 1,
                        limit: 20
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.searchUser.code).toBe(200);
            expect(resObj.data.searchUser.message).toBe("success");
            expect(resObj.data.searchUser.data.total).toBe(3);
            expect(resObj.data.searchUser.data.data.length).toBe(3);
        });

        it(`countUser`, async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.countUser,
                    variables: {
                        keyword: "月"
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.countUser.code).toBe(200);
            expect(resObj.data.countUser.message).toBe("success");
            expect(resObj.data.countUser.data).toBe(3);
        });

        it(`renewToken`, async () => {
            // 等一秒，否则jwt算出来的token不变
            await new Promise((resolve) => setTimeout(resolve, 1000));
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: queries.renewToken
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.renewToken.code).toBe(200);
            expect(resObj.data.renewToken.message).toBe("success");
            expect(resObj.data.renewToken.data.accessToken).not.toBe(token);
            token = resObj.data.renewToken.data.accessToken;
        });

        it(`updateCurrentUser`, async () => {
            let newNickname = `test-太阳-${Date.now()}`;
            let newPassword = `passwordChanged`;
            let newAvatar = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: mutations.updateCurrentUser,
                    variables: {
                        updateCurrentUserInput: {
                            nickname: newNickname,
                            password: newPassword,
                            avatar: newAvatar
                        }
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.updateCurrentUser.code).toBe(200);
            expect(resObj.data.updateCurrentUser.message).toBe("success");
            expect(resObj.data.updateCurrentUser.data.id).toBe(userId);
            expect(resObj.data.updateCurrentUser.data.nickname).toBe(newNickname);
            expect(resObj.data.updateCurrentUser.data.avatar).toBe(newAvatar);
        });

        it(`updateUserById`, async () => {
            let newNickname = `testAdmin-太阳-${Date.now()}`;
            let newPassword = `adminPasswordChanged`;
            let newAvatar = 'https://s.yimg.jp/images/top/sp2/cmn/logo-170307.png';
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateUserById,
                    variables: {
                        updateUserInput: {
                            id: userId,
                            nickname: newNickname,
                            password: newPassword,
                            avatar: newAvatar,
                            status: 1
                        }
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.updateUserById.code).toBe(200);
            expect(resObj.data.updateUserById.message).toBe("success");
            expect(resObj.data.updateUserById.data.id).toBe(userId);
            expect(resObj.data.updateUserById.data.nickname).toBe(newNickname);
            expect(resObj.data.updateUserById.data.avatar).toBe(newAvatar);
            expect(resObj.data.updateUserById.data.status).toBe(1);
        });

        it(`changeBalanceByAdmin`, async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 10,
                        extraInfo: "change in e2e test"
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.changeBalanceByAdmin.code).toBe(200);
            expect(resObj.data.changeBalanceByAdmin.message).toBe("success");
            expect(resObj.data.changeBalanceByAdmin.data.id).toBe(userId);


            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: queries.getCurrentUser
                });
            expect(res.status).toBe(200);
            resObj = JSON.parse(res.text);
            expect(resObj.data.getCurrentUser.data).toHaveProperty('id');
            expect(resObj.data.getCurrentUser.data.id).toBe(userId);
            expect(resObj.data.getCurrentUser.data.balance).toBe(10);
        });

        it(`searchUserAccount`, async () => {
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 1,
                        extraInfo: "change in e2e test1"
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 2,
                        extraInfo: "change in e2e test2"
                    }
                });
            await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: 3,
                        extraInfo: "change in e2e test3"
                    }
                });

            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchUserAccount,
                    variables: {
                        userId: userId,
                        page: 1,
                        limit: 10,
                        type: ''
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.searchUserAccount.code).toBe(200);
            expect(resObj.data.searchUserAccount.message).toBe("success");
            expect(resObj.data.searchUserAccount.data.length).toBe(4);
            expect(resObj.data.searchUserAccount.data[1].value).toBe(1);
            expect(resObj.data.searchUserAccount.data[2].value).toBe(2);
            expect(resObj.data.searchUserAccount.data[3].afterBalance).toBe(16);

        });

        it(`countUserAccount`, async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.countUserAccount,
                    variables: {
                        userId: userId,
                        type: ''
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.countUserAccount.code).toBe(200);
            expect(resObj.data.countUserAccount.message).toBe("success");
            expect(resObj.data.countUserAccount.data).toBe(4);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
