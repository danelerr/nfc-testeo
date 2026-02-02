package com.pocnfc;

import android.app.Activity;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import androidx.annotation.Nullable;

import java.io.IOException;

/**
 * Módulo Bridge para comunicar React Native con el servicio NFC nativo
 */
public class NFCModule extends ReactContextBaseJavaModule {
    
    private static final String TAG = "NFCModule";
    private final ReactApplicationContext reactContext;
    private NfcAdapter nfcAdapter;
    private NfcAdapter.ReaderCallback readerCallback;
    private static double currentAmount = 0.0;
    
    public NFCModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
        // Configurar el contexto en el servicio HCE para que pueda enviar eventos
        NFCHostApduService.setReactContext(reactContext);
        
        // Configurar el callback para Reader Mode
        this.readerCallback = new NfcAdapter.ReaderCallback() {
            @Override
            public void onTagDiscovered(Tag tag) {
                handleTagDiscovered(tag);
            }
        };
    }
    
    @Override
    public String getName() {
        return "NFCModule";
    }
    
    /**
     * Requerido por NativeEventEmitter - cuenta de listeners
     */
    @ReactMethod
    public void addListener(String eventName) {
        // Mantener conteo de listeners si es necesario
    }
    
    /**
     * Requerido por NativeEventEmitter - remover listeners
     */
    @ReactMethod
    public void removeListeners(int count) {
        // Remover listeners si es necesario
    }
    
    /**
     * Verifica si el dispositivo soporta NFC
     */
    @ReactMethod
    public void isNFCSupported(Promise promise) {
        try {
            NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
            promise.resolve(nfcAdapter != null);
        } catch (Exception e) {
            promise.reject("NFC_ERROR", "Error al verificar soporte NFC: " + e.getMessage());
        }
    }
    
    /**
     * Verifica si NFC está habilitado
     */
    @ReactMethod
    public void isNFCEnabled(Promise promise) {
        try {
            NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
            if (nfcAdapter == null) {
                promise.resolve(false);
            } else {
                promise.resolve(nfcAdapter.isEnabled());
            }
        } catch (Exception e) {
            promise.reject("NFC_ERROR", "Error al verificar estado NFC: " + e.getMessage());
        }
    }
    
    /**
     * Abre la configuración de NFC del sistema
     */
    @ReactMethod
    public void openNFCSettings(Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                promise.reject("ACTIVITY_ERROR", "No hay actividad activa");
                return;
            }
            
            Intent intent = new Intent(Settings.ACTION_NFC_SETTINGS);
            currentActivity.startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("NFC_ERROR", "Error al abrir configuración NFC: " + e.getMessage());
        }
    }
    
    /**
     * Arma el pago configurando el token en el servicio HCE
     * Este token será enviado cuando el teléfono toque el lector
     */
    @ReactMethod
    public void armPayment(String token, Promise promise) {
        try {
            // Verificar que NFC esté habilitado
            NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
            if (nfcAdapter == null) {
                promise.reject("NFC_NOT_SUPPORTED", "El dispositivo no soporta NFC");
                return;
            }
            
            if (!nfcAdapter.isEnabled()) {
                promise.reject("NFC_DISABLED", "NFC está deshabilitado");
                return;
            }
            
            // Configurar el token en el servicio HCE
            NFCHostApduService.setPaymentToken(token);
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("message", "Pago armado - Acerca el teléfono al lector");
            result.putString("token", token);
            
            promise.resolve(result);
            
            // Enviar evento a JS indicando que el pago está listo
            sendEvent("onPaymentArmed", result);
            
        } catch (Exception e) {
            promise.reject("ARM_PAYMENT_ERROR", "Error al armar pago: " + e.getMessage());
        }
    }
    
    /**
     * Desactiva el pago limpiando el token
     */
    @ReactMethod
    public void disarmPayment(Promise promise) {
        try {
            NFCHostApduService.clearPaymentToken();
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("message", "Pago cancelado");
            
            promise.resolve(result);
            
            // Enviar evento a JS
            sendEvent("onPaymentDisarmed", result);
            
        } catch (Exception e) {
            promise.reject("DISARM_PAYMENT_ERROR", "Error al cancelar pago: " + e.getMessage());
        }
    }
    
    /**
     * Verifica si el servicio HCE está listo para procesar pagos
     */
    @ReactMethod
    public void isPaymentReady(Promise promise) {
        try {
            boolean isReady = NFCHostApduService.isServiceReady();
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("ready", isReady);
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("CHECK_READY_ERROR", "Error al verificar estado: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene información del adaptador NFC
     */
    @ReactMethod
    public void getNFCInfo(Promise promise) {
        try {
            NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
            
            WritableMap info = Arguments.createMap();
            info.putBoolean("supported", nfcAdapter != null);
            info.putBoolean("enabled", nfcAdapter != null && nfcAdapter.isEnabled());
            info.putBoolean("hceSupported", true); // HCE está disponible desde Android 4.4+
            
            promise.resolve(info);
        } catch (Exception e) {
            promise.reject("NFC_INFO_ERROR", "Error al obtener información NFC: " + e.getMessage());
        }
    }
    
    /**
     * [READER MODE] Inicia el modo lector para detectar dispositivos NFC (como tarjetas HCE)
     */
    @ReactMethod
    public void startReaderMode(double amount, Promise promise) {
        currentAmount = amount;
        Log.d(TAG, "Reader Mode iniciado con monto: " + amount);
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                promise.reject("ACTIVITY_ERROR", "No hay actividad activa");
                return;
            }
            
            if (nfcAdapter == null) {
                promise.reject("NFC_NOT_SUPPORTED", "El dispositivo no soporta NFC");
                return;
            }
            
            if (!nfcAdapter.isEnabled()) {
                promise.reject("NFC_DISABLED", "NFC está deshabilitado");
                return;
            }
            
            // Configurar flags para Reader Mode
            // NFC_A y NFC_B son los protocolos más comunes para HCE
            int flags = NfcAdapter.FLAG_READER_NFC_A | 
                       NfcAdapter.FLAG_READER_NFC_B |
                       NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK;
            
            Bundle options = new Bundle();
            options.putInt(NfcAdapter.EXTRA_READER_PRESENCE_CHECK_DELAY, 250);
            
            // Activar Reader Mode
            nfcAdapter.enableReaderMode(currentActivity, readerCallback, flags, options);
            
            Log.d(TAG, "Reader Mode activado - esperando dispositivo NFC");
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("message", "Reader mode activado");
            
            promise.resolve(result);
            
        } catch (Exception e) {
            promise.reject("READER_MODE_ERROR", "Error al iniciar Reader Mode: " + e.getMessage());
        }
    }
    
    /**
     * [READER MODE] Detiene el modo lector
     */
    @ReactMethod
    public void stopReaderMode(Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                promise.reject("ACTIVITY_ERROR", "No hay actividad activa");
                return;
            }
            
            if (nfcAdapter != null) {
                nfcAdapter.disableReaderMode(currentActivity);
                Log.d(TAG, "Reader Mode desactivado");
            }
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("message", "Reader mode detenido");
            
            promise.resolve(result);
            
        } catch (Exception e) {
            promise.reject("READER_MODE_ERROR", "Error al detener Reader Mode: " + e.getMessage());
        }
    }
    
    /**
     * Maneja la detección de un tag NFC en Reader Mode
     */
    private void handleTagDiscovered(Tag tag) {
        Log.d(TAG, "Tag NFC detectado");
        
        IsoDep isoDep = IsoDep.get(tag);
        if (isoDep == null) {
            Log.e(TAG, "El tag no soporta IsoDep");
            sendErrorEvent("El dispositivo NFC no es compatible");
            return;
        }
        
        try {
            // Conectar con el tag
            isoDep.connect();
            isoDep.setTimeout(5000); // 5 segundos de timeout
            Log.d(TAG, "Conectado al tag NFC");
            
            // PASO 1: Enviar comando SELECT AID (solo 7 bytes del AID)
            byte[] selectAid = new byte[] {
                0x00, // CLA
                (byte) 0xA4, // INS (SELECT)
                0x04, // P1 (Select by name)
                0x00, // P2 (First or only occurrence)
                0x07, // Lc (longitud del AID = 7 bytes)
                // AID: F0010203040506
                (byte) 0xF0, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
                0x00  // Le (longitud esperada de respuesta)
            };
            
            Log.d(TAG, "Enviando SELECT AID: F0010203040506");
            byte[] response1 = isoDep.transceive(selectAid);
            
            if (response1 == null || response1.length < 2) {
                Log.e(TAG, "Respuesta SELECT vacía");
                sendErrorEvent("Sin respuesta del dispositivo");
                isoDep.close();
                return;
            }
            
            int sw1 = response1[response1.length - 2] & 0xFF;
            int sw2 = response1[response1.length - 1] & 0xFF;
            Log.d(TAG, "Respuesta SELECT: SW=" + String.format("%02X%02X", sw1, sw2));
            
            if (sw1 != 0x90 || sw2 != 0x00) {
                Log.e(TAG, "SELECT AID falló - dispositivo no listo o AID no coincide");
                sendErrorEvent("El dispositivo no tiene un pago preparado");
                isoDep.close();
                return;
            }
            
            // Extraer el token de la respuesta del SELECT
            String token = extractTokenFromResponse(response1);
            
            if (token != null && !token.isEmpty()) {
                Log.d(TAG, "Token extraído: " + token);
                
                // PASO 2: Enviar el monto en un segundo comando (GET PROCESSING OPTIONS con monto)
                int amountCents = (int)(currentAmount * 100);
                byte[] sendAmount = new byte[] {
                    (byte) 0x80, // CLA (propietary)
                    (byte) 0xA8, // INS (GET PROCESSING OPTIONS)
                    0x00, // P1
                    0x00, // P2
                    0x04, // Lc (4 bytes de monto)
                    (byte)((amountCents >> 24) & 0xFF),
                    (byte)((amountCents >> 16) & 0xFF),
                    (byte)((amountCents >> 8) & 0xFF),
                    (byte)(amountCents & 0xFF),
                    0x00  // Le
                };
                
                Log.d(TAG, "Enviando monto: " + currentAmount + " (" + amountCents + " centavos)");
                byte[] response2 = isoDep.transceive(sendAmount);
                
                if (response2 != null && response2.length >= 2) {
                    sw1 = response2[response2.length - 2] & 0xFF;
                    sw2 = response2[response2.length - 1] & 0xFF;
                    Log.d(TAG, "Respuesta monto: SW=" + String.format("%02X%02X", sw1, sw2));
                }
                
                // Enviar evento con el token (el pago ya fue autorizado)
                WritableMap eventData = Arguments.createMap();
                eventData.putString("token", token);
                eventData.putDouble("amount", currentAmount);
                eventData.putBoolean("success", true);
                sendEvent("onNFCTagDetected", eventData);
                
            } else {
                Log.e(TAG, "No se pudo extraer token de la respuesta");
                sendErrorEvent("Token vacío - el dispositivo no tiene pago preparado");
            }
            
            isoDep.close();
            
        } catch (IOException e) {
            Log.e(TAG, "Error de comunicación NFC: " + e.getMessage());
            sendErrorEvent("Error de comunicación: " + e.getMessage());
        } catch (Exception e) {
            Log.e(TAG, "Error inesperado: " + e.getMessage());
            sendErrorEvent("Error inesperado: " + e.getMessage());
        }
    }
    
    /**
     * Extrae el token de pago de la respuesta APDU
     */
    private String extractTokenFromResponse(byte[] response) {
        // En una implementación real, aquí se parsearían los TLVs EMV
        // Por simplicidad, convertimos los bytes a string hexadecimal
        // y buscamos nuestro token personalizado
        
        if (response.length <= 2) {
            return "";
        }
        
        // Remover los últimos 2 bytes (status words)
        byte[] data = new byte[response.length - 2];
        System.arraycopy(response, 0, data, 0, data.length);
        
        // Convertir a string (nuestro HCE envía el token como string ASCII)
        try {
            String tokenStr = new String(data, "UTF-8").trim();
            // Limpiar caracteres no imprimibles
            tokenStr = tokenStr.replaceAll("[^\\x20-\\x7E]", "");
            return tokenStr;
        } catch (Exception e) {
            Log.e(TAG, "Error al extraer token: " + e.getMessage());
            return "";
        }
    }
    
    /**
     * Envía un evento de error a JavaScript
     */
    private void sendErrorEvent(String errorMessage) {
        WritableMap eventData = Arguments.createMap();
        eventData.putBoolean("success", false);
        eventData.putString("error", errorMessage);
        sendEvent("onNFCTagDetected", eventData);
    }
    
    /**
     * Envía eventos desde Java a JavaScript
     */
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}
