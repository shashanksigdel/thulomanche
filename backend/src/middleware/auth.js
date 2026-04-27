import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('No token provided in request headers');
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Verifying token with secret:', jwtSecret.substring(0, 10) + '...');
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    console.log('Checking authorization, user role:', req.user.role, 'required roles:', roles);
    if (!roles.includes(req.user.role)) {
      console.log('User not authorized, role not in allowed list');
      return res.status(403).json({ message: 'User role is not authorized to access this route' });
    }
    console.log('User authorized');
    next();
  };
};
