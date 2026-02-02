import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { ChargeHomeScreenProps } from '../types/navigation';


// ============================================================
// PANTALLA DE INGRESO DE MONTO
// ============================================================


export default function ChargeHomeScreen({ navigation, route }: ChargeHomeScreenProps) {
  const [amount, setAmount] = useState('');
  const { account } = route.params;

  const handleStartCharge = () => {
    const amountNum = parseFloat(amount);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    navigation.navigate('ChargeWaiting', { amount: amountNum, account });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Modo Comercio</Text>
        <Text style={styles.subtitle}>Genera una orden de cobro</Text>

        {/* Mostrar cuenta seleccionada */}
        <View style={styles.accountBox}>
          <Text style={styles.accountLabel}>Cuenta de destino</Text>
          <Text style={styles.accountName}>{account.bankName}</Text>
          <Text style={styles.accountNumber}>
            {account.accountType} **** {account.accountNumber.slice(-4)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Monto a cobrar</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currency}>BOB</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#8A9A96"
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>- El cliente acercara su dispositivo</Text>
          <Text style={styles.infoText}>- Se leera automaticamente el token</Text>
          <Text style={styles.infoText}>- El pago se procesara al instante</Text>
        </View>
      </View>

      <Pressable 
        style={[styles.chargeButton, !amount && styles.chargeButtonDisabled]}
        onPress={handleStartCharge}
        disabled={!amount}
      >
        <Text style={styles.chargeButtonText}>Iniciar Cobro</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7C78',
    textAlign: 'center',
    marginBottom: 24,
  },
  accountBox: {
    backgroundColor: '#E8F5F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C4E0D3',
  },
  accountLabel: {
    fontSize: 12,
    color: '#5A6B66',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E3A',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#4A9B7F',
    fontFamily: 'monospace',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#D4E5DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#6B7C78',
    marginBottom: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E3A',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E3A',
    padding: 0,
  },
  infoBox: {
    backgroundColor: '#E8F5F0',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C4E0D3',
  },
  infoText: {
    fontSize: 14,
    color: '#4A9B7F',
    marginBottom: 8,
    lineHeight: 20,
  },
  chargeButton: {
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
  chargeButtonDisabled: {
    opacity: 0.4,
  },
  chargeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
