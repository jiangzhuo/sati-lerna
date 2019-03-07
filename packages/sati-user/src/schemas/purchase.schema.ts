import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const PurchaseSchema = new Schema({
    type: { type: String, default: '' },
    userId: ObjectId,
    receipt: { type: String, default: '' },
    validateData: { type: String, default: '' },
    purchaseData: { type: String, default: '' }
}, { autoIndex: true, toJSON: { virtuals: true } });
