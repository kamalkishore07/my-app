import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { errorResponse, successResponse, validateRequiredFields, isValidObjectId, isValidDate } from '@/lib/api-utils';
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

        const todos = await Todo.find({ userId: user.userId, date }).sort({ createdAt: 1 });
        return successResponse(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        return errorResponse('Failed to fetch todos', 500);
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
        const { title, description, date, status, priority } = body;

        // Validate required fields
        const validationError = validateRequiredFields(body, ['title', 'date']);
        if (validationError) {
            return errorResponse(validationError, 400);
        }

        // Validate date format
        if (!isValidDate(date)) {
            return errorResponse('Invalid date format. Use YYYY-MM-DD', 400);
        }

        // Validate priority if provided
        if (priority && !['low', 'medium', 'high'].includes(priority)) {
            return errorResponse('Priority must be low, medium, or high', 400);
        }

        const todo = await Todo.create({
            userId: user.userId,
            title: title.trim(),
            description: description?.trim() || null,
            date,
            status: status || false,
            priority: priority || 'medium',
        });

        return successResponse(todo, 201);
    } catch (error) {
        console.error('Error creating todo:', error);
        return errorResponse('Failed to create todo', 500);
    }
}

export async function PATCH(request: NextRequest) {
    const user = isAuthenticated(request);
    if (!user) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        await connectDB();

        const body = await request.json();
        const { id, title, description, status, priority } = body;

        if (!id) {
            return errorResponse('Todo ID is required', 400);
        }

        if (!isValidObjectId(id)) {
            return errorResponse('Invalid todo ID format', 400);
        }

        // Build update object with only provided fields
        const updateData: any = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) {
            if (!['low', 'medium', 'high'].includes(priority)) {
                return errorResponse('Priority must be low, medium, or high', 400);
            }
            updateData.priority = priority;
        }

        if (Object.keys(updateData).length === 0) {
            return errorResponse('No fields to update', 400);
        }

        const todo = await Todo.findOneAndUpdate(
            { _id: id, userId: user.userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!todo) {
            return errorResponse('Todo not found', 404);
        }

        return successResponse(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        return errorResponse('Failed to update todo', 500);
    }
}

export async function DELETE(request: NextRequest) {
    const user = isAuthenticated(request);
    if (!user) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return errorResponse('Todo ID is required', 400);
        }

        if (!isValidObjectId(id)) {
            return errorResponse('Invalid todo ID format', 400);
        }

        const todo = await Todo.findOneAndDelete({ _id: id, userId: user.userId });

        if (!todo) {
            return errorResponse('Todo not found', 404);
        }

        return successResponse({ message: 'Todo deleted successfully', deletedTodo: todo });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return errorResponse('Failed to delete todo', 500);
    }
}

