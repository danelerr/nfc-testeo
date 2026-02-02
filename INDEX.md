# 📚 Índice de Documentación - POC NFC GanaMóvil

Índice completo de toda la documentación del proyecto.

---

## 🚀 Comenzar Aquí

Si eres nuevo en el proyecto, sigue este orden:

1. **[README.md](./README.md)** - Inicio rápido y visión general
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura técnica detallada
3. **[VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md)** - Diagramas de flujo y visuales
4. **[HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md)** - Conceptos técnicos NFC

---

## 📖 Documentación por Categoría

### 🎯 Visión General

| Documento | Descripción | Para quién |
|-----------|-------------|------------|
| **[README.md](./README.md)** | Documentación principal, inicio rápido, arquitectura de alto nivel | 👥 Todos |
| **[INDEX.md](./INDEX.md)** | Este documento - índice completo | 👥 Todos |

### 🏗️ Arquitectura y Diseño

| Documento | Descripción | Para quién |
|-----------|-------------|------------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Arquitectura técnica completa, diagramas de clases, secuencia | 👨‍💻 Desarrolladores |
| **[VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md)** | Flujos visuales, UI mockups, timelines | 🎨 Diseñadores, PM |
| **[HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md)** | Explicación técnica de HCE y Reader Mode | 👨‍💻 Dev Android/NFC |

### 🔧 Backend

| Documento | Descripción | Para quién |
|-----------|-------------|------------|
| **[backend/README.md](./backend/README.md)** | Documentación API REST, endpoints, base de datos mock | 🔌 Backend devs, QA |

### 🐛 Correcciones y Fixes

| Documento | Descripción | Para quién |
|-----------|-------------|------------|
| **[PAYMENT-FLOW-FIX.md](./PAYMENT-FLOW-FIX.md)** | Fix del problema de pago doble | 👨‍💻 Desarrolladores |

### 🤖 Desarrollo con IA

| Documento | Descripción | Para quién |
|-----------|-------------|------------|
| **[AI-DEVELOPMENT-PROMPT.md](./AI-DEVELOPMENT-PROMPT.md)** | Guía completa para desarrollo con IA (GitHub Copilot) | 🤖 AI devs |

---

## 📂 Estructura de Documentación

```
POCNFC/
│
├── README.md                    ⭐ [Inicio] Visión general + quick start
├── INDEX.md                     📚 [Índice] Este archivo
├── ARCHITECTURE.md              🏗️ [Arquitectura] Diagramas técnicos completos
├── VISUAL-DIAGRAMS.md           🎨 [Visual] Flujos UI, timelines
├── HCE-VS-READER-MODE.md        📡 [Técnico] Conceptos NFC
├── PAYMENT-FLOW-FIX.md          🐛 [Fix] Solución pago doble
├── AI-DEVELOPMENT-PROMPT.md     🤖 [IA] Guía desarrollo con IA
│
└── backend/
    └── README.md                🔌 [Backend] Documentación API REST
```

---

## 🎓 Guías de Aprendizaje

### Para Principiantes en NFC

**Ruta de aprendizaje:**

1. 📖 Lee [README.md](./README.md) sección "Cómo Probar"
2. 📡 Lee [HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md) - conceptos básicos
3. 🎨 Revisa [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) - flujo de transacción
4. 🏗️ Estudia [ARCHITECTURE.md](./ARCHITECTURE.md) - protocolo APDU

**Tiempo estimado:** 2-3 horas

### Para Desarrolladores React Native

**Ruta de aprendizaje:**

1. 📖 Lee [README.md](./README.md) sección "Arquitectura del Sistema"
2. 🏗️ Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - diagrama de clases frontend
3. 🎨 Revisa [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) - componentes y responsabilidades
4. 👨‍💻 Explora código en `src/`

**Archivos clave a revisar:**
- `src/services/NFCService.ts`
- `src/screens/PaymentScreen.tsx`
- `src/screens/ChargeWaitingScreen.tsx`

**Tiempo estimado:** 1-2 horas

### Para Desarrolladores Android/Java

**Ruta de aprendizaje:**

1. 📡 Lee [HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md) - completo
2. 🏗️ Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - protocolo APDU detallado
3. 🎨 Revisa [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) - bytes APDU
4. 👨‍💻 Explora código en `android/app/src/main/java/`

**Archivos clave a revisar:**
- `NFCHostApduService.java` ⭐
- `NFCModule.java`
- `AndroidManifest.xml`
- `res/xml/apduservice.xml`

**Tiempo estimado:** 2-3 horas

### Para Desarrolladores Backend

