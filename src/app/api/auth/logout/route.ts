import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/api-utils';

export async function POST() {
    const response = successResponse({ message: 'Logged out successfully' });

    response.cookies.delete('auth-token');

    return response;
}
