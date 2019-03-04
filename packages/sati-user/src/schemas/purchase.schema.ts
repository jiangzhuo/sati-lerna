import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const PurchaseSchema = new Schema({
    type: { type: String, default: '' },
    receipt: { type: String, default: '' },
    validateData: Schema.Types.Mixed,
    purchaseData: Schema.Types.Mixed
}, { autoIndex: true, toJSON: { virtuals: true } });
