# Configuración POC NFC

## URLs de API

### Desarrollo Local (Emulador Android)
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000';
```

### Desarrollo Local (iOS Simulator)
```typescript
const API_BASE_URL = 'http://localhost:3000';
```

### Dispositivo Físico (con ngrok)
```bash
# Terminal 1: Inicia ngrok
ngrok http 3000

# Copia la URL HTTPS (ejemplo: https://abc123.ngrok.io)
```

```typescript
const API_BASE_URL = 'https://abc123.ngrok.io';
```

## AID (Application ID)

**Actual:** `F0010203040506` (AID privado para pruebas)

Para producción, necesitarás registrar un AID oficial:
- Visa: Comienza con `A000000003`
- Mastercard: Comienza con `A000000004`
- Privado: `F0xxxxxxxxxx` (para pruebas únicamente)

## Tokens de Prueba

### Tarjeta 1 (Débito)
```
Token: 1234567890123456
Saldo: $15,000.00
Últimos 4 dígitos: 0366
```

### Tarjeta 2 (Crédito)
```
Token: 6543210987654321
Saldo: $8,500.50
Últimos 4 dígitos: 9903
```

## Configuración del Servicio HCE

Archivo: `android/app/src/main/res/xml/apdu_service.xml`

```xml
<aid-filter android:name="F0010203040506"/>
```

Para cambiar el AID:
1. Actualiza `apdu_service.xml`
2. Actualiza `NFCHostApduService.java` (constante `AID`)
3. Recompila la app

## Permisos Necesarios

### AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.NFC" />
<uses-feature android:name="android.hardware.nfc.hce" android:required="true" />
```

## Variables de Entorno (Opcional)

Crea un archivo `.env` en la raíz del proyecto:

```env
# Backend
API_BASE_URL=http://10.0.2.2:3000
API_TIMEOUT=10000

# NFC
NFC_AID=F0010203040506
NFC_PAYMENT_TIMEOUT=30000

# Debug
ENABLE_NFC_LOGS=true
```

**Nota:** Necesitarás `react-native-config` para usar variables de entorno:
```bash
npm install react-native-config
```

## Configuración de Logs

### Ver logs NFC
```bash
adb logcat | grep "NFCHostApduService\|NFCModule"
```

### Ver logs React Native
```bash
npx react-native log-android
```

### Habilitar logs detallados en Java
En `NFCHostApduService.java`:
```java
private static final boolean DEBUG = true; // Cambiar a false en producción
```

## Timeouts

### Configuración Actual

```typescript
// APIService.ts
timeout: 10000 // 10 segundos para peticiones HTTP

// PaymentScreen.tsx
// Sin timeout implementado - el pago espera indefinidamente
```

### Timeout Recomendado para Producción

```typescript
const NFC_PAYMENT_TIMEOUT = 30000; // 30 segundos

setTimeout(() => {
  if (!paymentCompleted) {
    alert('Tiempo de espera agotado');
    disarmPayment();
  }
}, NFC_PAYMENT_TIMEOUT);
```

## Configuración de Seguridad

⚠️ **Solo para POC - NO usar en producción**

### Deshabilitar para Producción:
1. **Tokens estáticos:** Implementar tokenización dinámica
2. **HTTP sin cifrar:** Usar solo HTTPS con certificados válidos
3. **Sin autenticación:** Agregar JWT o OAuth
4. **Logs detallados:** Deshabilitar logs de tokens en producción

### Habilitar para Producción:
1. **TLS/SSL:** Certificados válidos
2. **Biometría:** Validar identidad antes de pagar
3. **Rate limiting:** Limitar intentos de pago
4. **Encriptación:** Encriptar tokens en tránsito y reposo

## Configuración de Build

### Debug (Desarrollo)
```bash
npx react-native run-android
```

### Release (Producción)
```bash
cd android
./gradlew assembleRelease

# APK estará en:
# android/app/build/outputs/apk/release/app-release.apk
```

## Configuración de Dispositivos

### Requisitos Mínimos
- Android 4.4+ (API 19) para HCE
- Chip NFC habilitado
- 50 MB de espacio libre

### Dispositivos Probados
- ✅ Samsung Galaxy (S10+, S20, S21)
- ✅ Google Pixel (3, 4, 5)
- ✅ OnePlus (7, 8, 9)
- ⚠️ Xiaomi (algunos modelos tienen NFC deshabilitado)

### Configuración del Dispositivo
1. Ajustes > Conexiones > NFC > Activar
2. Ajustes > Apps > App Predeterminada de Pagos > Seleccionar GanaMóvil POC

## Troubleshooting

### El servicio HCE no se registra
```bash
# Verifica que el servicio esté declarado
adb shell dumpsys nfc
# Busca: com.pocnfc.NFCHostApduService

# Si no aparece, reinstala la app
adb uninstall com.pocnfc
npx react-native run-android
```

### El AID no coincide
```bash
# Verifica el AID configurado
adb shell pm dump com.pocnfc | grep -A 20 "apdu-service"

# Debe mostrar: F0010203040506
```

### Backend no responde
```bash
# Verifica que el servidor esté corriendo
curl http://localhost:3000/card-token

# Para dispositivo físico, verifica ngrok
curl https://tu-url-ngrok.ngrok.io/card-token
```

## Recursos Adicionales

- [Android HCE Documentation](https://developer.android.com/guide/topics/connectivity/nfc/hce)
- [EMV Specifications](https://www.emvco.com/specifications/)
- [ISO 7816-4 (APDU)](https://www.iso.org/standard/54550.html)
- [NFC Forum](https://nfc-forum.org/)

---

**Actualizado:** 26 de enero de 2026
