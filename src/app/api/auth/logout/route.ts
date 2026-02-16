import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/api-utils';

export async function POST() {
    const response = successResponse({ message: 'Logged out successfully' });

    // Clear both tokens
    response.cookies.delete('auth-token');
    response.cookies.delete('refresh-token');

    return response;
}
