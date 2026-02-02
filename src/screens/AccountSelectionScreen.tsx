import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountSelectionScreenProps } from '../types/navigation';
import { MerchantAccount } from '../types/nfc';
import APIService from '../services/APIService';

// ============================================================
// PANTALLA DE SELECCIÓN DE CUENTA (NO RELACIONADO CON HCE)
// ============================================================
// Esta pantalla es para el modo comerciante/cobro.
// NO está relacionada con la funcionalidad HCE que es lo importante.
// HCE solo se usa en el modo PAGAR (CardsScreen, PaymentScreen)

export default function AccountSelectionScreen({ navigation }: AccountSelectionScreenProps) {
  const [accounts, setAccounts] = useState<MerchantAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMerchantAccounts();
    
    // Recargar las cuentas cuando la pantalla recibe foco
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('AccountSelectionScreen recibió foco, recargando cuentas...');
      loadMerchantAccounts();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadMerchantAccounts = async () => {
    try {
      const accountsData = await APIService.getMerchantAccounts();
      setAccounts(accountsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las cuentas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (account: MerchantAccount) => {
    navigation.navigate('ChargeHome', { account });
  };

  const renderAccountItem = ({ item }: { item: MerchantAccount }) => (
    <Pressable
      style={styles.accountCard}
      onPress={() => handleSelectAccount(item)}
    >
      <View style={styles.accountHeader}>
        <Text style={styles.bankName}>{item.bankName}</Text>
        <Text style={styles.accountType}>{item.accountType}</Text>
      </View>
      
      <View style={styles.accountInfo}>
        <Text style={styles.accountHolder}>{item.accountHolder}</Text>
        <Text style={styles.accountNumber}>
          **** {item.accountNumber.slice(-4)}
        </Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balance}>
          ${item.balance.toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4A9B7F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona una Cuenta</Text>
        <Text style={styles.subtitle}>
          Elige la cuenta donde recibirás el pago
        </Text>
      </View>

      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E3A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A6B66',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E3A',
  },
  accountType: {
    fontSize: 14,
    color: '#4A9B7F',
    fontWeight: '500',
    backgroundColor: '#E8F5F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accountInfo: {
    marginBottom: 16,
  },
  accountHolder: {
    fontSize: 15,
    color: '#5A6B66',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#8A9A96',
    fontFamily: 'monospace',
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E8F5F0',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#5A6B66',
  },
  balance: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A9B7F',
  },
});
