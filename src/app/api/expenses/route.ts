import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
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

        const expenses = await Expense.find({ userId: user.userId, date }).sort({ createdAt: 1 });
        return successResponse(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return errorResponse('Failed to fetch expenses', 500);
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
        const { amount, category, date, note } = body;

        // Validate required fields
        const validationError = validateRequiredFields(body, ['amount', 'category', 'date']);
        if (validationError) {
            return errorResponse(validationError, 400);
        }

        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return errorResponse('Amount must be a positive number', 400);
        }

        // Validate date format
        if (!isValidDate(date)) {
            return errorResponse('Invalid date format. Use YYYY-MM-DD', 400);
        }

        const expense = await Expense.create({
            userId: user.userId,
            amount,
            category: category.trim(),
            date,
            note: note?.trim() || null,
        });

        return successResponse(expense, 201);
    } catch (error) {
        console.error('Error creating expense:', error);
        return errorResponse('Failed to create expense', 500);
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
            return errorResponse('Expense ID is required', 400);
        }

        if (!isValidObjectId(id)) {
            return errorResponse('Invalid expense ID format', 400);
        }

        const expense = await Expense.findOneAndDelete({ _id: id, userId: user.userId });

        if (!expense) {
            return errorResponse('Expense not found', 404);
        }

        return successResponse({ message: 'Expense deleted successfully', deletedExpense: expense });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return errorResponse('Failed to delete expense', 500);
    }
}
