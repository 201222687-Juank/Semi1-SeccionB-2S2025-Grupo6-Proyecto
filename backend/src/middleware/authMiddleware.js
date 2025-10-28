const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { jwksUri } = require('../config/aws');

// Cliente para verificar tokens JWT de Cognito
const client = jwksClient({
  jwksUri: jwksUri
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Token de acceso requerido',
      message: 'Incluye un token Bearer en el header Authorization'
    });
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Verificar el token JWT
  jwt.verify(token, getKey, {}, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ 
        error: 'Token inválido o expirado',
        message: 'El token no es válido o ha expirado'
      });
    }
    
    // Token válido, agregar usuario a la request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      username: decoded['cognito:username']
    };
    
    next();
  });
};

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

module.exports = { verifyToken };