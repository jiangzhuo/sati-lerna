import { Schema, Types } from 'mongoose';
import * as Int32 from "mongoose-int32";

const ObjectId = Schema.Types.ObjectId;
export const NatureSchema = new Schema({
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
    natureAlbums: { type: [ObjectId], default: [] },
    status: { type: Int32, default: 0 },
    validTime: Number,
    __tag: { type: [String] },
}, { autoIndex: true, toJSON: { virtuals: true } });
