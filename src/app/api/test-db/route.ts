import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
    try {
        // Attempt to connect to MongoDB
        await connectDB();

        // Get connection state
        const state = mongoose.connection.readyState;
        const stateMap: { [key: number]: string } = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        // Get database name
        const dbName = mongoose.connection.db?.databaseName || 'unknown';

        return NextResponse.json({
            success: true,
            message: 'MongoDB connection successful!',
            details: {
                status: stateMap[state] || 'unknown',
                database: dbName,
                host: mongoose.connection.host || 'unknown',
                collections: await mongoose.connection.db?.listCollections().toArray() || []
            }
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json({
            success: false,
            message: 'MongoDB connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
