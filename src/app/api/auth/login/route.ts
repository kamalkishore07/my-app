import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { errorResponse, successResponse, validateRequiredFields } from '@/lib/api-utils';
import {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    getCookieOptions
} from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { password, isSetup, username } = body;

        // Validate password
        if (!password || password.length < 4) {
            return errorResponse('Password must be at least 4 characters', 400);
        }

        // Validate username
        if (!username || username.trim().length < 2) {
            return errorResponse('Username must be at least 2 characters', 400);
        }

        // Setup mode: create first user
        if (isSetup) {
            // Check if username already exists
            const existingUser = await User.findOne({ username: username.trim() });
            if (existingUser) {
                return errorResponse('Username already exists. Please choose a different username.', 400);
            }

            const hashedPassword = await hashPassword(password);
            const user = await User.create({
                username: username.trim(),
                password: hashedPassword
            });

            const accessToken = generateAccessToken({
                userId: user._id!.toString(),
                username: user.username
            });

            const refreshToken = generateRefreshToken({
                userId: user._id!.toString(),
                username: user.username
            });

            const response = successResponse({
                message: 'Account created successfully',
                username: user.username
            });

            // Set access token (15 minutes)
            response.cookies.set('auth-token', accessToken, getCookieOptions(15 * 60));

            // Set refresh token (7 days)
            response.cookies.set('refresh-token', refreshToken, getCookieOptions(7 * 24 * 60 * 60));

            return response;
        }

        // Login mode: verify username and password
        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return errorResponse('Invalid username or password', 401);
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return errorResponse('Invalid username or password', 401);
        }

        const accessToken = generateAccessToken({
            userId: user._id!.toString(),
            username: user.username
        });

        const refreshToken = generateRefreshToken({
            userId: user._id!.toString(),
            username: user.username
        });

        const response = successResponse({
            message: 'Login successful',
            username: user.username
        });

        // Set access token (15 minutes)
        response.cookies.set('auth-token', accessToken, getCookieOptions(15 * 60));

        // Set refresh token (7 days)
        response.cookies.set('refresh-token', refreshToken, getCookieOptions(7 * 24 * 60 * 60));

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('Login failed. Please try again.', 500);
    }
}
