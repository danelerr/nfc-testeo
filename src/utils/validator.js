/**
 * Utilidades de validación de datos
 * 
 * Proporciona funciones para validar y sanitizar datos de entrada
 */

/**
 * Valida que un email tenga formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que una contraseña cumpla con requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {object} Objeto con resultado de validación y mensaje
 */
function isValidPassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'La contraseña es requerida' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una mayúscula' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una minúscula' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un número' };
  }
  
  return { valid: true, message: 'Contraseña válida' };
}

/**
 * Sanitiza un string eliminando caracteres potencialmente peligrosos
 * @param {string} input - String a sanitizar
 * @returns {string} String sanitizado
 */
function sanitizeString(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Elimina caracteres HTML peligrosos
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida que un string no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
function isNotEmpty(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

/**
 * Valida un objeto contra un esquema de validación
 * @param {object} data - Datos a validar
 * @param {object} schema - Esquema de validación
 * @returns {object} Resultado de validación con errores si los hay
 */
function validateSchema(data, schema) {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Required check
    if (rules.required && !isNotEmpty(value)) {
      errors.push(`El campo ${field} es requerido`);
      continue;
    }
    
    // Type check
    if (value !== undefined && rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors.push(`El campo ${field} debe ser de tipo ${rules.type}`);
      }
    }
    
    // Email validation
    if (rules.email && !isValidEmail(value)) {
      errors.push(`El campo ${field} debe ser un email válido`);
    }
    
    // Min length
    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`El campo ${field} debe tener al menos ${rules.minLength} caracteres`);
    }
    
    // Max length
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors.push(`El campo ${field} no puede tener más de ${rules.maxLength} caracteres`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeString,
  isNotEmpty,
  validateSchema,
};
