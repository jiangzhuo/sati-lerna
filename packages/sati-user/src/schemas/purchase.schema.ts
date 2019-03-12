import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const PurchaseSchema = new Schema({
    productId: { type: String, default: '' },
    bundleId: { type: String, default: '' },
    type: { type: String, default: '' },
    price: { type: Number, default: 0 },
    createTime: { type: Number, default: 0 },
    updateTime: { type: Number, default: 0 }
}, { autoIndex: true, toJSON: { virtuals: true } });
