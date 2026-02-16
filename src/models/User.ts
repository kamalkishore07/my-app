import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    _id?: string;
    username: string;
    password: string; // hashed password
    createdAt?: Date;
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