**Ruta de aprendizaje:**

1. 🔌 Lee [backend/README.md](./backend/README.md) - completo
2. 🏗️ Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - arquitectura de datos
3. 🎨 Revisa [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) - flujo de datos
4. 👨‍💻 Explora `backend/server.js`

**Endpoints clave:**
- `POST /charge-payment` - procesamiento de cobros
- `POST /authorize-payment` - autorización de pagos
- `GET /card-token` - gestión de tarjetas

**Tiempo estimado:** 1 hora

---

## 🔍 Búsqueda Rápida

### Por Concepto

| Concepto | Archivo | Sección |
|----------|---------|---------|
| **HCE (Host Card Emulation)** | [HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md) | Completo |
| **APDU Protocol** | [ARCHITECTURE.md](./ARCHITECTURE.md) | Protocolo APDU |
| **AID (Application ID)** | [README.md](./README.md) | Protocolo APDU |
| **Reader Mode** | [HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md) | Reader Mode |
| **Token estático** | [ARCHITECTURE.md](./ARCHITECTURE.md) | Seguridad |
| **Pago doble** | [PAYMENT-FLOW-FIX.md](./PAYMENT-FLOW-FIX.md) | Completo |
| **Backend endpoints** | [backend/README.md](./backend/README.md) | API Endpoints |
| **Eventos NFC** | [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) | Flujo de Eventos |
| **Diagrama de clases** | [ARCHITECTURE.md](./ARCHITECTURE.md) | Diagrama de Clases |
| **Timeline transacción** | [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) | Timeline |

### Por Archivo de Código

| Archivo | Documentación | Sección |
|---------|---------------|---------|
| **NFCHostApduService.java** | [HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md) | Implementación HCE |
| **NFCModule.java** | [ARCHITECTURE.md](./ARCHITECTURE.md) | Capa Nativa |
| **PaymentScreen.tsx** | [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) | Flujo Cliente |
| **ChargeWaitingScreen.tsx** | [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) | Flujo Comerciante |
| **NFCService.ts** | [ARCHITECTURE.md](./ARCHITECTURE.md) | Servicios |
| **APIService.ts** | [backend/README.md](./backend/README.md) | Cliente HTTP |
| **server.js** | [backend/README.md](./backend/README.md) | Backend Mock |

---

## 🛠️ Recursos de Desarrollo

### Setup Inicial

**Prerequisitos:**
- Node.js 20+
- Android Studio
- JDK 17+
- Dispositivo Android físico con NFC

**Guías:**
1. [README.md](./README.md) - Sección "Inicio Rápido"
2. [backend/README.md](./backend/README.md) - Instalación backend

### Testing

**Guías de prueba:**
- [README.md](./README.md) - Sección "Cómo Probar"
- [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) - Checklist de pruebas

### Debugging

**Problemas comunes:**
- [README.md](./README.md) - Sección "Solución de Problemas"
- [PAYMENT-FLOW-FIX.md](./PAYMENT-FLOW-FIX.md) - Pago doble
- [backend/README.md](./backend/README.md) - Troubleshooting backend

**Logs:**
```bash
# Android
adb logcat | grep NFC

# Backend
npm run dev  # con auto-reload

# React Native
# Logs automáticos en Metro Bundler
```

---

## 📊 Métricas y Rendimiento

**Documentación:**
- [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) - Sección "Métricas de Rendimiento"
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Sección "Métricas del Sistema"

---

## 🔐 Seguridad

**Documentación:**
- [README.md](./README.md) - Sección "Seguridad"
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Sección "Flujo de Seguridad"
- [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) - Matriz de Seguridad

**⚠️ Importante:** Este es un POC educativo. NO usar en producción sin:
- Tokenización dinámica EMV
- Certificación PCI-DSS
- Auditoría de seguridad completa

---

## 🌐 Enlaces Externos

### Documentación Oficial

