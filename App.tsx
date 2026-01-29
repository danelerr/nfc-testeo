/**
 * POC NFC - GanaMóvil
 * Aplicación de prueba de concepto para pagos NFC
 * 
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import CardsScreen from './src/screens/CardsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import { Card } from './src/types/nfc';

type Screen = 'cards' | 'payment' | 'success';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('cards');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    newBalance: 0,
  });

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);
    setCurrentScreen('payment');
  };

  const handlePaymentComplete = (amount: number, newBalance: number) => {
    setPaymentData({ amount, newBalance });
    setCurrentScreen('success');
  };

  const handleCancel = () => {
    setSelectedCard(null);
    setCurrentScreen('cards');
  };

  const handleDone = () => {
    setSelectedCard(null);
    setCurrentScreen('cards');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <SafeAreaView style={styles.container} edges={['top']}>
        {currentScreen === 'cards' && (
          <CardsScreen onSelectCard={handleSelectCard} />
        )}
        {currentScreen === 'payment' && selectedCard && (
          <PaymentScreen
            card={selectedCard}
            onPaymentComplete={() => handlePaymentComplete(50, selectedCard.balance - 50)}
            onCancel={handleCancel}
          />
        )}
        {currentScreen === 'success' && (
          <SuccessScreen
            amount={paymentData.amount}
            newBalance={paymentData.newBalance}
            onDone={handleDone}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
});

export default App;
