/**
 * Tests para el logger
 */

const logger = require('../../src/utils/logger');

describe('Logger', () => {
  // Guardar console original
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
  };
  
  beforeEach(() => {
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    // Restaurar console original
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  });
  
  test('debe registrar mensajes info', () => {
    logger.info('Test message');
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toContain('INFO');
    expect(console.log.mock.calls[0][0]).toContain('Test message');
  });
  
  test('debe registrar mensajes de error', () => {
    logger.error('Error message');
    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toContain('ERROR');
    expect(console.error.mock.calls[0][0]).toContain('Error message');
  });
  
  test('debe registrar advertencias', () => {
    logger.warn('Warning message');
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toContain('WARN');
    expect(console.warn.mock.calls[0][0]).toContain('Warning message');
  });
  
  test('debe incluir timestamp en los logs', () => {
    logger.info('Test');
    const logOutput = console.log.mock.calls[0][0];
    // Verificar formato de timestamp ISO
    expect(logOutput).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
  });
  
  test('debe manejar múltiples argumentos', () => {
    const obj = { key: 'value' };
    logger.info('Message', 'arg1', obj);
    const logOutput = console.log.mock.calls[0][0];
    expect(logOutput).toContain('Message');
    expect(logOutput).toContain('arg1');
    expect(logOutput).toContain('{"key":"value"}');
  });
});
