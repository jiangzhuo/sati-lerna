import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
// import { __ as t } from 'i18n';
import * as jwt from 'jsonwebtoken';
import * as Sentry from '@sentry/node';
import gql from 'graphql-tag';
// import { NotaddGrpcClientFactory } from '../../../grpc/grpc.client-factory';
import { Errors, ServiceBroker } from 'moleculer';
import { InjectBroker } from 'nestjs-moleculer';
import { IncomingMessage } from 'http';

@Injectable()
export class AuthService implements OnModuleInit {
    onModuleInit() {
        // this.userServiceInterface = this.notaddGrpcClientFactory.userModuleClient.getService('UserService');
    }

    constructor(
        @InjectBroker() private readonly userBroker: ServiceBroker,
        // @Inject(NotaddGrpcClientFactory) private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory
    ) {
    }

    // private userServiceInterface;

    async validateUser(req: any) {
        /**
         * whitelist
         */
        const whiteList = JSON.parse(process.env.WHITELIST_OPERATION_NAME);
        if (req.body.query) {
            const query = gql(req.body.query);
            if (query.definitions.length !== 0 && query.definitions.every((definition) => {
                return definition.name.value !== req.body.operationName;
            })) {
                req.body.operationName = query.definitions[0].name.value;
            }
            // if (req.body.operationName === 'IntrospectionQuery') {
            //     return;
            // }
            if (whiteList.includes(req.body.operationName)) {
                return;
            }
            // fix operationName
            if (req.body && req.body.operationName) {
                // if (whiteList.includes(req.body.operationName)) {
                //     return;
                // }
                const operationName = req.body.operationName;
                req.body.operationName = operationName.charAt(0).toLowerCase() + operationName.slice(1);
                // if (whiteList.includes(req.body.operationName)) {
                //     return;
                // }
            }
        }


        let token = req.headers.authorization as string;
        if (!token) {
            // throw new AuthenticationError('Request header lacks authorization parameters，it should be: Authorization or authorization');
            return;
        }

        if (token) {
            if (['Bearer ', 'bearer '].includes(token.slice(0, 7))) {
                token = token.slice(7);
            } else {
                throw new AuthenticationError('The authorization code prefix is incorrect. it should be: Bearer or bearer');
            }

            try {
                const decodedToken = <{ userId: string }>jwt.verify(token, process.env.AUTH_TOKEN_SECRET_KEY);
                const { data } = await this.userBroker.call('user.getUserById', { id: decodedToken.userId },
                    {
                        meta: {
                            userId: decodedToken.userId,
                            operationName: req.body.operationName,
                            udid: req.headers.udid,
                            clientIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                        },
                    });
                return data;
            } catch (error) {
                // Sentry.captureException(error);
                if (error instanceof jwt.JsonWebTokenError) {
                    throw new AuthenticationError('The authorization code is incorrect');
                    // return;
                }
                if (error instanceof jwt.TokenExpiredError) {
                    throw new AuthenticationError('The authorization code has expired');
                    // return;
                }
                if (error instanceof Errors.MoleculerError) {
                    // moleculer base error
                    throw error;
                }
                throw error;
            }
        }
    }
}
