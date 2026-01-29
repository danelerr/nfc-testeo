# ✅ Checklist de Verificación - POC NFC GanaMóvil

Use esta lista antes de presentar o distribuir la POC.

---

## 📋 Pre-Demo Checklist

### Backend
- [ ] Backend instalado (`cd backend && npm install`)
- [ ] Backend corriendo (`npm start` en backend/)
- [ ] Endpoints responden:
  - [ ] `curl http://localhost:3000/card-token` devuelve 2 tarjetas
  - [ ] Estado: 200 OK

### Aplicación Móvil
- [ ] Dependencias instaladas (`npm install` en raíz)
- [ ] App compilada sin errores
- [ ] App instalada en dispositivo físico Android
- [ ] NFC habilitado en el dispositivo
- [ ] Pantalla de tarjetas carga correctamente
- [ ] Datos de tarjetas se muestran (2 tarjetas)

### Dispositivo de Prueba
- [ ] Teléfono Android con NFC
- [ ] NFC habilitado (Ajustes → NFC → ON)
- [ ] Batería > 50%
- [ ] Segundo dispositivo para leer (NFC Tools instalado) O datáfono configurado

### Documentación
- [ ] README.md presente y actualizado
- [ ] QUICKSTART.md presente
- [ ] TESTING.md presente
- [ ] Todos los archivos .md sin errores de formato

---

## 🧪 Test de Funcionalidad

### Test 1: Carga de Datos
- [ ] Abrir app
- [ ] Ver 2 tarjetas:
  - [ ] Débito •••• 0366 - $15,000.00
  - [ ] Crédito •••• 9903 - $8,500.50

### Test 2: Navegación
- [ ] Tocar primera tarjeta
- [ ] Ver pantalla de pago
- [ ] Ver botón "Preparar Pago"
- [ ] Presionar "Cancelar"
- [ ] Volver a pantalla de tarjetas

### Test 3: Preparación NFC
- [ ] Seleccionar tarjeta
- [ ] Presionar "Preparar Pago"
- [ ] Ver alert "Listo para Pagar"
- [ ] Ver animación 📡 pulsante
- [ ] Texto: "Acerca tu teléfono al lector NFC"

### Test 4: Lectura NFC
- [ ] Preparar pago
- [ ] Acercar lector NFC (otro teléfono o datáfono)
- [ ] Lector vibra/suena
- [ ] Lector muestra token: `1234567890123456` o `6543210987654321`
- [ ] Código de estado: `9000`

### Test 5: Cancelación
- [ ] Preparar pago
- [ ] Presionar "Cancelar"
- [ ] Volver a pantalla de tarjetas
- [ ] Sin crashes

---

## 📱 Compatibilidad Verificada

### Dispositivos Testeados
- [ ] Marca/Modelo: _______________
- [ ] Android Version: _______________
- [ ] NFC funciona: Sí / No
- [ ] HCE soportado: Sí / No
- [ ] Resultado: ✅ Éxito / ❌ Fallo

### Lectores NFC Probados
- [ ] App: NFC Tools (Android)
- [ ] App: NFC TagInfo (Android)
- [ ] Hardware: Datáfono modelo _______________
- [ ] Resultado: ✅ Lee token correctamente

---

## 🔍 Verificación Técnica

### Logs Android
```bash
adb logcat | grep "NFCHostApduService"
```
- [ ] Mensaje: "Token configurado: ..." aparece al preparar pago
- [ ] Mensaje: "Token limpiado" aparece al cancelar
- [ ] Sin errores en logs

### Servicio HCE Registrado
```bash
adb shell dumpsys nfc | grep "pocnfc"
```
- [ ] Servicio `NFCHostApduService` aparece en lista
- [ ] AID `F0010203040506` registrado

### Permisos NFC
```bash
adb shell dumpsys package com.pocnfc | grep permission
```
- [ ] `android.permission.NFC` granted
- [ ] `android.permission.INTERNET` granted

---

## 📚 Documentación Completa

