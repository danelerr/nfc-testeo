# 🧪 Guía de Pruebas - POC NFC

## Escenarios de Prueba

### ✅ Prueba 1: Verificación de Soporte NFC

**Objetivo:** Confirmar que el dispositivo soporta NFC y HCE

**Pasos:**
1. Abre la app en un dispositivo Android físico
2. Observa si aparece la pantalla de tarjetas
3. Ve a Ajustes del teléfono > Conexiones > NFC
4. Verifica que NFC esté habilitado

**Resultado Esperado:**
- App carga sin errores
- NFC está habilitado en el dispositivo
- No aparecen alertas de "NFC no soportado"

**Verificación Técnica:**
```bash
adb shell dumpsys nfc
# Debe mostrar: "mState=STATE_ON"
```

---

### ✅ Prueba 2: Carga de Tarjetas desde Backend

**Objetivo:** Verificar comunicación con el API mock

**Pasos:**
1. Asegúrate de que el backend esté corriendo (`npm start` en `backend/`)
2. Abre la app
3. Observa la pantalla de tarjetas

**Resultado Esperado:**
- Se muestran 2 tarjetas:
  - Débito •••• 0366 - $15,000.00
  - Crédito •••• 9903 - $8,500.50

**Si falla:**
```bash
# Verifica el backend
curl http://localhost:3000/card-token

# Para dispositivo físico, usa ngrok
ngrok http 3000
# Actualiza API_BASE_URL en src/services/APIService.ts
```

---

### ✅ Prueba 3: Preparación de Pago (Armar NFC)

**Objetivo:** Verificar que el token se configura correctamente en el servicio HCE

**Pasos:**
1. Selecciona una tarjeta
2. En la pantalla de pago, presiona "🚀 Preparar Pago"
3. Espera la confirmación "✅ Listo para Pagar"
4. Observa la animación de pulso

**Resultado Esperado:**
- Aparece alert "Listo para Pagar"
- Se ve el ícono 📡 con animación pulsante
- Texto: "Acerca tu teléfono al lector NFC"

**Verificación en Logs:**
```bash
adb logcat | grep NFCHostApduService
# Debe mostrar: "Token configurado: 1234567890123456"
```

---

### ✅ Prueba 4: Lectura NFC con Otro Teléfono

**Objetivo:** Confirmar que el token se transmite por NFC

**Requisitos:**
- Teléfono principal: GanaMóvil POC
- Teléfono secundario: Con "NFC Tools" o "CardReader" instalado

**Pasos:**
1. En teléfono principal: Prepara el pago (Prueba 3)
2. En teléfono secundario: Abre la app de lectura NFC
3. Acerca ambos teléfonos (dorso con dorso, área de la batería)
4. Mantén la posición por 2-3 segundos

**Resultado Esperado:**
- Teléfono lector vibra/emite sonido
- Se muestra el token: `1234567890123456` (o `6543210987654321`)
- Código de estado: `9000` (Success)

**Ejemplo de lectura exitosa:**
```
AID Found: F0010203040506
Data: 31323334353637383930313233343536
Status: 9000 (OK)

Decoded: 1234567890123456
```

---

### ✅ Prueba 5: Cancelación de Pago

**Objetivo:** Verificar limpieza correcta del token

**Pasos:**
1. Prepara un pago
2. Presiona "❌ Cancelar"
3. Verifica que vuelves a la pantalla de tarjetas

**Resultado Esperado:**
- Navegación a pantalla de tarjetas
- Token limpiado en el servicio HCE

**Verificación en Logs:**
```bash
adb logcat | grep NFCHostApduService
# Debe mostrar: "Token limpiado"
```

---

### ✅ Prueba 6: Flujo Completo (Simulado)

**Objetivo:** Probar el flujo end-to-end

**Pasos:**
1. Selecciona tarjeta de Débito (•••• 0366, $15,000)
2. Prepara el pago
3. (Simula lectura NFC exitosa)
4. La app automáticamente muestra pantalla de éxito
5. Observa los detalles del pago
6. Presiona "✨ Finalizar"

**Resultado Esperado:**
- Pantalla de éxito con animación del checkmark ✅
- Monto pagado: $50.00 (hardcoded en esta versión)
- Nuevo saldo: $14,950.00
- Información de seguridad mostrada
- Regreso a pantalla de tarjetas

---

## 🔧 Pruebas Técnicas

### Prueba A: Protocolo APDU

**Simular comando SELECT con herramienta de línea de comandos:**

```bash
# Requiere nfc-tools instalado
nfc-list
nfc-poll
```

