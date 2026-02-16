import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth-utils';
import { errorResponse, successResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Check if user exists in database
        const userCount = await User.countDocuments();
        const needsSetup = userCount === 0;

        // Check if request is authenticated
        const user = getUserFromRequest(request);

        return successResponse({
            isAuthenticated: user !== null,
            needsSetup,
            username: user?.username || null
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return errorResponse('Authentication check failed', 500);
    }
}
