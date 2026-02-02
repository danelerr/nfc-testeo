import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CardsScreenProps } from '../types/navigation';
import { Card } from '../types/nfc';
import APIService from '../services/APIService';

// ============================================================
// PANTALLA DE SELECCIÓN DE TARJETAS - FUNCIONALIDAD HCE (IMPORTANTE)
// ============================================================
// Esta pantalla es parte del flujo HCE real.
// El usuario selecciona qué tarjeta usar para pagar.
// HCE emula esta tarjeta cuando el dispositivo toca un lector.

export default function CardsScreen({ navigation }: CardsScreenProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
    
    // Recargar las tarjetas cuando la pantalla recibe foco
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('CardsScreen recibió foco, recargando tarjetas...');
      loadCards();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const cardsData = await APIService.getCards();
      setCards(cardsData);
    } catch (err: any) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = ({ item }: { item: Card }) => (
    <Pressable 
      style={styles.card}
      onPress={() => navigation.navigate('Payment', { card: item })}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{item.cardType}</Text>
        <Text style={styles.cardNumber}>•••• {item.lastFourDigits}</Text>
      </View>
      <Text style={styles.cardHolder}>{item.cardHolder}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.expiryDate}>Vence: {item.expiryDate}</Text>
        <Text style={styles.balance}>
          ${item.balance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A9B7F" />
        <Text style={styles.loadingText}>Cargando tarjetas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}> {error}</Text>
        <Pressable style={styles.retryButton} onPress={loadCards}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POC NFC</Text>
      <Text style={styles.subtitle}>Selecciona una tarjeta para pagar</Text>
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E3A',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7C78',
    marginBottom: 20,
    fontWeight: '400',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4E5DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardType: {
    fontSize: 12,
    color: '#4A9B7F',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardNumber: {
    fontSize: 18,
    color: '#2C3E3A',
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardHolder: {
    fontSize: 16,
    color: '#6B7C78',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryDate: {
    fontSize: 14,
    color: '#8A9A96',
  },
  balance: {
    fontSize: 20,
    color: '#2D7A5F',
    fontWeight: '700',
  },
  loadingText: {
    color: '#6B7C78',
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#D64545',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A9B7F',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
