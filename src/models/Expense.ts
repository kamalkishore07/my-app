import mongoose, { Schema, Model } from 'mongoose';

export interface IExpense {
    _id?: string;
    userId: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
    createdAt?: Date;
}

const ExpenseSchema = new Schema<IExpense>({
    userId: {
        type: String,
        required: true,
        index: true, // Index for efficient user queries
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
        index: true, // Index for efficient date queries
    },
    note: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
