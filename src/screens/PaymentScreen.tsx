import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Card } from '../types/nfc';
import NFCService from '../services/NFCService';

interface PaymentScreenProps {
  card: Card;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export default function PaymentScreen({ card, onPaymentComplete, onCancel }: PaymentScreenProps) {
  const [isArmed, setIsArmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    checkNFCStatus();
  }, [checkNFCStatus]);

  useEffect(() => {
    if (isArmed) {
      startPulseAnimation();
    }
  }, [isArmed]);

  const checkNFCStatus = async () => {
    const nfcInfo = await NFCService.getNFCInfo();
    
    if (!nfcInfo.supported) {
      Alert.alert('NFC no soportado', 'Tu dispositivo no soporta NFC');
      onCancel();
      return;
    }

    if (!nfcInfo.enabled) {
      Alert.alert(
        'NFC Deshabilitado',
        '¿Deseas habilitar NFC?',
        [
          { text: 'Cancelar', onPress: onCancel, style: 'cancel' },
          { text: 'Ir a Ajustes', onPress: () => NFCService.openNFCSettings() },
        ]
      );
      return;
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleArmPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Armar el pago con el token de la tarjeta
      const result = await NFCService.armPayment(card.token);
      
      if (result.success) {
        setIsArmed(true);
        Alert.alert(
          '✅ Listo para Pagar',
          'Acerca tu teléfono al lector NFC para completar el pago',
          [{ text: 'Entendido' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      onCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (isArmed) {
      await NFCService.disarmPayment();
    }
    onCancel();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>💳 Pago NFC</Text>
        
        <View style={styles.cardInfo}>
          <Text style={styles.cardType}>{card.cardType}</Text>
          <Text style={styles.cardNumber}>•••• {card.lastFourDigits}</Text>
          <Text style={styles.balance}>
            Saldo: ${card.balance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {!isArmed ? (
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>
              📱 Presiona el botón para preparar tu pago NFC
            </Text>
            <TouchableOpacity
              style={[styles.armButton, isProcessing && styles.armButtonDisabled]}
              onPress={handleArmPayment}
              disabled={isProcessing}>
              <Text style={styles.armButtonText}>
                {isProcessing ? 'Preparando...' : '🚀 Preparar Pago'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nfcContainer}>
            <Animated.View
              style={[
                styles.nfcIcon,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}>
              <Text style={styles.nfcIconText}>📡</Text>
            </Animated.View>
            <Text style={styles.nfcText}>Acerca tu teléfono al lector NFC</Text>
            <Text style={styles.nfcSubtext}>
              El pago se procesará automáticamente
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  cardInfo: {
    backgroundColor: '#1A1F3A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D9FF',
  },
  cardType: {
    fontSize: 16,
    color: '#00D9FF',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  balance: {
    fontSize: 18,
    color: '#00FF88',
    fontWeight: 'bold',
  },
  instructionContainer: {
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#8F9BB3',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  armButton: {
    backgroundColor: '#00D9FF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  armButtonDisabled: {
    opacity: 0.6,
  },
  armButtonText: {
    color: '#0A0E27',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nfcContainer: {
    alignItems: 'center',
  },
  nfcIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1F3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#00D9FF',
  },
  nfcIconText: {
    fontSize: 60,
  },
  nfcText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  nfcSubtext: {
    fontSize: 16,
    color: '#8F9BB3',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3D71',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
