import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const AccountSchema = new Schema({
    userId: ObjectId,
    value: Number,
    afterBalance: Number,
    type: String,
    createTime: Number,
    extraInfo: { type: String, default: '' },
}, { autoIndex: true, toJSON: { virtuals: true } });
