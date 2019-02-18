import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const UserSchema = new Schema({
    mobile: String,
    username: String,
    password: String,
    nickname: String,
    avatar: String,
    status: Number,
    createTime: Number,
    updateTime: Number,
    balance: { type: Number, default: 0 },
    // pendingTransactions: { type: [ObjectId], default: [] }
}, { autoIndex: true, toJSON: { virtuals: true } });
