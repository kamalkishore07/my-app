import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-utils';
import {
    verifyRefreshToken,
    generateAccessToken,
    getRefreshTokenFromRequest,
    getCookieOptions
} from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const refreshToken = getRefreshTokenFromRequest(request);

        if (!refreshToken) {
            return errorResponse('No refresh token provided', 401);
        }

        const payload = verifyRefreshToken(refreshToken);

        if (!payload) {
            return errorResponse('Invalid or expired refresh token', 401);
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({
            userId: payload.userId,
            username: payload.username
        });

        const response = successResponse({
            message: 'Token refreshed successfully'
        });

        // Set new access token
        response.cookies.set('auth-token', newAccessToken, getCookieOptions(15 * 60));

        return response;
    } catch (error) {
        console.error('Token refresh error:', error);
        return errorResponse('Failed to refresh token', 500);
    }
}
