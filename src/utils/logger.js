/**
 * Sistema de logging centralizado
 * 
 * Proporciona funcionalidades de logging con diferentes niveles
 * de severidad para toda la aplicación
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel = process.env.LOG_LEVEL 
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO
  : LOG_LEVELS.INFO;

/**
 * Formatea el mensaje de log con timestamp y nivel
 */
function formatMessage(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.length > 0 ? ' ' + args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg
  ).join(' ') : '';
  
  return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
}

/**
 * Registra un mensaje con el nivel especificado
 */
function log(level, levelValue, message, ...args) {
  if (levelValue <= currentLogLevel) {
    const formattedMessage = formatMessage(level, message, ...args);
    
    if (level === 'ERROR') {
      console.error(formattedMessage);
    } else if (level === 'WARN') {
      console.warn(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }
}

const logger = {
  /**
   * Registra un mensaje de error
   */
  error: (message, ...args) => {
    log('ERROR', LOG_LEVELS.ERROR, message, ...args);
  },
  
  /**
   * Registra una advertencia
   */
  warn: (message, ...args) => {
    log('WARN', LOG_LEVELS.WARN, message, ...args);
  },
  
  /**
   * Registra un mensaje informativo
   */
  info: (message, ...args) => {
    log('INFO', LOG_LEVELS.INFO, message, ...args);
  },
  
  /**
   * Registra un mensaje de debug
   */
  debug: (message, ...args) => {
    log('DEBUG', LOG_LEVELS.DEBUG, message, ...args);
  },
};

module.exports = logger;
