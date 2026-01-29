package com.pocnfc;

import android.app.Activity;
import android.nfc.NfcAdapter;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import androidx.annotation.Nullable;

/**
 * Módulo Bridge para comunicar React Native con el servicio NFC nativo
 */
public class NFCModule extends ReactContextBaseJavaModule {
    
    private static final String TAG = "NFCModule";
    private final ReactApplicationContext reactContext;
    
    public NFCModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    
    @Override
    public String getName() {
        return "NFCModule";
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
     * Envía eventos desde Java a JavaScript
     */
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}
