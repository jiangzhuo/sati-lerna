import * as mongoose from 'mongoose';

export const UserStatsSchema = new mongoose.Schema({
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
