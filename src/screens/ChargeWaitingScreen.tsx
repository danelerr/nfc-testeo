import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ChargeWaitingScreenProps } from '../types/navigation';
import NFCService from '../services/NFCService';
import NFCLogo from '../components/NFCLogo';
import APIService from '../services/APIService';

// ============================================================
// PANTALLA DE ESPERA READER MODE (NO RELACIONADO CON HCE)
// ============================================================

export default function ChargeWaitingScreen({ route, navigation }: ChargeWaitingScreenProps): React.JSX.Element {
  const { amount, account } = route.params;
  const processingRef = useRef(false);

  const checkNFCStatus = useCallback(async () => {
    const nfcInfo = await NFCService.getNFCInfo();

    if (!nfcInfo.supported) {
      Alert.alert('NFC no soportado', 'Tu dispositivo no soporta NFC', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      return false;
    }

    if (!nfcInfo.enabled) {
      Alert.alert('NFC Deshabilitado', 'Debes habilitar NFC para continuar', [
        { text: 'Cancelar', onPress: () => navigation.goBack(), style: 'cancel' },
        { text: 'Ir a Ajustes', onPress: () => {
          NFCService.openNFCSettings();
          navigation.goBack();
        }},
      ]);
      return false;
    }
    
    return true;
  }, [navigation]);

  const startReaderMode = useCallback(async () => {
    // Verificar que NFC esté disponible antes de continuar
    const nfcAvailable = await checkNFCStatus();
    if (!nfcAvailable) {
      return;
    }
    
    try {
      await NFCService.startReaderMode(amount);
      console.log('Reader Mode activado con monto:', amount);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      navigation.goBack();
    }
  }, [amount, navigation, checkNFCStatus]);

  const stopReaderMode = useCallback(async () => {
    try {
      await NFCService.stopReaderMode();
    } catch (error) {
      console.error('Error stopping reader mode:', error);
    }
  }, []);

  const handleCancel = useCallback(() => {
    stopReaderMode();
    navigation.goBack();
  }, [stopReaderMode, navigation]);
  
  /**
   * Maneja la detección de un dispositivo NFC (cliente con HCE)
   */
  const handleNFCTagDetected = useCallback(async (token: string) => {
    // Evitar procesamiento duplicado
    if (processingRef.current) {
      console.log('Ya se está procesando un pago, ignorando evento duplicado');
      return;
    }
    
    processingRef.current = true;
    
    try {
      console.log('Dispositivo NFC detectado con token:', token);
      
      // Llamar al backend para procesar el cargo con el merchantAccountId
      const result = await APIService.processCharge(token, amount, account.id);
      
      if (result.success) {
        console.log('Pago procesado exitosamente:', result.transactionId);
        
        // Detener Reader Mode antes de navegar
        await stopReaderMode();
        
        // Navegar a la pantalla de éxito con los datos de la transacción
        navigation.replace('ChargeSuccess', {
          amount: amount,
          transactionId: result.transactionId || Date.now().toString(),
          newBalance: result.newBalance || (account.balance + amount),
        });
      } else {
        throw new Error(result.error || 'Error al procesar el pago');
      }
    } catch (error: any) {
      console.error('Error al procesar pago NFC:', error);
      Alert.alert(
        'Error en el pago',
        error.message || 'No se pudo procesar el pago',
        [
          { text: 'Reintentar', onPress: () => {
            processingRef.current = false;
          }},
          { text: 'Cancelar', onPress: handleCancel },
        ]
      );
      processingRef.current = false;
    }
  }, [amount, account, navigation, stopReaderMode, handleCancel]);

  useEffect(() => {
    // Suscribirse al evento de detección NFC
    const subscription = NFCService.addListener('onNFCTagDetected', (event: any) => {
      console.log('Evento onNFCTagDetected recibido:', event);
      
      if (event.success && event.token) {
        handleNFCTagDetected(event.token);
      } else if (event.error) {
        Alert.alert('Error NFC', event.error);
        processingRef.current = false;
      }
    });
    
    // Iniciar Reader Mode
    startReaderMode();

    return () => {
      // Limpiar al desmontar
      subscription.remove();
      stopReaderMode();
    };
  }, [startReaderMode, stopReaderMode, handleNFCTagDetected]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Esperando pago</Text>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Monto a cobrar</Text>
          <Text style={styles.amount}>
            ${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.nfcContainer}>
          <View style={styles.nfcIcon}>
            <NFCLogo size={80} color="#4A9B7F" />
          </View>
          <ActivityIndicator size="large" color="#4A9B7F" style={styles.loader} />
          <Text style={styles.nfcText}>Esperando dispositivo del cliente</Text>
          <Text style={styles.nfcSubtext}>
            El cliente debe acercar su teléfono para pagar
          </Text>
        </View>
      </View>

      <Pressable style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E3A',
    textAlign: 'center',
    marginBottom: 40,
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4E5DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7C78',
    marginBottom: 8,
    fontWeight: '600',
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2D7A5F',
  },
  nfcContainer: {
    alignItems: 'center',
  },
  nfcIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#9DCDB7',
  },
  loader: {
    marginBottom: 16,
  },
  nfcText: {
    fontSize: 20,
    color: '#2C3E3A',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  nfcSubtext: {
    fontSize: 16,
    color: '#6B7C78',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4E5DE',
  },
  cancelButtonText: {
    color: '#6B7C78',
    fontSize: 18,
    fontWeight: '600',
  },
});
