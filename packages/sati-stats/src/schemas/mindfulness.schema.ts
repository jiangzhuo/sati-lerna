import * as mongoose from 'mongoose';
import * as Int32 from "mongoose-int32";

const ObjectId = mongoose.Schema.Types.ObjectId;
export const MindfulnessSchema = new mongoose.Schema({
    favorite: { type: Number, default: 0 },
    buy: { type: Number, default: 0 },
    start: { type: Number, default: 0 },
    finish: { type: Number, default: 0 }
});
