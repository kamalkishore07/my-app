import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const REFRESH_SECRET = process.env.JWT_SECRET + '-refresh' || 'your-refresh-secret-key';

export interface JWTPayload {
    userId: string;
    username: string;
    type?: 'access' | 'refresh';
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'type'>): string {
    return jwt.sign(
        { ...payload, type: 'access' },
        JWT_SECRET,
        { expiresIn: '15m' } // 15 minutes
    );
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'type'>): string {
    return jwt.sign(
        { ...payload, type: 'refresh' },
        REFRESH_SECRET,
        { expiresIn: '7d' } // 7 days
    );
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        if (decoded.type !== 'access') return null;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET) as JWTPayload;
        if (decoded.type !== 'refresh') return null;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Get user from request (extract from cookie)
 */
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    return verifyAccessToken(token);
}

/**
 * Get refresh token from request
 */
export function getRefreshTokenFromRequest(request: NextRequest): string | null {
    return request.cookies.get('refresh-token')?.value || null;
}

/**
 * Check if request is authenticated and return user
 */
export function isAuthenticated(request: NextRequest): JWTPayload | null {
    return getUserFromRequest(request);
}

/**
 * Get cookie options based on environment
 */
export function getCookieOptions(maxAge: number) {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
        path: '/',
        maxAge
    };
}
