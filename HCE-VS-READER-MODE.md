# 🔄 HCE vs Reader Mode

## 🎯 Resumen Rápido

| | HCE (Implementado) | Reader Mode (Simulado) |
|---|---|---|
| **Rol** | Tarjeta (pasivo) | Lector (activo) |
| **Hace** | Emite token cuando es leído | Lee tokens de otros |
| **Usuario** | Cliente que paga | Comercio que cobra |
| **Clase** | `HostApduService` | `NfcAdapter.ReaderCallback` |
| **Estado** | ✅ Funcional | ⚠️ Simulado (timeout 3s) |
| **Archivo** | `NFCHostApduService.java` | Falta implementar |

## 📱 HCE (Host Card Emulation) - LO IMPORTANTE

### ¿Qué es?
Tu dispositivo **SE COMPORTA COMO UNA TARJETA NFC**

### Implementación (✅ Completada)

**NFCHostApduService.java:**
```java
public class NFCHostApduService extends HostApduService {
    @Override
    public byte[] processCommandApdu(byte[] commandApdu, Bundle extras) {
        // Responde con token cuando recibe SELECT_AID
        if (isSelectAidCommand(commandApdu)) {
            return buildTokenResponse(paymentToken);
        }
    }
}
```

**Configuración:**
- `AndroidManifest.xml` - Registra servicio HCE
- `apdu_service.xml` - Define AID: `F0010203040506`

### Flujo HCE
```
Lector NFC → SELECT AID → Tu App (HCE) → Responde TOKEN → Lector procesa
```

## 📡 Reader Mode - COMPLEMENTARIO

### ¿Qué es?
Tu dispositivo **ACTÚA COMO LECTOR/DATÁFONO**

### Implementación (⚠️ Simulada)

**Actual** - Timeout de 3 segundos:
```typescript
// ChargeWaitingScreen.tsx
setTimeout(() => {
  handleNFCDetected('1234567890123456');
}, 3000);
```

**Para implementar real en NFCModule.java:**
```java
@ReactMethod
public void startReaderMode(Promise promise) {
    NfcAdapter adapter = NfcAdapter.getDefaultAdapter(context);
    adapter.enableReaderMode(activity, 
        tag -> {
            // Leer token del dispositivo cliente
            IsoDep isoDep = IsoDep.get(tag);
            byte[] response = isoDep.transceive(SELECT_AID_COMMAND);
            String token = bytesToHex(response);
            sendEvent("onNFCTagDetected", token);
        },
        NfcAdapter.FLAG_READER_NFC_A,
        null
    );
}
```

### Flujo Reader Mode
```
Tu App (Reader) → Detecta dispositivo → SELECT AID → Recibe TOKEN → Procesa cobro
```

## 🏗️ Arquitectura Completa

### Modo Pagar (HCE) ✅

### Modo Pagar (HCE) ✅
```
CardsScreen → Selecciona tarjeta
    ↓
PaymentScreen → armPayment(token) → NFCHostApduService activo
    ↓
Acerca a lector → Lector recibe token
    ↓
SuccessScreen
```

### Modo Cobrar (Reader Mode) ⚠️
```
AccountSelection → Selecciona cuenta destino
    ↓
ChargeHomeScreen → Ingresa monto
    ↓
ChargeWaitingScreen → startReaderMode() [SIMULADO con timeout]
    ↓
[PENDIENTE: Implementar enableReaderMode en Java]
    ↓
ChargeSuccessScreen
```

## 🔑 Diferencia Clave

**HCE (Cliente):**
- Espera pasivamente
- Responde cuando es interrogado
- ✅ **Implementado** en `NFCHostApduService.java`

**Reader Mode (Comerciante):**
- Busca activamente
- Interroga dispositivos cercanos
- ⚠️ **Simulado** - Falta `enableReaderMode()` en `NFCModule.java`

## 📄 Referencias

- [Android HCE Guide](https://developer.android.com/guide/topics/connectivity/nfc/hce)
- [Reader Mode API](https://developer.android.com/reference/android/nfc/NfcAdapter#enableReaderMode)

---

**Febrero 2026**
