@echo off
echo ========================================
echo   POC NFC - GanaMovil
echo   Script de Instalacion Windows
echo ========================================
echo.

echo [1/4] Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion del backend
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Instalando dependencias de React Native...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de React Native
    pause
    exit /b 1
)

echo.
echo [3/4] Limpiando cache de React Native...
cd android
call gradlew clean
cd ..

echo.
echo [4/4] Verificando configuracion...
echo.
echo ========================================
echo   Instalacion Completada!
echo ========================================
echo.
echo Proximos pasos:
echo.
echo 1. Inicia el backend:
echo    cd backend ^&^& npm start
echo.
echo 2. (Opcional) Para dispositivo fisico, usa ngrok:
echo    ngrok http 3000
echo    Luego actualiza la URL en src/services/APIService.ts
echo.
echo 3. Inicia la app Android:
echo    npx react-native run-android
echo.
echo 4. Consulta QUICKSTART.md para mas detalles
echo.
pause
