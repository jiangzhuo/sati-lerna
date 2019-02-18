import { Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
export const SceneSchema = new Schema({
    name: { type: String, unique: true },
}, { autoIndex: true, toJSON: { virtuals: true } });
