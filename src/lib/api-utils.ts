import { NextResponse } from 'next/server';

/**
 * Standard API error response
 */
export function errorResponse(message: string, status: number = 500) {
    return NextResponse.json(
        {
            success: false,
            error: message
        },
        { status }
    );
}

/**
 * Standard API success response
 */
export function successResponse(data: any, status: number = 200) {
    return NextResponse.json(
        {
            success: true,
            data
        },
        { status }
    );
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
    body: Record<string, any>,
    requiredFields: string[]
): string | null {
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
        return `Missing required fields: ${missingFields.join(', ')}`;
    }

    return null;
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: any): boolean {
    return typeof value === 'number' && value > 0;
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
}
