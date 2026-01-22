import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-it';

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            console.log('[Auth] No token provided');
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.error('[Auth] Token verification failed:', err.message);
                return res.status(403).json({ error: 'Invalid or expired token', details: err.message });
            }
            req.user = user;
            next();
        });
    } catch (err) {
        console.error('[Auth] Unexpected error in authenticateToken:', err);
        return res.status(500).json({ error: 'Authentication error', message: err.message });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Access denied. Admin role required." });
    }
};

export { authenticateToken, isAdmin, JWT_SECRET };
