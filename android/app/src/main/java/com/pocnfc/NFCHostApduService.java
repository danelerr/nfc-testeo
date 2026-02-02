package com.pocnfc;

import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;
import android.util.Log;
import java.util.Arrays;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Servicio HCE (Host Card Emulation) para emular una tarjeta NFC
 * Este servicio responde a comandos APDU del lector (datáfono)
 */
public class NFCHostApduService extends HostApduService {
    
    private static final String TAG = "NFCHostApduService";
    
    // AID (Application ID) - Identificador que el datáfono busca
    // Para pruebas usamos un AID privado: F0010203040506
    private static final String AID = "F0010203040506";
    
    // Códigos de estado APDU
    private static final byte[] SUCCESS = hexStringToByteArray("9000");
    private static final byte[] FILE_NOT_FOUND = hexStringToByteArray("6A82");
    private static final byte[] INSTRUCTION_NOT_SUPPORTED = hexStringToByteArray("6D00");
    
    // Comandos APDU
    private static final String SELECT_APDU_HEADER = "00A40400";
    
    // Token que se enviará al lector (configurado desde React Native)
    private static String paymentToken = null;
    private static boolean isReady = false;
    private static ReactContext reactContext = null;
    private static double requestedAmount = 0.0;
    
    /**
     * Establece el contexto de React Native para enviar eventos
     */
    public static void setReactContext(ReactContext context) {
        reactContext = context;
        Log.d(TAG, "React context configurado");
    }
    
    /**
     * Configura el token de pago desde el módulo nativo
     */
    public static void setPaymentToken(String token) {
        paymentToken = token;
        isReady = true;
        Log.d(TAG, "Token configurado: " + token);
    }
    
    /**
     * Limpia el token después de una transacción
     */
    public static void clearPaymentToken() {
        paymentToken = null;
        isReady = false;
        Log.d(TAG, "Token limpiado");
    }
    
    /**
     * Verifica si el servicio está listo para procesar pagos
     */
    public static boolean isServiceReady() {
        return isReady && paymentToken != null;
    }
    
    @Override
    public byte[] processCommandApdu(byte[] commandApdu, Bundle extras) {
        Log.d(TAG, "Comando APDU recibido: " + bytesToHex(commandApdu));
        
        // Verificar si es un comando SELECT AID
        if (isSelectAidApdu(commandApdu)) {
            Log.d(TAG, "SELECT AID detectado");
            
            // Extraer el AID del comando
            byte[] aidBytes = extractAid(commandApdu);
            String receivedAid = bytesToHex(aidBytes);
            
            Log.d(TAG, "AID recibido: " + receivedAid);
            Log.d(TAG, "AID esperado: " + AID);
            
            // Verificar si el AID coincide con el nuestro
            if (receivedAid.equalsIgnoreCase(AID)) {
                Log.d(TAG, "AID coincide!");
                
                if (isReady && paymentToken != null) {
                    // Construir respuesta con el token + código de éxito
                    byte[] tokenBytes = paymentToken.getBytes();
                    byte[] response = new byte[tokenBytes.length + 2];
                    
                    // Copiar token
                    System.arraycopy(tokenBytes, 0, response, 0, tokenBytes.length);
                    
                    // Agregar código de éxito (90 00)
                    response[tokenBytes.length] = (byte) 0x90;
                    response[tokenBytes.length + 1] = (byte) 0x00;
                    
                    Log.d(TAG, "Enviando token: " + paymentToken);
                    
                    return response;
                } else {
                    Log.w(TAG, "Servicio no está listo o no hay token configurado");
                    Log.w(TAG, "isReady=" + isReady + ", paymentToken=" + (paymentToken != null ? "set" : "null"));
                    return FILE_NOT_FOUND;
                }
            } else {
                Log.w(TAG, "AID no coincide. Recibido: " + receivedAid + ", Esperado: " + AID);
                return FILE_NOT_FOUND;
            }
        }
        
        // Verificar si es un comando GET PROCESSING OPTIONS (con el monto)
        if (isGetProcessingOptionsApdu(commandApdu)) {
            Log.d(TAG, "GET PROCESSING OPTIONS detectado (contiene monto)");
            
            // Extraer el monto del comando (bytes 5-8)
            if (commandApdu.length >= 9) {
                int amountCents = ((commandApdu[5] & 0xFF) << 24) |
                                 ((commandApdu[6] & 0xFF) << 16) |
                                 ((commandApdu[7] & 0xFF) << 8) |
                                 (commandApdu[8] & 0xFF);
                requestedAmount = amountCents / 100.0;
                Log.d(TAG, "Monto recibido del terminal: " + requestedAmount + " Bs (" + amountCents + " centavos)");
                
                // Enviar evento a React Native con el monto
                sendAmountRequestEvent(requestedAmount);
                
                // Enviar evento de pago transmitido
                sendPaymentTransmittedEvent();
            }
            
            // Responder con éxito
            return SUCCESS;
        }
        
        // Para cualquier otro comando, devolver instrucción no soportada
        Log.w(TAG, "Comando no soportado: " + bytesToHex(commandApdu));
        return INSTRUCTION_NOT_SUPPORTED;
    }
    