**Comando APDU esperado del lector:**
```
00 A4 04 00 07 F0 01 02 03 04 05 06
```

**Respuesta esperada del teléfono:**
```
[Token] 90 00
Ejemplo: 31 32 33 34 35 36 37 38 39 30 31 32 33 34 35 36 90 00
```

---

### Prueba B: Múltiples Lecturas

**Objetivo:** Verificar estabilidad en lecturas repetidas

**Pasos:**
1. Prepara pago
2. Acerca/aleja el lector 10 veces
3. Cuenta lecturas exitosas

**Métrica de Éxito:**
- ≥ 9/10 lecturas exitosas (90% tasa de éxito)

---

### Prueba C: Alcance NFC

**Objetivo:** Determinar distancia máxima de lectura

**Pasos:**
1. Prepara pago
2. Acerca gradualmente el lector
3. Anota la distancia máxima donde se detecta

**Resultado Típico:**
- Alcance óptimo: 0-2 cm
- Alcance máximo: 2-4 cm

---

## 🚨 Casos de Error

### Error 1: "NFC no soportado"

**Causa:** Dispositivo no tiene chip NFC

**Solución:**
- Usar dispositivo Android con NFC
- Verificar: Ajustes > Conexiones > NFC

---

### Error 2: "NFC deshabilitado"

**Causa:** NFC está apagado en el sistema

**Solución:**
1. App muestra alert "¿Deseas habilitar NFC?"
2. Presiona "Ir a Ajustes"
3. Activa NFC
4. Regresa a la app

---

### Error 3: "Error de conexión con el servidor"

**Causa:** Backend no está corriendo o URL incorrecta

**Solución:**
```bash
# Verifica backend
cd backend
npm start

# Para dispositivo físico
ngrok http 3000
# Actualiza URL en APIService.ts
```

---

### Error 4: "File not found (6A82)"

**Causa:** Lector busca un AID diferente

**Solución:**
- Configura el lector/datáfono para buscar AID: `F0010203040506`
- O actualiza el AID en `apdu_service.xml` para coincidir con el lector

---

## 📊 Checklist de Validación POC

- [ ] App instala correctamente en Android
- [ ] Backend mock responde a todos los endpoints
- [ ] Permisos NFC están configurados
- [ ] Servicio HCE se registra correctamente
- [ ] Token se transmite por NFC
- [ ] Lector externo puede leer el token
- [ ] UI responde correctamente
- [ ] Animaciones funcionan sin lag
- [ ] Cancelación limpia el estado
- [ ] Logs muestran comunicación APDU
- [ ] Funciona en múltiples dispositivos Android
- [ ] Documentación está completa

---

## 🎯 Criterios de Éxito de la POC

### ✅ Factibilidad Demostrada Si:
1. Token se transmite exitosamente por NFC
2. Lector externo puede leer el token
3. Tasa de éxito ≥ 85% en 20 lecturas
4. Tiempo de activación < 2 segundos
5. Sin crashes durante las pruebas
6. Funciona en ≥ 3 modelos de teléfonos Android diferentes

### ⚠️ Limitaciones Documentadas:
1. Solo funciona en Android
2. Requiere HCE (Android 4.4+)
3. Protocolo EMV simplificado (no seguro para producción)
4. Tokens estáticos (en producción deben ser dinámicos)

---

## 📝 Reporte de Resultados

Después de las pruebas, documenta:

```markdown
## Resultados de Prueba - POC NFC

**Fecha:** [fecha]
**Dispositivo:** [modelo y versión Android]
**Tester:** [nombre]

### Pruebas Funcionales
- [ ] Carga de tarjetas: PASS / FAIL
- [ ] Preparación de pago: PASS / FAIL
- [ ] Transmisión NFC: PASS / FAIL
- [ ] Lectura externa: PASS / FAIL
- [ ] Cancelación: PASS / FAIL

### Pruebas de Rendimiento
- Tiempo activación NFC: ___ ms
- Tiempo lectura NFC: ___ ms
- Tasa de éxito: ___/20 (___%)

### Observaciones
[Notas adicionales, bugs encontrados, sugerencias]

### Recomendación
[ ] Continuar con implementación
[ ] Requiere ajustes
[ ] No viable
```

---

## 🔗 Recursos Adicionales

- [Documentación Android HCE](https://developer.android.com/guide/topics/connectivity/nfc/hce)
- [Especificación EMV](https://www.emvco.com/specifications/)
- [ISO 7816 (APDU)](https://en.wikipedia.org/wiki/Smart_card_application_protocol_data_unit)

---

¡Buena suerte con las pruebas! 🚀
