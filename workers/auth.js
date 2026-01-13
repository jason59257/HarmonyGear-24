// Authentication utilities for Cloudflare Workers
import jwt from '@tsndr/cloudflare-worker-jwt';

/**
 * Generate JWT token for user
 */
export async function generateToken(userId, email, role, env) {
    const secret = env.JWT_SECRET;
    const payload = {
        userId,
        email,
        role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    
    return await jwt.sign(payload, secret);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token, env) {
    try {
        const secret = env.JWT_SECRET;
        const decoded = await jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Hash password using Web Crypto API
 */
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compare password with hash
 */
export async function comparePassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromRequest(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Middleware to verify authentication
 */
export async function requireAuth(request, env) {
    const token = getTokenFromRequest(request);
    if (!token) {
        return { error: 'Unauthorized', status: 401 };
    }
    
    const decoded = await verifyToken(token, env);
    if (!decoded) {
        return { error: 'Invalid token', status: 401 };
    }
    
    return { user: decoded };
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request, env) {
    const authResult = await requireAuth(request, env);
    if (authResult.error) {
        return authResult;
    }
    
    if (authResult.user.role !== 'admin') {
        return { error: 'Forbidden', status: 403 };
    }
    
    return authResult;
}
