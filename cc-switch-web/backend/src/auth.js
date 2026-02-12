import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function authMiddleware(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || adminPassword === '') {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const [type, credentials] = authHeader.split(' ');
  
  if (type !== 'Basic') {
    return res.status(401).json({ error: 'Invalid authentication type' });
  }
  
  try {
    const decoded = Buffer.from(credentials, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');
    
    if (password === adminPassword) {
      return next();
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authentication format' });
  }
}
