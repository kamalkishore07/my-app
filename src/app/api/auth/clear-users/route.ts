import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { errorResponse, successResponse } from '@/lib/api-utils';

// DELETE endpoint to clear all users (for development/testing only)
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        // Delete all users
        const result = await User.deleteMany({});

        return successResponse({
            message: 'All users deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Delete users error:', error);
        return errorResponse('Failed to delete users', 500);
    }
}
