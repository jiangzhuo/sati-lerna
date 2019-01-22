import { Inject, Injectable } from '@nestjs/common';
import { Connection, Model } from "mongoose";
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import * as moment from 'moment';
import { Errors } from 'moleculer';
import MoleculerError = Errors.MoleculerError;
import { Operation } from '../interfaces/operation.interface';
import { UserStats } from '../interfaces/userStats.interface';
import { User } from '../interfaces/user.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserStatsService {
    constructor(
        @InjectModel('Operation') private readonly operationModel: Model<Operation>,
        @InjectModel('UserStats') private readonly userStatsModel: Model<UserStats>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectConnection('sati') private readonly resourceClient: Connection,
    ) {
    }

    async userCount(from: number, to: number): Promise<number> {
        let result = await this.userModel.count({
            _id: {
                $gte: ObjectId.createFromTime(from),
                $lte: ObjectId.createFromTime(to)
            }
        });
        return result
    }

    async loginCount(from: number, to: number): Promise<any[]> {
        let result = await this.userStatsModel.aggregate(
            [
                {
                    $match: {
                        "namespace": "NEST",
                        "module": "USER",
                        "operationName": { $in: ["loginByMobileAndPassword", "loginBySMSCode"] },
                        timestamp: { $gte: from * 1000, $lte: to * 1000 }
                    }
                },
                {
                    $group: {
                        _id: {
                            namespace: "$namespace",
                            module: "$module",
                            operationName: "$operationName",
                            fieldName: "$fieldName"
                        },
                        userIds: { $addToSet: '$userId' }
                    }
                },
                {
                    $unwind: { path: "$userIds" }
                },
                {
                    $group: { _id: "$_id", count: { $sum: 1 } }
                },
            ]
        );
        return result;
    }

    async registerCount(from: number, to: number): Promise<any[]> {
        let result = await this.userStatsModel.aggregate(
            [
                {
                    $match: {
                        "namespace": "NEST",
                        "module": "USER",
                        "operationName": { $in: ["registerBySMSCode"] },
                        timestamp: { $gte: from * 1000, $lte: to * 1000 }
                    }
                },
                {
                    $group: {
                        _id: {
                            namespace: "$namespace",
                            module: "$module",
                            operationName: "$operationName",
                            fieldName: "$fieldName"
                        },
                        mobiles: { $addToSet: '$mobile' }
                    }
                },
                {
                    $unwind: { path: "$mobiles" }
                },
                {
                    $group: { _id: "$_id", count: { $sum: 1 } }
                },
            ]
        );
        return result;
    }

    async verificationCodeCount(from: number, to: number): Promise<any[]> {
        let result = await this.userStatsModel.aggregate(
            [
                {
                    $match: {
                        "namespace": "NEST",
                        "module": "USER",
                        "operationName": { $in: ["sendLoginVerificationCode", "sendRegisterVerificationCode"] },
                        timestamp: { $gte: from * 1000, $lte: to * 1000 }
                    }
                },
                {
                    $group: {
                        _id: {
                            namespace: "$namespace",
                            module: "$module",
                            operationName: "$operationName",
                            fieldName: "$fieldName"
                        },
                        mobiles: { $addToSet: '$mobile' }
                    }
                },
                {
                    $unwind: { path: "$mobiles" }
                },
                {
                    $group: { _id: "$_id", count: { $sum: 1 } }
                },
            ]
        );
        return result;
    }

    async renewTokenCount(from: number, to: number): Promise<any[]> {
        let result = await this.userStatsModel.aggregate(
            [
                {
                    $match: {
                        "namespace": "NEST",
                        "module": "USER",
                        "operationName": { $in: ["renewToken"] },
                        timestamp: { $gte: from * 1000, $lte: to * 1000 }
                    }
                },
                {
                    $group: {
                        _id: {
                            namespace: "$namespace",
                            module: "$module",
                            operationName: "$operationName",
                            fieldName: "$fieldName"
                        },
                        userIds: { $addToSet: '$userId' }
                    }
                },
                {
                    $unwind: { path: "$userIds" }
                },
                {
                    $group: { _id: "$_id", count: { $sum: 1 } }
                },
            ]
        );
        return result;
    }
}
