import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken, hashPassword } from '@/lib/auth-utils';
import { errorResponse, successResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { password, isSetup, username } = body;

        if (!password || password.length < 4) {
            return errorResponse('Password must be at least 4 characters', 400);
        }

        // Setup mode: create first user
        if (isSetup) {
            if (!username || username.trim().length < 2) {
                return errorResponse('Username must be at least 2 characters', 400);
            }

            // Check if username already exists
            const existingUser = await User.findOne({ username: username.trim() });
            if (existingUser) {
                return errorResponse('Username already exists', 400);
            }

            const hashedPassword = await hashPassword(password);
            const user = await User.create({
                username: username.trim(),
                password: hashedPassword
            });

            const token = generateToken({
                userId: user._id!.toString(),
                username: user.username
            });

            const response = successResponse({
                message: 'Account created successfully',
                username: user.username
            });

            response.cookies.set('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });

            return response;
        }

        // Login mode: verify username and password
        if (!username || username.trim().length === 0) {
            return errorResponse('Username is required', 400);
        }

        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return errorResponse('Invalid username or password', 401);
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return errorResponse('Invalid username or password', 401);
        }

        const token = generateToken({
            userId: user._id!.toString(),
            username: user.username
        });

        const response = successResponse({
            message: 'Login successful',
            username: user.username
        });

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('Login failed', 500);
    }
}
