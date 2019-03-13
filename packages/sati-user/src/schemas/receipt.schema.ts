import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const ReceiptSchema = new Schema({
    type: { type: String, default: '' },
    userId: ObjectId,
    receipt: { type: String, default: '' },
    isProcessed: { type: Boolean, default: false },
    validateData: { type: String, default: '' },
    purchaseData: { type: String, default: '' },
    createTime: { type: Number, default: 0 },
    updateTime: { type: Number, default: 0 }
}, { autoIndex: true, toJSON: { virtuals: true } });