- [Android HCE Guide](https://developer.android.com/guide/topics/connectivity/nfc/hce)
- [React Native Docs](https://reactnative.dev/)
- [Express.js Docs](https://expressjs.com/)
- [ISO 7816-4 Standard](https://www.iso.org/standard/54550.html)

### Comunidad

- [Stack Overflow - Android NFC](https://stackoverflow.com/questions/tagged/android-nfc)
- [React Native Community](https://reactnative.dev/community/overview)

---

## 🤝 Contribuir

### Antes de contribuir

1. Lee toda la documentación relevante
2. Verifica que el cambio no rompa funcionalidad existente
3. Actualiza documentación si es necesario

### Documentación a actualizar

Si modificas código, actualiza estos archivos:

| Cambio en | Actualizar |
|-----------|------------|
| `NFCHostApduService.java` | [HCE-VS-READER-MODE.md](./HCE-VS-READER-MODE.md), [ARCHITECTURE.md](./ARCHITECTURE.md) |
| `src/screens/*.tsx` | [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md) |
| `backend/server.js` | [backend/README.md](./backend/README.md) |
| Endpoints API | [backend/README.md](./backend/README.md), [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Flujo de pago | [VISUAL-DIAGRAMS.md](./VISUAL-DIAGRAMS.md), [README.md](./README.md) |

---

## 📝 Historial de Cambios

### v1.0.0 (2026-02-02)

**Documentación creada:**
- ✅ README.md completo con diagramas
- ✅ ARCHITECTURE.md con diagramas técnicos
- ✅ VISUAL-DIAGRAMS.md con flujos visuales
- ✅ backend/README.md documentación API
- ✅ INDEX.md (este archivo)

**Cambios en código:**
- ✅ Fix pago doble (solo ChargeWaitingScreen llama backend)
- ✅ Protocolo APDU de 2 comandos implementado
- ✅ Reader Mode funcional con IsoDep
- ✅ HCE Service completo con eventos

---

## 🆘 Ayuda y Soporte

### Preguntas Frecuentes

**P: ¿Por qué el emulador no funciona?**  
R: El emulador de Android NO soporta NFC. Debes usar dispositivos físicos.

**P: ¿Por qué se procesan pagos 2 veces?**  
R: Lee [PAYMENT-FLOW-FIX.md](./PAYMENT-FLOW-FIX.md). Está corregido en v1.0.0.

**P: ¿Por qué los saldos se reinician?**  
R: Base de datos en memoria. Lee [backend/README.md](./backend/README.md) sección "Persistencia".

**P: ¿Cómo implemento en producción?**  
R: NO usar este código en producción. Requiere EMV tokenization, PCI-DSS, etc.

### Contacto

Para más información sobre el proyecto, revisar:
- 📖 Documentación completa en este directorio
- 🐛 Issues conocidos: [PAYMENT-FLOW-FIX.md](./PAYMENT-FLOW-FIX.md)
- 🤖 Guía de IA: [AI-DEVELOPMENT-PROMPT.md](./AI-DEVELOPMENT-PROMPT.md)

---

## 📄 Licencia

Este es un **POC (Proof of Concept)** con fines educativos.

**NO USAR EN PRODUCCIÓN** sin implementar:
- ✅ Tokenización dinámica (EMV tokens)
- ✅ Cifrado de comunicación NFC
- ✅ Certificación PCI-DSS
- ✅ Autenticación de dispositivos
- ✅ Auditoría de seguridad completa

---

**Índice creado**: 2026-02-02  
**Versión**: 1.0.0  
**Última actualización**: 2026-02-02  
**Autor**: Equipo GanaMóvil

---

## 🗺️ Mapa de Navegación

```
📚 INDEX.md (Estás aquí)
    │
    ├─🚀 README.md ..................... Inicio rápido
    │   ├─ Instalación
    │   ├─ Arquitectura de alto nivel
    │   └─ Cómo probar
    │
    ├─🏗️ ARCHITECTURE.md .............. Arquitectura técnica
    │   ├─ Diagrama de clases
    │   ├─ Diagrama de secuencia
    │   ├─ Protocolo APDU detallado
    │   └─ Estructura de archivos
    │
    ├─🎨 VISUAL-DIAGRAMS.md ............ Diagramas visuales
    │   ├─ Flujos UI
    │   ├─ Timeline de transacción
    │   ├─ Bytes APDU
    │   └─ Métricas de rendimiento
    │
    ├─📡 HCE-VS-READER-MODE.md ......... Conceptos NFC
    │   ├─ Qué es HCE
    │   ├─ Qué es Reader Mode
    │   ├─ Implementación Android
    │   └─ Comparación técnica
    │
    ├─🐛 PAYMENT-FLOW-FIX.md ........... Fix pago doble
    │   ├─ Problema identificado
    │   ├─ Solución implementada
    │   └─ Verificación
    │
    ├─🤖 AI-DEVELOPMENT-PROMPT.md ...... Guía IA
    │   ├─ Contexto del proyecto
    │   ├─ Arquitectura
    │   └─ Mejores prácticas
    │
    └─🔌 backend/README.md ............. API Backend
        ├─ Endpoints
        ├─ Base de datos mock
        ├─ Testing
        └─ Deployment
```

---

**¡Gracias por usar POC NFC GanaMóvil!** 🚀
