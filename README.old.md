# 📱 POC NFC - GanaMóvil

Prueba de Concepto de pagos NFC usando **Host Card Emulation (HCE)** para Android.

## 🚀 Inicio Rápido

```bash
# Terminal 1: Backend
cd backend && npm install && npm start

# Terminal 2: App
npm install && npm run android
```


## 📚 Documentación

- [AI-DEVELOPMENT-PROMPT.md](./AI-DEVELOPMENT-PROMPT.md) - Guía completa para desarrollo
- [HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md) - Explicación técnica HCE
- [backend/README.md](./backend/README.md) - Documentación del backend

## 🏗️ Arquitectura

```
React Native App (TypeScript)
    ├── Modo Pagar (HCE - PRINCIPAL) ⭐
    │   ├── CardsScreen → Selección de tarjeta
    │   ├── PaymentScreen → Activar HCE
    │   └── SuccessScreen → Confirmación
    │
    └── Modo Cobrar (Reader Mode - Complementario)
        ├── AccountSelection → Seleccionar cuenta destino
        ├── ChargeHomeScreen → Ingresar monto
        ├── ChargeWaitingScreen → Esperar NFC (simulado)
        └── ChargeSuccessScreen → Confirmación

Android Native (Java)
    ├── NFCHostApduService.java ⭐ - Emulación HCE
    └── NFCModule.java - Bridge React Native

Backend Mock (Node.js)
    ├── Endpoints Modo Pagar (HCE)
    │   ├── GET /card-token
    │   ├── POST /authorize-payment
    │   └── GET /balance/:token
    └── Endpoints Modo Cobrar
        ├── GET /merchant-accounts
        └── POST /charge-payment
```

## 🎯 Funcionalidades

### ✅ Implementado (HCE - Lo Importante)

- **Host Card Emulation funcional** - Dispositivo actúa como tarjeta NFC
- **Transmisión de tokens** - AID: `F0010203040506`
- **Protocolo APDU** - Responde a comando SELECT
- **Backend Mock** - API REST para validación
- **UI completa** - Flujo de pago end-to-end

### 🆕 Agregado (Modo Comerciante)

- **Selección de cuenta** - Comerciante elige dónde recibir dinero
- **Modo cobrar** - Interfaz para generar órdenes de cobro
- **Reader Mode simulado** - Espera 3 segundos (no implementado en Java)
- **Transferencias mock** - Backend simula cliente → comerciante

## 🧪 Cómo Probar HCE

**Con otro dispositivo Android:**
1. Instalar "NFC Tools" en segundo teléfono
2. En POC: Seleccionar tarjeta → Preparar Pago
3. Acercar dispositivos (dorso con dorso)
4. Segundo teléfono lee token de 16 dígitos

**Con datáfono real:**
1. Configurar AID `F0010203040506` en terminal
2. Preparar pago en app
3. Acercar teléfono al lector

## ⚠️ Notas Importantes

### HCE (Lo Principal)
✅ **Completamente funcional** - Ver `NFCHostApduService.java`
- Dispositivo actúa como tarjeta NFC
- Transmite tokens de 16 dígitos
- Compatible con lectores EMV estándar

### Reader Mode (Complementario)
⚠️ **Actualmente simulado** (timeout de 3 segundos)
- Para implementación real: agregar `enableReaderMode()` en `NFCModule.java`
- Ver `HCE-VS-READER-MODE.md` para detalles

### Seguridad
🔒 **NO usar en producción** sin:
- Tokenización dinámica EMV
- Certificación PCI-DSS
- Criptografía completa
- Auditorías de seguridad

## 📁 Estructura de Archivos

```
POCNFC/
├── android/app/src/main/java/com/pocnfc/
│   ├── NFCHostApduService.java ⭐ Emulación HCE
│   └── NFCModule.java - Bridge React Native
├── src/
│   ├── screens/
│   │   ├── CardsScreen.tsx - Modo Pagar (HCE)
│   │   ├── PaymentScreen.tsx ⭐ Activación HCE
│   │   ├── SuccessScreen.tsx
│   │   ├── AccountSelectionScreen.tsx - Modo Cobrar
│   │   ├── ChargeHomeScreen.tsx
│   │   ├── ChargeWaitingScreen.tsx
│   │   └── ChargeSuccessScreen.tsx
│   ├── services/
│   │   ├── NFCService.ts - Wrapper HCE
│   │   └── APIService.ts - Cliente HTTP
│   └── types/
│       ├── nfc.ts - Interfaces TypeScript
│       └── navigation.ts
├── backend/
│   └── server.js - API Mock
├── App.tsx - Navegación (Tabs + Stacks)
└── Documentación/
    ├── README.md (este archivo)
    ├── AI-DEVELOPMENT-PROMPT.md
    └── HCE-VS-READER-MODE.md
```

## 🛠️ Troubleshooting

**NFC no se activa:**
```bash
adb logcat | grep NFCHostApduService
```

**Backend no conecta:**
- Verificar: `http://localhost:3000/card-token`
- Dispositivo físico: usar ngrok o cambiar URL en `APIService.ts`

**Lector no detecta:**
- Asegurar pago "armado" (pantalla con logo NFC)
- Acercar dorso del teléfono al lector
- Mantener 2-3 segundos

## 📞 Recursos

- [Android HCE Guide](https://developer.android.com/guide/topics/connectivity/nfc/hce)
- [EMV Specifications](https://www.emvco.com/specifications/)
- Documentación interna: `AI-DEVELOPMENT-PROMPT.md`

---

**Estado:** ✅ POC Completa  
**Última actualización:** Febrero 2026
