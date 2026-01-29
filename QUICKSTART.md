# 🚀 Inicio Rápido - POC NFC

## ⚡ Setup en 5 Minutos

### 1. Instalar Backend (Terminal 1)
```bash
cd backend
npm install
npm start
```
✅ Backend en `http://localhost:3000`

### 2. Configurar ngrok (Terminal 2) - Solo para dispositivo físico
```bash
ngrok http 3000
```
📋 Copia la URL HTTPS (ej: `https://abc123.ngrok.io`)

Actualiza en `src/services/APIService.ts`:
```typescript
const API_BASE_URL = 'https://abc123.ngrok.io';
```

### 3. Instalar y Correr App (Terminal 3)
```bash
npm install
npx react-native run-android
```

## 📱 Probar en 30 Segundos

1. **Selecciona tarjeta** - Toca una de las dos tarjetas mostradas
2. **Prepara pago** - Presiona "🚀 Preparar Pago"
3. **Acerca lector** - Usa otro teléfono con "NFC Tools" o un datáfono

### Apps de Lectura NFC Recomendadas
- **Android:** NFC Tools, NFC TagInfo
- **iOS:** No compatible (solo lectura pasiva)

## 🎯 Demo Rápida

### Escenario 1: Teléfono a Teléfono
```
Teléfono A (GanaMóvil POC)          Teléfono B (NFC Tools)
        │                                    │
        │ 1. Selecciona tarjeta              │
        │ 2. Prepara pago                    │
        │ 3. Ve animación 📡                 │
        │                                    │
        │◄───────── Acercar ─────────────────┤
        │                                    │
        │────── Token: 1234567890123456 ────►│
        │                                    │
        │                              ✅ Leído!
```

### Escenario 2: Teléfono a Datáfono
```
GanaMóvil POC              Datáfono Linkser
      │                           │
      │ 1. Prepara pago           │
      │ 2. Acerca teléfono        │
      │◄────── NFC ──────────────►│
      │                           │
      │── Token ──►│◄─ Procesa ───┤
      │            │               │
      └── ✅ OK ──►│◄── Aprueba ──┘
```

## 🧪 Verificación Rápida

### ¿Funciona el Backend?
```bash
curl http://localhost:3000/card-token
```
Debe devolver JSON con 2 tarjetas.

### ¿Está configurado NFC?
```bash
adb shell dumpsys nfc | grep "mState"
```
Debe mostrar: `mState=STATE_ON`

### ¿El servicio HCE está activo?
```bash
adb logcat | grep NFCHostApduService
```
Al preparar pago debe mostrar: `Token configurado: ...`

## 🎨 Pantallas

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  💳 Tarjetas    │     │   💳 Pago NFC   │     │   ✅ Éxito      │
│                 │     │                 │     │                 │
│  ┌───────────┐  │     │  •••• 0366     │     │      ✅         │
│  │ Débito    │  │────►│                 │────►│                 │
│  │ •••• 0366 │  │     │      📡         │     │  $50.00 Pagado │
│  │ $15,000   │  │     │                 │     │                 │
│  └───────────┘  │     │  🚀 Preparar   │     │  Saldo: $14,950│
│                 │     │                 │     │                 │
│  ┌───────────┐  │     │  ❌ Cancelar   │     │  ✨ Finalizar  │
│  │ Crédito   │  │     └─────────────────┘     └─────────────────┘
│  │ •••• 9903 │  │
│  │ $8,500    │  │
│  └───────────┘  │
└─────────────────┘
```

## 🔧 Troubleshooting Express

### ❌ "No aparecen tarjetas"
```bash
# 1. Verifica backend
cd backend && npm start

# 2. Para emulador
# En APIService.ts:
const API_BASE_URL = 'http://10.0.2.2:3000';

# 3. Para dispositivo físico
ngrok http 3000
# Actualiza URL en APIService.ts
```

### ❌ "NFC no funciona"
```bash
# Verifica que NFC esté ON
Ajustes > Conexiones > NFC > Activar

# Solo funciona en dispositivo físico
# NO funciona en emulador
```

### ❌ "El lector no detecta"
1. Asegúrate de ver la animación 📡 (pago armado)
2. Acerca el **dorso** del teléfono al lector
3. Mantén por 2-3 segundos
4. Área de contacto: centro del teléfono (zona de batería)

## 📦 Estructura Simplificada

```
POCNFC/
├── backend/
│   └── server.js          ← API Mock
├── android/
│   └── app/src/main/java/com/pocnfc/
│       ├── NFCHostApduService.java  ← Emulación NFC
│       └── NFCModule.java           ← Bridge RN-Native
├── src/
│   ├── screens/           ← UI (3 pantallas)
│   └── services/          ← Lógica (NFC + API)
└── App.tsx               ← Navegación
```

## 🎯 Objetivos de la POC

✅ **Demostrar:**
- NFC funciona en Android con HCE
- Token se transmite correctamente
- UI es fluida y clara
- Integración con backend mock

⚠️ **NO incluye (por diseño):**
- Protocolo EMV completo
- Tokenización dinámica
- Certificación PCI
- Soporte iOS
- Biometría (opcional)

## 📚 Documentación Completa

- **README.md** - Arquitectura y setup detallado
- **TESTING.md** - Guía de pruebas exhaustiva
- **backend/README.md** - Documentación del API

## 🆘 Ayuda Rápida

**¿Preguntas?** Revisa:
1. Logs: `adb logcat | grep "NFC"`
2. Backend: `curl http://localhost:3000/card-token`
3. Docs: [README.md](./README.md) y [TESTING.md](./TESTING.md)

---

## 🎓 Conceptos en 1 Minuto

**HCE (Host Card Emulation):**
Tu teléfono se comporta como una tarjeta NFC.

**APDU:**
Lenguaje que hablan el teléfono y el lector.

**AID (`F0010203040506`):**
"Nombre" que el lector busca para conectarse a tu app.

**Token:**
16 dígitos que representan tu tarjeta (en producción son dinámicos).

---

¡Listo! Ahora tienes todo para ejecutar y probar la POC. 🚀

**Siguiente paso:** [Guía de Pruebas Detallada →](./TESTING.md)
