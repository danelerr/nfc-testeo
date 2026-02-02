import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Vibration,
} from 'react-native';
import { ChargeSuccessScreenProps } from '../types/navigation';

export default function ChargeSuccessScreen({ route, navigation }: ChargeSuccessScreenProps) {
  const { amount, transactionId, newBalance } = route.params;

  useEffect(() => {
    // Vibración de éxito al montar
    Vibration.vibrate([0, 200, 100, 200]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.statusText}>OK</Text>
        </View>

        <Text style={styles.title}>Cobro Exitoso</Text>
        <Text style={styles.subtitle}>El pago se proceso correctamente</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Monto Cobrado</Text>
          <Text style={styles.amount}>
            ${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Nuevo Saldo</Text>
          <Text style={styles.accountName}>
            ${newBalance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>ID de Transaccion</Text>
          <Text style={styles.token}>{transactionId}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Pago recibido por NFC</Text>
          <Text style={styles.infoText}>Transaccion completada</Text>
          <Text style={styles.infoText}>Operacion segura</Text>
        </View>
      </View>

      <Pressable style={styles.doneButton} onPress={() => navigation.navigate('AccountSelection')}>
        <Text style={styles.doneButtonText}>Finalizar</Text>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    color: '#6B7C78',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#fe1f01',
    marginVertical: 20,
    textAlign: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9DCDB7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  errorIcon: {
    backgroundColor: '#FFB4AB',
  },
  statusText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E3A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7C78',
    marginBottom: 40,
    textAlign: 'center',
  },
  amountContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4E5DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7C78',
    marginBottom: 8,
    fontWeight: '500',
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2D7A5F',
  },
  accountInfo: {
    backgroundColor: '#E8F5F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C4E0D3',
  },
  accountLabel: {
    fontSize: 12,
    color: '#5A6B66',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E3A',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: '#4A9B7F',
    fontFamily: 'monospace',
  },
  tokenContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4E5DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tokenLabel: {
    fontSize: 14,
    color: '#6B7C78',
    marginBottom: 8,
    fontWeight: '500',
  },
  token: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E3A',
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: '#E8F5F0',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#C4E0D3',
  },
  infoText: {
    fontSize: 14,
    color: '#4A9B7F',
    marginBottom: 8,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#4A9B7F',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
