# Guía de Contribución

Gracias por tu interés en contribuir al proyecto Kit Digital - Horizontes Libres. Esta guía te ayudará a entender cómo participar en el desarrollo.

## Código de Conducta

- Sé respetuoso con todos los colaboradores
- Acepta críticas constructivas
- Enfócate en lo que es mejor para el proyecto y la comunidad

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

1. **Descripción clara** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado** vs comportamiento actual
4. **Entorno**: Sistema operativo, versión de Node.js, etc.
5. **Screenshots** si aplica

### Sugerir Mejoras

Para sugerir nuevas funcionalidades:

1. Verifica que no exista ya un issue similar
2. Describe claramente la funcionalidad propuesta
3. Explica por qué sería útil para el proyecto
4. Si es posible, proporciona ejemplos de uso

### Pull Requests

1. **Fork** el repositorio
2. Crea una **rama** desde `main`:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios siguiendo las **guías de estilo**
4. Añade o actualiza **tests** según sea necesario
5. Asegúrate de que los tests pasen:
   ```bash
   npm test
   ```
6. Haz **commit** de tus cambios con mensajes descriptivos:
   ```bash
   git commit -m "feat: añadir nueva funcionalidad X"
   ```
7. **Push** a tu fork:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
8. Abre un **Pull Request** con:
   - Descripción clara de los cambios
   - Referencias a issues relacionados
   - Screenshots si hay cambios visuales

## Guías de Estilo

### JavaScript

- Usa **camelCase** para nombres de variables y funciones
- Usa **PascalCase** para nombres de clases
- Usa **UPPER_SNAKE_CASE** para constantes
- Indentación: 2 espacios
- Usa punto y coma al final de las declaraciones
- Documenta funciones con JSDoc

Ejemplo:

```javascript
/**
 * Calcula la suma de dos números
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @returns {number} La suma de a y b
 */
function sumar(a, b) {
  return a + b;
}
```

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar lógica)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplos:
```
feat: añadir validación de email en registro
fix: corregir error al guardar usuario
docs: actualizar README con instrucciones de despliegue
```

## Estructura de Tests

- Los tests deben estar en el directorio `tests/`
- Tests unitarios en `tests/unit/`
- Tests de integración en `tests/integration/`
- Nombra los archivos de test como `*.test.js`
- Usa nombres descriptivos para los tests

Ejemplo:

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    test('debe crear un usuario con datos válidos', async () => {
      // Test implementation
    });
    
    test('debe lanzar error si el email es inválido', async () => {
      // Test implementation
    });
  });
});
```

## Proceso de Revisión

1. Los PRs serán revisados por los mantenedores del proyecto
2. Se pueden solicitar cambios o mejoras
3. Una vez aprobado, el PR será merged
4. Los cambios se desplegarán según el ciclo de releases

## Configuración del Entorno de Desarrollo

1. Clona el repositorio:
   ```bash
   git clone https://github.com/danelerr/kit-digital.git
   cd kit-digital
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tus valores
   ```

4. Ejecuta tests:
   ```bash
   npm test
   ```

5. Inicia en modo desarrollo:
   ```bash
   npm run dev
   ```

## Recursos

- [Documentación del proyecto](docs/)
- [Guía de arquitectura](docs/architecture.md)
- [Requisitos](docs/requirements.md)

## Preguntas

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Contactar a los mantenedores del proyecto

---

¡Gracias por contribuir al Kit Digital - Horizontes Libres!
