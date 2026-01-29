/**
 * Tests para las utilidades de validación
 */

const validator = require('../../src/utils/validator');

describe('Validator Utils', () => {
  describe('isValidEmail', () => {
    test('debe validar emails correctos', () => {
      expect(validator.isValidEmail('test@example.com')).toBe(true);
      expect(validator.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });
    
    test('debe rechazar emails incorrectos', () => {
      expect(validator.isValidEmail('invalid')).toBe(false);
      expect(validator.isValidEmail('invalid@')).toBe(false);
      expect(validator.isValidEmail('@invalid.com')).toBe(false);
      expect(validator.isValidEmail('')).toBe(false);
      expect(validator.isValidEmail(null)).toBe(false);
    });
  });
  
  describe('isValidPassword', () => {
    test('debe validar contraseñas correctas', () => {
      const result = validator.isValidPassword('Password123');
      expect(result.valid).toBe(true);
    });
    
    test('debe rechazar contraseñas cortas', () => {
      const result = validator.isValidPassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('8 caracteres');
    });
    
    test('debe requerir mayúsculas', () => {
      const result = validator.isValidPassword('password123');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('mayúscula');
    });
    
    test('debe requerir números', () => {
      const result = validator.isValidPassword('Password');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('número');
    });
  });
  
  describe('sanitizeString', () => {
    test('debe sanitizar caracteres HTML', () => {
      expect(validator.sanitizeString('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });
    
    test('debe manejar strings vacíos', () => {
      expect(validator.sanitizeString('')).toBe('');
      expect(validator.sanitizeString(null)).toBe('');
    });
  });
  
  describe('isNotEmpty', () => {
    test('debe validar valores no vacíos', () => {
      expect(validator.isNotEmpty('test')).toBe(true);
      expect(validator.isNotEmpty('0')).toBe(true);
      expect(validator.isNotEmpty(123)).toBe(true);
    });
    
    test('debe rechazar valores vacíos', () => {
      expect(validator.isNotEmpty('')).toBe(false);
      expect(validator.isNotEmpty('   ')).toBe(false);
      expect(validator.isNotEmpty(null)).toBe(false);
      expect(validator.isNotEmpty(undefined)).toBe(false);
    });
  });
  
  describe('validateSchema', () => {
    test('debe validar datos correctos', () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
      };
      
      const schema = {
        email: { required: true, email: true },
        name: { required: true, minLength: 2 },
        age: { type: 'number' },
      };
      
      const result = validator.validateSchema(data, schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('debe detectar campos requeridos faltantes', () => {
      const data = { name: 'Test' };
      const schema = {
        email: { required: true },
        name: { required: true },
      };
      
      const result = validator.validateSchema(data, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('El campo email es requerido');
    });
    
    test('debe validar tipos de datos', () => {
      const data = { age: 'invalid' };
      const schema = { age: { type: 'number' } };
      
      const result = validator.validateSchema(data, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('tipo'))).toBe(true);
    });
  });
});
