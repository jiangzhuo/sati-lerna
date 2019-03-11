import { INestApplication, INestApplicationContext } from '@nestjs/common';
import * as supertest from 'supertest';
import { Test } from "@nestjs/testing";
import { ServiceBroker } from 'moleculer';


const mutations = require('./gql/mutations');
const queries = require('./gql/queries');

describe('User', () => {
    let app: INestApplication;

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
        app = process['__app__'];
    }, 20000000);
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

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
                        mobile: "13800138000",
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

            const noMobileRes = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.loginByMobileAndPassword,
                    variables: {
                        mobile: "1999999999",
                        password: password
                    }
                });
            expect(noMobileRes.status).toBe(200);
            let noMobileResObj = JSON.parse(noMobileRes.text);

            expect(noMobileResObj.data.loginByMobileAndPassword.code).toBe(404);

            const wrongPasswordRes = await supertest(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: queries.loginByMobileAndPassword,
                    variables: {
                        mobile: mobile,
                        password: "888"
                    }
                });
            expect(wrongPasswordRes.status).toBe(200);
            let wrongPasswordResObj = JSON.parse(wrongPasswordRes.text);
            expect(wrongPasswordResObj.data.loginByMobileAndPassword.code).toBe(406);
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
            // 关键字
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
            // id
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchUser,
                    variables: {
                        keyword: userId,
                        page: 1,
                        limit: 20
                    }
                });
            expect(res.status).toBe(200);
            resObj = JSON.parse(res.text);
            expect(resObj.data.searchUser.code).toBe(200);
            expect(resObj.data.searchUser.message).toBe("success");
            expect(resObj.data.searchUser.data.total).toBe(1);
            expect(resObj.data.searchUser.data.data.length).toBe(1);
            expect(resObj.data.searchUser.data.data[0].id).toBe(userId);
            // 手机号
            res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.searchUser,
                    variables: {
                        keyword: "13800138000",
                        page: 1,
                        limit: 20
                    }
                });
            expect(res.status).toBe(200);
            resObj = JSON.parse(res.text);
            expect(resObj.data.searchUser.code).toBe(200);
            expect(resObj.data.searchUser.message).toBe("success");
            expect(resObj.data.searchUser.data.total).toBe(1);
            expect(resObj.data.searchUser.data.data.length).toBe(1);
            expect(resObj.data.searchUser.data.data[0].mobile).toBe("13800138000");
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

            let noUserRes = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.updateUserById,
                    variables: {
                        updateUserInput: {
                            id: "000000000000000000000000",
                            nickname: newNickname
                        }
                    }
                });
            expect(noUserRes.status).toBe(200);
            let noUserResObj = JSON.parse(noUserRes.text);
            expect(noUserResObj.data.updateUserById.code).toBe(404);
        });

        it(`changeBalanceByAdmin`, async () => {
            let res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: mutations.changeBalanceByAdmin,
                    variables: {
                        userId: userId,
                        changeValue: -10,
                        extraInfo: "change in e2e test"
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.changeBalanceByAdmin.code).toBe(402);

            res = await supertest(app.getHttpServer())
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
            resObj = JSON.parse(res.text);
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
                        type: 'changeByAdmin'
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
                        type: 'changeByAdmin'
                    }
                });
            expect(res.status).toBe(200);
            let resObj = JSON.parse(res.text);
            expect(resObj.data.countUserAccount.code).toBe(200);
            expect(resObj.data.countUserAccount.message).toBe("success");
            expect(resObj.data.countUserAccount.data).toBe(4);
        });
    });

    describe('IAP', () => {
        let adminToken = '';
        beforeAll(async () => {
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
        });

        it(`appleValidate`, async () => {
            const res = await supertest(app.getHttpServer())
                .post('/graphql')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    query: queries.appleValidate,
                    variables: {
                        receipt: "ewoJInNpZ25hdHVyZSIgPSAiQXBNVUJDODZBbHpOaWtWNVl0clpBTWlKUWJLOEVkZVhrNjNrV0JBWHpsQzhkWEd1anE0N1puSVlLb0ZFMW9OL0ZTOGNYbEZmcDlZWHQ5aU1CZEwyNTBsUlJtaU5HYnloaXRyeVlWQVFvcmkzMlc5YVIwVDhML2FZVkJkZlcrT3kvUXlQWkVtb05LeGhudDJXTlNVRG9VaFo4Wis0cFA3MHBlNWtVUWxiZElWaEFBQURWekNDQTFNd2dnSTdvQU1DQVFJQ0NHVVVrVTNaV0FTMU1BMEdDU3FHU0liM0RRRUJCUVVBTUg4eEN6QUpCZ05WQkFZVEFsVlRNUk13RVFZRFZRUUtEQXBCY0hCc1pTQkpibU11TVNZd0pBWURWUVFMREIxQmNIQnNaU0JEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVURXpNREVHQTFVRUF3d3FRWEJ3YkdVZ2FWUjFibVZ6SUZOMGIzSmxJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1CNFhEVEE1TURZeE5USXlNRFUxTmxvWERURTBNRFl4TkRJeU1EVTFObG93WkRFak1DRUdBMVVFQXd3YVVIVnlZMmhoYzJWU1pXTmxhWEIwUTJWeWRHbG1hV05oZEdVeEd6QVpCZ05WQkFzTUVrRndjR3hsSUdsVWRXNWxjeUJUZEc5eVpURVRNQkVHQTFVRUNnd0tRWEJ3YkdVZ1NXNWpMakVMTUFrR0ExVUVCaE1DVlZNd2daOHdEUVlKS29aSWh2Y05BUUVCQlFBRGdZMEFNSUdKQW9HQkFNclJqRjJjdDRJclNkaVRDaGFJMGc4cHd2L2NtSHM4cC9Sd1YvcnQvOTFYS1ZoTmw0WElCaW1LalFRTmZnSHNEczZ5anUrK0RyS0pFN3VLc3BoTWRkS1lmRkU1ckdYc0FkQkVqQndSSXhleFRldngzSExFRkdBdDFtb0t4NTA5ZGh4dGlJZERnSnYyWWFWczQ5QjB1SnZOZHk2U01xTk5MSHNETHpEUzlvWkhBZ01CQUFHamNqQndNQXdHQTFVZEV3RUIvd1FDTUFBd0h3WURWUjBqQkJnd0ZvQVVOaDNvNHAyQzBnRVl0VEpyRHRkREM1RllRem93RGdZRFZSMFBBUUgvQkFRREFnZUFNQjBHQTFVZERnUVdCQlNwZzRQeUdVakZQaEpYQ0JUTXphTittVjhrOVRBUUJnb3Foa2lHOTJOa0JnVUJCQUlGQURBTkJna3Foa2lHOXcwQkFRVUZBQU9DQVFFQUVhU2JQanRtTjRDL0lCM1FFcEszMlJ4YWNDRFhkVlhBZVZSZVM1RmFaeGMrdDg4cFFQOTNCaUF4dmRXLzNlVFNNR1k1RmJlQVlMM2V0cVA1Z204d3JGb2pYMGlreVZSU3RRKy9BUTBLRWp0cUIwN2tMczlRVWU4Y3pSOFVHZmRNMUV1bVYvVWd2RGQ0TndOWXhMUU1nNFdUUWZna1FRVnk4R1had1ZIZ2JFL1VDNlk3MDUzcEdYQms1MU5QTTN3b3hoZDNnU1JMdlhqK2xvSHNTdGNURXFlOXBCRHBtRzUrc2s0dHcrR0szR01lRU41LytlMVFUOW5wL0tsMW5qK2FCdzdDMHhzeTBiRm5hQWQxY1NTNnhkb3J5L0NVdk02Z3RLc21uT09kcVRlc2JwMGJzOHNuNldxczBDOWRnY3hSSHVPTVoydG04bnBMVW03YXJnT1N6UT09IjsKCSJwdXJjaGFzZS1pbmZvIiA9ICJld29KSW05eWFXZHBibUZzTFhCMWNtTm9ZWE5sTFdSaGRHVXRjSE4wSWlBOUlDSXlNREV5TFRBMExUTXdJREE0T2pBMU9qVTFJRUZ0WlhKcFkyRXZURzl6WDBGdVoyVnNaWE1pT3dvSkltOXlhV2RwYm1Gc0xYUnlZVzV6WVdOMGFXOXVMV2xrSWlBOUlDSXhNREF3TURBd01EUTJNVGM0T0RFM0lqc0tDU0ppZG5KeklpQTlJQ0l5TURFeU1EUXlOeUk3Q2draWRISmhibk5oWTNScGIyNHRhV1FpSUQwZ0lqRXdNREF3TURBd05EWXhOemc0TVRjaU93b0pJbkYxWVc1MGFYUjVJaUE5SUNJeElqc0tDU0p2Y21sbmFXNWhiQzF3ZFhKamFHRnpaUzFrWVhSbExXMXpJaUE5SUNJeE16TTFOems0TXpVMU9EWTRJanNLQ1NKd2NtOWtkV04wTFdsa0lpQTlJQ0pqYjIwdWJXbHVaRzF2WW1Gd2NDNWtiM2R1Ykc5aFpDSTdDZ2tpYVhSbGJTMXBaQ0lnUFNBaU5USXhNVEk1T0RFeUlqc0tDU0ppYVdRaUlEMGdJbU52YlM1dGFXNWtiVzlpWVhCd0xrMXBibVJOYjJJaU93b0pJbkIxY21Ob1lYTmxMV1JoZEdVdGJYTWlJRDBnSWpFek16VTNPVGd6TlRVNE5qZ2lPd29KSW5CMWNtTm9ZWE5sTFdSaGRHVWlJRDBnSWpJd01USXRNRFF0TXpBZ01UVTZNRFU2TlRVZ1JYUmpMMGROVkNJN0Nna2ljSFZ5WTJoaGMyVXRaR0YwWlMxd2MzUWlJRDBnSWpJd01USXRNRFF0TXpBZ01EZzZNRFU2TlRVZ1FXMWxjbWxqWVM5TWIzTmZRVzVuWld4bGN5STdDZ2tpYjNKcFoybHVZV3d0Y0hWeVkyaGhjMlV0WkdGMFpTSWdQU0FpTWpBeE1pMHdOQzB6TUNBeE5Ub3dOVG8xTlNCRmRHTXZSMDFVSWpzS2ZRPT0iOwoJImVudmlyb25tZW50IiA9ICJTYW5kYm94IjsKCSJwb2QiID0gIjEwMCI7Cgkic2lnbmluZy1zdGF0dXMiID0gIjAiOwp9"
                    }
                });
            expect(res.status).toBe(200);
            console.log(res.text)
            let resObj = JSON.parse(res.text);
            expect(resObj.data.appleValidate.code).toBe(200);
            expect(resObj.data.appleValidate.message).toBe("success");
            expect(resObj.data.appleValidate.data.isValidated).toBe(true);
        });
    });
});
