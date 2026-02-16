import mongoose, { Schema, Model } from 'mongoose';

export interface ITodo {
    _id?: string;
    userId: string;
    title: string;
    description?: string;
    date: string;
    status: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt?: Date;
}

const TodoSchema = new Schema<ITodo>({
    userId: {
        type: String,
        required: true,
        index: true, // Index for efficient user queries
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    date: {
        type: String,
        required: true,
        index: true, // Index for efficient date queries
    },
    status: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;
