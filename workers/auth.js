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
        
        // Log the full decoded structure for debugging
        console.log('verifyToken - Full decoded object:', JSON.stringify(decoded));
        console.log('verifyToken - decoded.role:', decoded?.role);
        console.log('verifyToken - decoded.payload?.role:', decoded?.payload?.role);
        console.log('verifyToken - Object keys:', Object.keys(decoded || {}));
        
        // Handle different possible structures
        // Some JWT libraries return { payload: {...}, header: {...} }
        // Others return the payload directly
        if (decoded && typeof decoded === 'object') {
            // If decoded has a payload property, use that
            if (decoded.payload) {
                console.log('verifyToken - Using decoded.payload');
                return decoded.payload;
            }
            // Otherwise, use decoded directly
            console.log('verifyToken - Using decoded directly');
            return decoded;
        }
        
        return decoded;
    } catch (error) {
        console.log('verifyToken - Error:', error);
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
    
    // Log for debugging - log role separately to see full value
    console.log('requireAuth - Decoded token payload:', JSON.stringify(decoded));
    console.log('requireAuth - Role value:', decoded.role);
    console.log('requireAuth - Role type:', typeof decoded.role);
    console.log('requireAuth - Role === "admin":', decoded.role === 'admin');
    
    return { user: decoded };
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request, env) {
    const authResult = await requireAuth(request, env);
    if (authResult.error) {
        console.log('requireAdmin - Auth failed:', authResult.error);
        return authResult;
    }
    
    // Check role - handle different possible formats
    const role = authResult.user?.role;
    const roleString = String(role || '').trim();
    
    console.log('requireAdmin - Raw role:', role);
    console.log('requireAdmin - Role type:', typeof role);
    console.log('requireAdmin - Role string:', roleString);
    console.log('requireAdmin - Role === "admin":', roleString === 'admin');
    console.log('requireAdmin - Full user object:', JSON.stringify(authResult.user));
    
    if (roleString !== 'admin') {
        console.log('requireAdmin - Admin check FAILED. Role:', roleString, 'Expected: admin');
        return { error: 'Forbidden', status: 403 };
    }
    
    console.log('requireAdmin - Admin check PASSED');
    return authResult;
}
