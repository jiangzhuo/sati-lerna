import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
// import { __ as t } from 'i18n';
import * as jwt from 'jsonwebtoken';
import * as Sentry from '@sentry/node';

import { Permission, Resource } from '../../../common/interfaces';
// import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { Errors, ServiceBroker } from 'moleculer';
import { InjectBroker } from 'nestjs-moleculer';

@Injectable()
export class AuthService implements OnModuleInit {
    onModuleInit() {
        // this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @InjectBroker() private readonly userBroker: ServiceBroker,
        // @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) { }

    // private userServiceInterface;

    async validateUser(req: any) {
        /**
         * whitelist
         */
        const whiteList = ['IntrospectionQuery',
            'sayHello', 'test', 'adminTest', 'home',
            'loginBySMSCode', 'loginByMobileAndPassword',
            'sendRegisterVerificationCode', 'sendLoginVerificationCode',
            'registerBySMSCode'];
        if (req.body && whiteList.includes(req.body.operationName)) {
            return;
        }

        let token = req.headers.authorization as string;
        if (!token) {
            throw new AuthenticationError('Request header lacks authorization parameters，it should be: Authorization or authorization');
        }

        if (['Bearer ', 'bearer '].includes(token.slice(0, 7))) {
            token = token.slice(7);
        } else {
            throw new AuthenticationError('The authorization code prefix is incorrect. it should be: Bearer or bearer');
        }

        try {
            const decodedToken = <{ userId: string }>jwt.verify(token, 'secretKey');
            const { data } = await this.userBroker.call('user.getUserById', { id: decodedToken.userId },
                { meta: { operationName: req.body.operationName, udid: req.headers.udid } });
            return data;
        } catch (error) {
            Sentry.captureException(error);
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthenticationError('The authorization code is incorrect');
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthenticationError('The authorization code has expired');
            }
            if (error instanceof Errors.MoleculerError) {
                // moleculer base error
                throw error;
            }
            throw error;
        }
    }
}
