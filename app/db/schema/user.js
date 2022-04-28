import mongoose from 'mongoose';

export const userSchema = mongoose.model('User', new mongoose.Schema({
    id: { type: String },
    username: { type: String },
    chatStats: {
        wordsTyped: { type: Number, default: 0 },
        charsTyped: { type: Number, default: 0 },
        imagesSent: { type: Number, default: 0 },
        linksSent: { type: Number, default: 0 }
    },
    registeredAt: { type: Number, default: Date.now() }
}));