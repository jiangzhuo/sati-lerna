import { Schema, Types } from 'mongoose';

export const OperationSchema = new Schema({
    timestamp: Number,
    server: String,
    namespace: String,
    module: String,
    userId: String,
    uuid: String,
    clientIp: String,
    operationName: String,
    fieldName: String,
    other: String,
}, { autoIndex: true, toJSON: { virtuals: true } });
