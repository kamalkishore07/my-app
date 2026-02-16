import mongoose, { Schema, Model } from 'mongoose';

export interface INote {
    _id?: string;
    userId: string;
    date: string;
    content: string;
    updatedAt?: Date;
}

const NoteSchema = new Schema<INote>({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    date: {
        type: String,
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound unique index: one note per day per user
NoteSchema.index({ userId: 1, date: 1 }, { unique: true });

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;
