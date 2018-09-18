import { HttpException, Inject } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { __ as t } from 'i18n';

// import { Permission, Resource } from '../../../common/decorators';
import { CommonResult } from '../../../common/interfaces';
import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';

@Resolver()
// @Resource({ name: 'user_manage', identify: 'user:manage' })
export class UserResolver {
    onModuleInit() {
        this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) { }

    private userServiceInterface;

    @Query('loginBySMSCode')
    async loginBySMSCode(req, body: { mobile: string, verificationCode: string }): Promise<CommonResult> {
        const { code, message, data } = await this.userServiceInterface.loginBySMSCode(body).toPromise();
        return { code, message, data: data.tokenInfo };
    }

    @Query('loginByMobileAndPassword')
    async loginByMobileAndPassword(req, body: { mobile: string, password: string }): Promise<CommonResult> {
        const { code, message, data } = await this.userServiceInterface.loginByMobileAndPassword(body).toPromise();
        return { code, message, data: data.tokenInfo };
    }

    // @Query('adminLogin')
    // async adminLogin(req, body: { username: string, password: string }): Promise<CommonResult> {
    //     const { code, message, data } = await this.userServiceInterface.login(body).toPromise();
    //     const userInfoData = data.userInfoData;
    //     if (userInfoData.username !== 'sadmin' && userInfoData.userRoles.map(v => v.id).includes(1)) {
    //         throw new HttpException(t('You are not authorized to access'), 401);
    //     }
    //     return { code, message, data: data.tokenInfo };
    // }

    @Mutation('registerBySMSCode')
    async registerBySMSCode(req, { registerUserInput, verificationCode }): Promise<CommonResult> {
        return await this.userServiceInterface.registerBySMSCode({ registerUserInput, verificationCode }).toPromise();
    }

    @Query('sendLoginVerificationCode')
    async sendLoginVerificationCode(req, body): Promise<CommonResult> {
        return await this.userServiceInterface.getLoginVerificationCode(body).toPromise();
    }

    @Query('sendRegisterVerificationCode')
    async sendRegisterVerificationCode(req, body): Promise<CommonResult> {
        return await this.userServiceInterface.getRegisterVerificationCode(body).toPromise();
    }

    // @Mutation('createUser')
    // @Permission({ name: 'create_user', identify: 'user:createUser', action: 'create' })
    // async createUser(req, body): Promise<CommonResult> {
    //     return this.userServiceInterface.createUser(body).toPromise();
    // }

    // @Mutation('updateUserInfoById')
    // async updateUserInfoById(req, body): Promise<CommonResult> {
    //     return this.userServiceInterface.updateUserInfoById(body).toPromise();
    // }

    @Mutation('updateCurrentUserInfo')
    async updateCurrentUserInfo(req, body, context): Promise<CommonResult> {
        body.userId = context.user.id;
        return await this.userServiceInterface.updateCurrentUserInfo(body).toPromise();
    }

    // @Query('findUserInfoByIds')
    // @Permission({ name: 'find_user_info_by_ids', identify: 'user:findUserInfoByIds', action: 'find' })
    // async findUserInfoByIds(req, body: { userIds: number[] }): Promise<CommonResult> {
    //     return await this.userServiceInterface.findUserInfoByIds(body).toPromise();
    // }

    @Query('findCurrentUserInfo')
    async findCurrentUserInfo(req, body, context): Promise<CommonResult> {
        if (context.user) {
            return { code: 200, message: 'userInfo from context', data: context.user };
        } else {
            return { code: 401, message: 'no userInfo in context', data: {} };
        }
        // return await this.userServiceInterface.findCurrentUserInfo({ userId: context.user.id }).toPromise();
    }
}
