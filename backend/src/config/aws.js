// Importación de las clases específicas de los clientes del AWS SDK.
const { TranslateClient } = require('@aws-sdk/client-translate');
const { RekognitionClient } = require('@aws-sdk/client-rekognition');
const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

// Carga las variables de entorno desde un archivo .env en process.env.
// Esencial para la gestión segura de claves secretas.
require('dotenv').config();

// --- 1. Configuración de AWS ---
/**
 * Objeto de configuración común para todos los clientes de AWS.
 * Define la región y las credenciales de autenticación.
 */
const awsConfig = {
  // Define la región de AWS. Prioriza la variable de entorno o usa 'us-east-1' por defecto.
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    // Clave de acceso obtenida de forma segura desde las variables de entorno.
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // Clave secreta obtenida de forma segura desde las variables de entorno.
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

// --- 2. Inicialización de Clientes AWS ---
// Se inicializan los clientes utilizando la configuración unificada (awsConfig).

/**
 * Instancia del cliente de Amazon Translate.
 * Se utiliza para realizar operaciones de traducción de texto.
 */
const translateClient = new TranslateClient(awsConfig);

/**
 * Instancia del cliente de Amazon Rekognition.
 * Se utiliza para realizar operaciones de análisis de imágenes y vídeo.
 */
const rekognitionClient = new RekognitionClient(awsConfig);

/**
 * Instancia del cliente de Amazon Cognito Identity Provider.
 * Se utiliza para gestionar usuarios, autenticación y operaciones del user pool.
 */
const cognitoIdentityProvider = new CognitoIdentityProviderClient(awsConfig);

// --- 3. Configuración Específica de Cognito ---
/**
 * Configuración del User Pool de Cognito para autenticación.
 */
const cognitoConfig = {
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  region: process.env.AWS_REGION || 'us-east-1'
};

// --- 4. URLs para Verificación de Tokens ---
/**
 * URL del JWKS (JSON Web Key Set) para verificar tokens JWT de Cognito.
 */
const jwksUri = `https://cognito-idp.${cognitoConfig.region}.amazonaws.com/${cognitoConfig.userPoolId}/.well-known/jwks.json`;

// --- 5. Exportación ---
/**
 * Exporta las instancias de los clientes inicializados para que puedan ser 
 * reutilizadas en cualquier otro módulo de la aplicación sin necesidad de 
 * reconfigurar las credenciales.
 */
module.exports = {
  translateClient,
  rekognitionClient,
  cognitoIdentityProvider,
  cognitoConfig,
  jwksUri,
  awsConfig
};