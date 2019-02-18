import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const DiscountSchema = new Schema({
    type: String,
    resourceId: ObjectId,
    background: [String],
    name: { type: String, default: '' },
    discount: { type: Number, default: '' },
    createTime: Number,
    updateTime: Number,
    beginTime: Number,
    endTime: Number,
}, { autoIndex: true, toJSON: { virtuals: true } });
