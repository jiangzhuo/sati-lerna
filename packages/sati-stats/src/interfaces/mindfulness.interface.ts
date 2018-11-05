import { Document } from 'mongoose';

export interface Mindfulness extends Document {
    readonly favorite: number;
    readonly buy: number;
    readonly start: number;
    readonly finish: number;
}
