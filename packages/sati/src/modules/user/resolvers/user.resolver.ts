import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
// import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { AuthGuard } from '../auth/auth.guard';
import { ServiceBroker } from 'moleculer';
import { InjectBroker } from 'nestjs-moleculer';
import { LoggingInterceptor } from '../../../common/interceptors';

// import { __ as t } from 'i18n';

@Resolver()
@UseGuards(AuthGuard)
// @Resource({ name: 'user_manage', identify: 'user:manage' })
@UseInterceptors(LoggingInterceptor)
export class UserResolver {
    onModuleInit() {
        // this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @InjectBroker() private readonly userBroker: ServiceBroker,
        // @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory,
    ) {
    }

    private logger = new Logger('user');

    // private userServiceInterface;

    @Query('loginBySMSCode')
    async loginBySMSCode(req, body: { mobile: string, verificationCode: string }, context, resolveInfo): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.loginBySMSCode', body,
            {
                meta: {
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${body && body.mobile}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data: data.tokenInfo };
    }

    @Query('loginByMobileAndPassword')
    async loginByMobileAndPassword(req, body: { mobile: string, password: string }, context, resolveInfo): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.loginByMobileAndPassword', body,
            {
                meta: {
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${body && body.mobile}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data: data.tokenInfo };
    }

    @Query('renewToken')
    @Permission('user')
    async renewToken(req, body, context, resolveInfo) {
        const { data } = await this.userBroker.call('user.renewToken', { userId: context.user.id },
            {
                meta: {
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data: data.tokenInfo };
    }

    // @Query('adminLogin')
    // async adminLogin(req, body: { username: string, password: string }): Promise<CommonResult> {
    //     const { code, message, data } = await this.userBroker.call('user.login',body);
    //     const userInfoData = data.userInfoData;
    //     if (userInfoData.username !== 'sadmin' && userInfoData.userRoles.map(v => v.id).includes(1)) {
    //         throw new HttpException(t('You are not authorized to access'), 401);
    //     }
    //     return { code, message, data: data.tokenInfo };
    // }

    @Mutation('registerBySMSCode')
    async registerBySMSCode(req, { registerUserInput, verificationCode }, context, resolveInfo): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.registerBySMSCode',
            { registerUserInput, verificationCode },
            {
                meta: {
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            },
        );
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${registerUserInput && registerUserInput.mobile}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Query('sendLoginVerificationCode')
    async sendLoginVerificationCode(req, body, context, resolveInfo): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.getLoginVerificationCode', body,
            {
                meta: {
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${body && body.mobile}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success' };
    }

    @Query('sendRegisterVerificationCode')
    async sendRegisterVerificationCode(req, body, context, resolveInfo): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.getRegisterVerificationCode', body,
            {
                meta: {
                    udid: context.udid,
                    operationName: context.operationName,
                    clientIp: context.clientIp,
                },
            });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${body && body.mobile}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success' };
    }

    // @Mutation('createUser')
    // @Permission({ name: 'create_user', identify: 'user:createUser', action: 'create' })
    // async createUser(req, body): Promise<CommonResult> {
    //     return this.userBroker.call('user.createUser',body);
    // }

    // @Mutation('updateUserById')
    // async updateUserById(req, body): Promise<CommonResult> {
    //     return this.userBroker.call('user.updateUserById',body);
    // }

    @Mutation('updateCurrentUser')
    @Permission('user')
    async updateCurrentUser(req, body, context, resolveInfo): Promise<CommonResult> {
        body.updateCurrentUserInput.id = context.user.id;
        const { data } = await this.userBroker.call('user.updateUserById', body.updateCurrentUserInput);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Mutation('updateUserById')
    @Permission('editor')
    async updateUserById(req, body, context, resolveInfo): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.updateUserById', body.updateUserInput);
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }

    @Query('getCurrentUser')
    @Permission('user')
    async getCurrentUser(req, body, context): Promise<CommonResult> {
        if (context.user) {
            return { code: 200, message: 'userInfo from context', data: context.user };
        } else {
            return { code: 401, message: 'no userInfo in context', data: {} };
        }
        // return await this.userBroker.call('user.updateCurrentUser',{ userId: context.user.id });
    }

    @Query('getUserById')
    @Permission('anony')
    async getUserById(req, body, context): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.getUserById', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getUserByMobile')
    @Permission('editor')
    async getUserByMobile(req, body): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.getUserByMobile', body);
        return { code: 200, message: 'success', data };
    }

    @Query('getUser')
    @Permission('user')
    async getUser(req, body, context): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.getUser', body);
        return { code: 200, message: 'success', data };
    }

    @Query('searchUserAccount')
    @Permission('admin')
    async searchUserAccount(req, body, context): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.searchUserAccount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('countUserAccount')
    @Permission('admin')
    async countUserAccount(req, body, context): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.countUserAccount', body);
        return { code: 200, message: 'success', data };
    }

    @Query('searchUser')
    @Permission('admin')
    async searchUser(req, body, context): Promise<CommonResult> {
        const { total, data } = await this.userBroker.call('user.searchUser', body);
        return { code: 200, message: 'success', data: { total, data } };
    }

    @Query('countUser')
    @Permission('admin')
    async countUser(req, body, context): Promise<CommonResult> {
        const { data } = await this.userBroker.call('user.countUser', body);
        return { code: 200, message: 'success', data };
    }

    @Mutation('changeBalanceByAdmin')
    @Permission('admin')
    async changeBalanceByAdmin(req, body: { userId: string, changeValue: number, extraInfo: string }, context, resolveInfo) {
        const { data } = await this.userBroker.call('user.changeBalance', {
            id: body.userId,
            changeValue: body.changeValue,
            type: 'changeByAdmin',
            extraInfo: JSON.stringify({ operatorId: context.user.id, operatorExtraInfo: body.extraInfo }),
        });
        // tslint:disable-next-line:max-line-length
        this.logger.log(`${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}`);
        return { code: 200, message: 'success', data };
    }
}
