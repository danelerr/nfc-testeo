import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface SuccessScreenProps {
  newBalance: number;
  amount: number;
  onDone: () => void;
}

export default function SuccessScreen({ newBalance, amount, onDone }: SuccessScreenProps) {
  const [scaleAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.successIcon,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Text style={styles.successEmoji}>✅</Text>
        </Animated.View>

        <Text style={styles.title}>¡Pago Exitoso!</Text>
        <Text style={styles.subtitle}>Tu transacción se procesó correctamente</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Monto Pagado</Text>
          <Text style={styles.amount}>
            ${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Nuevo Saldo</Text>
          <Text style={styles.balance}>
            ${newBalance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🎉 Tu pago NFC se completó sin problemas
          </Text>
          <Text style={styles.infoText}>
            📱 Tecnología: Host Card Emulation
          </Text>
          <Text style={styles.infoText}>
            🔒 Conexión: Segura y Encriptada
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneButtonText}>✨ Finalizar</Text>
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
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00FF88',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  successEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#8F9BB3',
    marginBottom: 40,
    textAlign: 'center',
  },
  amountContainer: {
    backgroundColor: '#1A1F3A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3D71',
  },
  amountLabel: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF3D71',
  },
  balanceContainer: {
    backgroundColor: '#1A1F3A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00FF88',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#00D9FF',
  },
  infoText: {
    fontSize: 14,
    color: '#00D9FF',
    marginBottom: 8,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#00D9FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  doneButtonText: {
    color: '#0A0E27',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
