import* as  mongoose from 'mongoose';

export const NatureSchema = new mongoose.Schema({
    stats: {
        favorite: { type: Number, default: 0 },
        buy: { type: Number, default: 0 },
        start: { type: Number, default: 0 },
        finish: { type: Number, default: 0 }
    }
});
