import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import { errorResponse, successResponse, validateRequiredFields, isValidDate } from '@/lib/api-utils';
import { isAuthenticated } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
    const user = isAuthenticated(request);
    if (!user) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get('date');

        if (!date) {
            return errorResponse('Date parameter is required', 400);
        }

        if (!isValidDate(date)) {
            return errorResponse('Invalid date format. Use YYYY-MM-DD', 400);
        }

        const note = await Note.findOne({ userId: user.userId, date });
        return successResponse(note || { date, content: '' });
    } catch (error) {
        console.error('Error fetching note:', error);
        return errorResponse('Failed to fetch note', 500);
    }
}

export async function POST(request: NextRequest) {
    const user = isAuthenticated(request);
    if (!user) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        await connectDB();

        const body = await request.json();
        const { date, content } = body;

        // Validate required fields
        const validationError = validateRequiredFields(body, ['date', 'content']);
        if (validationError) {
            return errorResponse(validationError, 400);
        }

        // Validate date format
        if (!isValidDate(date)) {
            return errorResponse('Invalid date format. Use YYYY-MM-DD', 400);
        }

        // Upsert: update if exists, create if not
        const note = await Note.findOneAndUpdate(
            { userId: user.userId, date },
            { content: content.trim(), updatedAt: new Date() },
            { new: true, upsert: true, runValidators: true }
        );

        return successResponse(note, 201);
    } catch (error) {
        console.error('Error saving note:', error);
        return errorResponse('Failed to save note', 500);
    }
}
