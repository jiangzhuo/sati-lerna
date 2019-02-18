import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const deviceSchema = new Schema({
    userId: ObjectId,
    udid: String,
    clientIp: String,
    operationName: String,
    createTime: Number,
}, { autoIndex: true, toJSON: { virtuals: true } });
