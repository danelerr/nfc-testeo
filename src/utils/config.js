/**
 * Configuración centralizada de la aplicación
 * 
 * Gestiona las variables de entorno y configuraciones del sistema
 */

// Cargar variables de entorno desde archivo .env si existe
try {
  require('dotenv').config();
} catch (error) {
  // dotenv es opcional en este momento
}

const config = {
  // Entorno
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Servidor
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  
  // Base de datos (para uso futuro)
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'kit_digital',
  DB_USER: process.env.DB_USER || 'usuario',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  
  // Seguridad
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-in-production',
  SESSION_SECRET: process.env.SESSION_SECRET || 'change-this-secret-too',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // APIs externas (para uso futuro)
  API_KEY: process.env.API_KEY || '',
};

/**
 * Valida que las variables críticas estén configuradas en producción
 */
function validateConfig() {
  if (config.NODE_ENV === 'production') {
    const criticalVars = ['JWT_SECRET', 'SESSION_SECRET'];
    const defaultValues = ['change-this-secret-in-production', 'change-this-secret-too'];
    
    criticalVars.forEach((varName, index) => {
      if (config[varName] === defaultValues[index]) {
        console.warn(`ADVERTENCIA: ${varName} está usando un valor por defecto en producción!`);
      }
    });
  }
}

validateConfig();

module.exports = config;
