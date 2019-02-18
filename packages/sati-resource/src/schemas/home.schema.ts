import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const HomeSchema = new Schema({
    position: Number,
    type: String,
    resourceId: ObjectId,
    background: [String],
    name: String,
    description: { type: String, default: '' },
    author: ObjectId,
    createTime: Number,
    updateTime: Number,
    validTime: Number,
}, { autoIndex: true, toJSON: { virtuals: true } });
