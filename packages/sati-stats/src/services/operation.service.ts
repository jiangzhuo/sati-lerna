import { Inject, Injectable } from '@nestjs/common';
import { Connection, Model } from "mongoose";
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import * as moment from 'moment';
import { Errors } from 'moleculer';
import MoleculerError = Errors.MoleculerError;
import { Operation } from '../interfaces/operation.interface';
import { UserStats } from '../interfaces/userStats.interface';

@Injectable()
export class OperationService {
    constructor(
        @InjectModel('Operation') private readonly operationModel: Model<Operation>,
        @InjectModel('UserStats') private readonly userStatsModel: Model<UserStats>,
        @InjectConnection('sati') private readonly resourceClient: Connection,
    ) {
    }

    async userCount(): Promise<number> {
        return 1;
    }

    async loginCount(from: number, to: number): Promise<number> {
        return 1;
    }

    async registerCount(): Promise<number> {
        return 1;
    }

    async renewTokenCount(): Promise<number> {
        return 1;
    }
}
