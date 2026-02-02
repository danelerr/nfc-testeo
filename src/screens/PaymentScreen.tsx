import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { PaymentScreenProps } from '../types/navigation';
import NFCService from '../services/NFCService';
import APIService from '../services/APIService';
import NFCLogo from '../components/NFCLogo';

// ============================================================
// PANTALLA DE PAGO NFC - FUNCIONALIDAD HCE (IMPORTANTE)
// ============================================================
// Esta es la pantalla más importante del proyecto.
// Aquí se activa HCE (Host Card Emulation) para que el
// dispositivo actúe como tarjeta NFC y transmita el token.
// Ver: NFCHostApduService.java para la implementación nativa.

export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
  const { card } = route.params;
  const [isArmed, setIsArmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState<number | null>(null);
  const processingPaymentRef = useRef(false);

  // Maneja el evento cuando el pago fue transmitido por HCE
  // NOTA: El backend es llamado SOLO por el comerciante (ChargeWaitingScreen)
  // Aquí solo mostramos el éxito al cliente
  const handlePaymentTransmitted = useCallback(async (eventData?: any) => {
    // Prevenir procesamiento duplicado
    if (processingPaymentRef.current) {
      console.log('Ya se esta procesando un pago, ignorando evento duplicado');
      return;
    }
    processingPaymentRef.current = true;

    console.log('Pago transmitido por HCE');
    setIsProcessing(true);

    try {
      // El monto viene del evento que envió el HCE
      const amount = eventData?.amount || requestedAmount || 0;
      
      console.log('Pago transmitido por monto:', amount);
      
      // Vibración de éxito: dos pulsos cortos
      Vibration.vibrate([0, 200, 100, 200]);

      // Desarmar HCE
      await NFCService.disarmPayment();

      // Navegar a pantalla de éxito
      // El nuevo balance se calculará restando el monto del balance actual
      navigation.replace('Success', {
        amount,
        transactionId: Date.now().toString(),
        newBalance: card.balance - amount,
      });
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un error');
      await NFCService.disarmPayment();
      setIsArmed(false);
      processingPaymentRef.current = false;
    } finally {
      setIsProcessing(false);
    }
  }, [card.balance, navigation, requestedAmount]);

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

  useEffect(() => {
    checkNFCStatus();
    
    // Suscribirse al evento de pago transmitido
    const subscription = NFCService.addListener(
      'onPaymentTransmitted',
      handlePaymentTransmitted
    );
    
    // Suscribirse al evento de monto solicitado por el terminal
    // Solo actualizar el estado, no mostrar modal (el pago ya fue autorizado al acercar)
    const amountSubscription = NFCService.addListener('onPaymentAmountRequested', (event: any) => {
      console.log('Monto solicitado por el terminal:', event.amount);
      setRequestedAmount(event.amount);
    });
    
    return () => {
      subscription.remove();
      amountSubscription.remove();
    };
  }, [checkNFCStatus, handlePaymentTransmitted]);

  const handleArmPayment = async () => {
    // Verificar que NFC esté disponible antes de continuar
    const nfcAvailable = await checkNFCStatus();
    if (!nfcAvailable) {
      return;
    }
    
    try {
      setIsProcessing(true);

      // Armar el pago con el token de la tarjeta
      const result = await NFCService.armPayment(card.token);

      if (result.success) {
        setIsArmed(true);
        Alert.alert(
          'Listo para Pagar',
          'Acerca tu telefono al lector NFC para completar el pago',
          [{ text: 'Entendido' }],
        );
      } else {
        Alert.alert('Error', 'No se pudo preparar el pago');
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      navigation.goBack();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (isArmed) {
      await NFCService.disarmPayment();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Pago NFC</Text>

        <View style={styles.cardInfo}>
          <Text style={styles.cardType}>{card.cardType}</Text>
          <Text style={styles.cardNumber}>•••• {card.lastFourDigits}</Text>
          <Text style={styles.balance}>
            Saldo: $
            {card.balance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {requestedAmount !== null && isArmed && (
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Monto solicitado</Text>
            <Text style={styles.amount}>
              ${requestedAmount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        )}

        {!isArmed ? (
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>
              Presiona el boton para preparar tu pago NFC
            </Text>
            <Pressable
              style={[
                styles.armButton,
                isProcessing && styles.armButtonDisabled,
              ]}
              onPress={handleArmPayment}
              disabled={isProcessing}
            >
              <Text style={styles.armButtonText}>
                {isProcessing ? 'Preparando...' : 'Preparar Pago'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.nfcContainer}>
            <View style={styles.nfcIcon}>
              <NFCLogo size={80} color="#4A9B7F" />
            </View>
            {isProcessing ? (
              <>
                <ActivityIndicator size="large" color="#4A9B7F" style={styles.loader} />
                <Text style={styles.nfcText}>Procesando pago...</Text>
                <Text style={styles.nfcSubtext}>Espera un momento</Text>
              </>
            ) : (
              <>
                <Text style={styles.nfcText}>Acerca tu telefono al lector NFC</Text>
                <Text style={styles.nfcSubtext}>
                  El pago se procesara automaticamente
                </Text>
              </>
            )}
          </View>
        )}
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
  cardInfo: {
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
  cardType: {
    fontSize: 14,
    color: '#4A9B7F',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardNumber: {
    fontSize: 24,
    color: '#2C3E3A',
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 12,
  },
  balance: {
    fontSize: 18,
    color: '#2D7A5F',
    fontWeight: '700',
  },
  amountCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 24,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  amountLabel: {
    fontSize: 14,
    color: '#8B7500',
    marginBottom: 8,
    fontWeight: '600',
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#B8860B',
  },
  instructionContainer: {
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#6B7C78',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  armButton: {
    backgroundColor: '#4A9B7F',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  armButtonDisabled: {
    opacity: 0.5,
  },
  armButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
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
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#9DCDB7',
  },
  loader: {
    marginVertical: 16,
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
    color: '#fe1f01',
    fontSize: 18,
    fontWeight: '600',
  },
});