    /**
     * Verifica si es un comando GET PROCESSING OPTIONS
     */
    private boolean isGetProcessingOptionsApdu(byte[] apdu) {
        return apdu.length >= 5 && 
               apdu[0] == (byte) 0x80 &&  // CLA (propietary)
               apdu[1] == (byte) 0xA8 &&  // INS (GPO)
               apdu[2] == (byte) 0x00 &&  // P1
               apdu[3] == (byte) 0x00;    // P2
    }
    
    @Override
    public void onDeactivated(int reason) {
        Log.d(TAG, "🔌 Servicio desactivado. Razón: " + reason);
        
        // Limpiar el token después de la desactivación
        clearPaymentToken();
        
        String reasonText;
        switch (reason) {
            case DEACTIVATION_LINK_LOSS:
                reasonText = "Pérdida de enlace NFC";
                break;
            case DEACTIVATION_DESELECTED:
                reasonText = "Aplicación deseleccionada";
                break;
            default:
                reasonText = "Desconocido";
                break;
        }
        
        Log.d(TAG, "Razón de desactivación: " + reasonText);
    }
    
    /**
     * Verifica si el comando es un SELECT AID
     */
    private boolean isSelectAidApdu(byte[] apdu) {
        return apdu.length >= 5 && 
               apdu[0] == (byte) 0x00 &&  // CLA
               apdu[1] == (byte) 0xA4 &&  // INS (SELECT)
               apdu[2] == (byte) 0x04 &&  // P1
               apdu[3] == (byte) 0x00;    // P2
    }
    
    /**
     * Extrae el AID del comando SELECT
     */
    private byte[] extractAid(byte[] apdu) {
        if (apdu.length < 5) {
            return new byte[0];
        }
        
        int aidLength = apdu[4] & 0xFF;
        if (apdu.length < 5 + aidLength) {
            return new byte[0];
        }
        
        return Arrays.copyOfRange(apdu, 5, 5 + aidLength);
    }
    
    /**
     * Convierte bytes a string hexadecimal
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }
    
    /**
     * Envía evento a React Native cuando el pago fue transmitido
     */
    private void sendPaymentTransmittedEvent() {
        if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
            WritableMap params = Arguments.createMap();
            params.putString("token", paymentToken);
            params.putDouble("amount", requestedAmount);
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onPaymentTransmitted", params);
            Log.d(TAG, "Evento 'onPaymentTransmitted' enviado a React Native");
        } else {
            Log.w(TAG, "No se pudo enviar evento - React context no disponible");
        }
    }
    
    /**
     * Envía evento a React Native con el monto solicitado por el terminal
     */
    private void sendAmountRequestEvent(double amount) {
        if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
            WritableMap params = Arguments.createMap();
            params.putDouble("amount", amount);
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onPaymentAmountRequested", params);
            Log.d(TAG, "Evento 'onPaymentAmountRequested' enviado con monto: " + amount);
        } else {
            Log.w(TAG, "No se pudo enviar evento de monto");
        }
    }
    
    /**
     * Convierte string hexadecimal a bytes
     */
    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }
}
