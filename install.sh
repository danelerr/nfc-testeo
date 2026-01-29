#!/bin/bash

echo "========================================"
echo "  POC NFC - GanaMóvil"
echo "  Script de Instalación"
echo "========================================"
echo ""

echo "[1/4] Instalando dependencias del backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Falló la instalación del backend"
    exit 1
fi
cd ..

echo ""
echo "[2/4] Instalando dependencias de React Native..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Falló la instalación de React Native"
    exit 1
fi

echo ""
echo "[3/4] Instalando pods de iOS (si aplica)..."
if [ -d "ios" ]; then
    cd ios
    pod install 2>/dev/null || echo "Pods no disponibles o no necesarios"
    cd ..
fi

echo ""
echo "[4/4] Limpiando cache..."
cd android
./gradlew clean 2>/dev/null || echo "Gradle clean omitido"
cd ..

echo ""
echo "========================================"
echo "  ✅ Instalación Completada!"
echo "========================================"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Inicia el backend:"
echo "   cd backend && npm start"
echo ""
echo "2. (Opcional) Para dispositivo físico, usa ngrok:"
echo "   ngrok http 3000"
echo "   Luego actualiza la URL en src/services/APIService.ts"
echo ""
echo "3. Inicia la app Android:"
echo "   npx react-native run-android"
echo ""
echo "4. Consulta QUICKSTART.md para más detalles"
echo ""
