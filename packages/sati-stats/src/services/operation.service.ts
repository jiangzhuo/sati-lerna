import { Inject, Injectable } from '@nestjs/common';
import { Connection, Model } from "mongoose";
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import * as moment from 'moment';
import { Errors } from 'moleculer';
import MoleculerError = Errors.MoleculerError;
import { Operation } from '../interfaces/operation.interface';
import { UserStats } from '../interfaces/userStats.interface';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';

@Injectable()
export class OperationService {
    constructor(
        @InjectModel('Operation') private readonly operationModel: Model<Operation>,
        @InjectModel('UserStats') private readonly userStatsModel: Model<UserStats>,
        @InjectConnection('sati') private readonly resourceClient: Connection,
    ) {
    }

    async countOperation(page: number, limit: number, namespace = 'NEST', module: string, operationName: string, fieldName: string) {
        let query = { namespace: namespace };
        if (!isEmpty(fieldName)) {
            query['fieldName'] = fieldName;
        }
        return await this.operationModel.countDocuments(query);
    }

    async getOperation(page: number, limit: number, namespace = 'NEST', module: string, operationName: string, fieldName: string): Promise<any[]> {
        let query = { namespace: namespace };
        if (!isEmpty(fieldName)) {
            query['fieldName'] = fieldName;
        }
        return await this.operationModel.find(query).sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit).exec();
    }
}