- [ ] README.md (Documentación principal)
- [ ] QUICKSTART.md (Guía de inicio rápido)
- [ ] SUMMARY.md (Resumen visual)
- [ ] TESTING.md (Guía de pruebas)
- [ ] CONFIGURATION.md (Configuración avanzada)
- [ ] ROADMAP.md (Plan producción)
- [ ] PRESENTATION.md (Guía presentación)
- [ ] INDEX.md (Índice navegación)
- [ ] PROJECT-COMPLETE.md (Resumen de completación)
- [ ] backend/README.md (Docs del backend)

**Total: 10 archivos de documentación** ✅

---

## 🛠️ Archivos de Código

### Backend
- [ ] `backend/server.js` - API funcional
- [ ] `backend/package.json` - Dependencias
- [ ] `backend/README.md` - Documentación

### Android Nativo
- [ ] `NFCHostApduService.java` - Servicio HCE
- [ ] `NFCModule.java` - Bridge RN
- [ ] `NFCPackage.java` - Registro
- [ ] `AndroidManifest.xml` - Permisos NFC
- [ ] `apdu_service.xml` - Config AID
- [ ] `strings.xml` - Strings NFC

### React Native
- [ ] `src/screens/CardsScreen.tsx` - Pantalla tarjetas
- [ ] `src/screens/PaymentScreen.tsx` - Pantalla pago
- [ ] `src/screens/SuccessScreen.tsx` - Pantalla éxito
- [ ] `src/services/NFCService.ts` - Servicio NFC
- [ ] `src/services/APIService.ts` - Servicio API
- [ ] `src/types/nfc.ts` - Tipos
- [ ] `App.tsx` - App principal

### Scripts
- [ ] `install.bat` - Instalación Windows
- [ ] `install.sh` - Instalación Mac/Linux

---

## 🎤 Pre-Presentación

### Materiales Preparados
- [ ] Slides (PowerPoint/Google Slides)
- [ ] Documentación impresa o PDF
  - [ ] Resumen ejecutivo (1 página)
  - [ ] Resultados POC (1 página)
  - [ ] Roadmap visual (1 página)
  - [ ] Comparativa opciones (1 página)

### Demo
- [ ] Backend corriendo (verificado últimos 5 minutos)
- [ ] App funcionando (testeada 3 veces)
- [ ] Lector NFC listo
- [ ] Video backup grabado (por si falla demo en vivo)

### Equipo
- [ ] Teléfono cargado 100%
- [ ] Lector NFC cargado/listo
- [ ] Cables de respaldo
- [ ] Proyector/pantalla testeada
- [ ] WiFi/datos móviles confirmados

### Presentador
- [ ] Leído PRESENTATION.md
- [ ] Practicado demo 3+ veces
- [ ] Respuestas a FAQs preparadas
- [ ] Contacto visual practicado
- [ ] Tiempo: 15-20 minutos ensayados

---

## ✅ Checklist Final

### Antes de Entregar/Presentar
- [ ] Todos los tests pasan
- [ ] Documentación completa y sin typos
- [ ] Código limpio (sin console.logs innecesarios)
- [ ] Git commits organizados
- [ ] README actualizado con instrucciones claras
- [ ] Backend y app funcionan sin errores

### Criterios de Éxito POC
- [ ] ✅ Token se transmite por NFC
- [ ] ✅ Lector externo lee token correctamente
- [ ] ✅ Tasa de éxito ≥ 85%
- [ ] ✅ Sin crashes en pruebas
- [ ] ✅ UI fluida y clara
- [ ] ✅ Documentación completa

---

## 🎯 Estado General

**Completado:** _____ / 100+ items

**Estado:**
- [ ] 🟢 Todo listo - APROBAR para presentación
- [ ] 🟡 Faltan detalles menores - Corregir y revisar
- [ ] 🔴 Problemas críticos - NO presentar aún

---

## 📝 Notas

Usa este espacio para anotar cualquier observación:

```
_____________________________________________________

_____________________________________________________

_____________________________________________________

_____________________________________________________
```

---

## 🚀 Go / No-Go Decision

**Fecha de verificación:** _______________
**Verificado por:** _______________

**Decisión:**
- [ ] ✅ GO - Listo para presentar/distribuir
- [ ] 🔄 REVISAR - Corregir y volver a verificar
- [ ] ❌ NO GO - Problemas críticos, posponer

**Firma:** _______________

---

**Última actualización:** 26 de enero de 2026
