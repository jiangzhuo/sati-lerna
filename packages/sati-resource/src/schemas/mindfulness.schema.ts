import { Schema, Types } from 'mongoose';
import * as Int32 from "mongoose-int32";
import * as nodejieba from 'nodejieba';

const ObjectId = Schema.Types.ObjectId;
export const MindfulnessSchema = new Schema({
    background: [String],
    name: String,
    description: { type: String, default: '' },
    scenes: [ObjectId],
    price: Number,
    createTime: Number,
    updateTime: Number,
    author: ObjectId,
    audio: String,
    copy: { type: String, default: '' },
    mindfulnessAlbums: { type: [ObjectId], default: [] },
    status: { type: Int32, default: 0 },
    validTime: Number,
    natureId: { type: ObjectId, default: new Types.ObjectId("000000000000000000000000") },
    __tag: { type: [String] },
}, { autoIndex: true, toJSON: { virtuals: true } });
