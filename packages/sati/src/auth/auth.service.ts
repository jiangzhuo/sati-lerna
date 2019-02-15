import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { __ as t } from 'i18n';
import * as jwt from 'jsonwebtoken';

import { User } from '../entities/user.entity';
import { JwtPayload, JwtReply } from '../interfaces/jwt.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService
    ) { }

    async createToken(payload: JwtPayload): Promise<JwtReply> {
        const accessToken = jwt.sign(payload, 'secretKey', { expiresIn: '1d' });
        return { accessToken, expiresIn: 60 * 60 * 24 };
    }

    async validateUser(req: any): Promise<User> {
        /**
         * whitelist
         */
        if (req.body && ['IntrospectionQuery', 'login', 'register'].includes(req.body.operationName)) {
            return;
        }

        let token = req.headers.authorization as string;
        if (!token) {
            throw new AuthenticationError(t('Request header lacks authorization parameters，it should be: Authorization or authorization'));
        }

        if (['Bearer ', 'bearer '].includes(token.slice(0, 7))) {
            token = token.slice(7);
        } else {
            throw new AuthenticationError(t('The authorization code prefix is incorrect. it should be: Bearer or bearer'));
        }

        try {
            const decodedToken = <{ userId: string }>jwt.verify(token, 'secretKey');
            return this.userService.findOneById(decodedToken.userId);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthenticationError(t('The authorization code is incorrect'));
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthenticationError(t('The authorization code has expired'));
            }
        }
    }
}
