/**
 * Kit Digital - Horizontes Libres
 * Punto de entrada principal de la aplicación
 * 
 * @author Horizontes Libres
 * @version 1.0.0
 */

// Importar configuración
const config = require('./utils/config');
const logger = require('./utils/logger');

/**
 * Inicializa la aplicación
 */
async function init() {
  try {
    logger.info('Iniciando aplicación Kit Digital - Horizontes Libres');
    logger.info(`Entorno: ${config.NODE_ENV}`);
    logger.info(`Puerto: ${config.PORT}`);
    
    // Aquí se inicializarán los servicios, servidor, etc.
    // TODO: Configurar servidor Express o similar
    // TODO: Conectar a base de datos si es necesario
    // TODO: Configurar rutas y middleware
    
    logger.info('Aplicación iniciada correctamente');
    logger.info('Kit Digital - Horizontes Libres está funcionando');
    
  } catch (error) {
    logger.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido, cerrando aplicación...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recibido, cerrando aplicación...');
  process.exit(0);
});

// Iniciar aplicación
init();

module.exports = { init };
