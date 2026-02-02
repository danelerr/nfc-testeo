import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Text, StyleSheet } from 'react-native';
import CardsScreen from './src/screens/CardsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import ChargeHomeScreen from './src/screens/ChargeHomeScreen';
import ChargeWaitingScreen from './src/screens/ChargeWaitingScreen';
import ChargeSuccessScreen from './src/screens/ChargeSuccessScreen';
import AccountSelectionScreen from './src/screens/AccountSelectionScreen';
import { PayStackParamList, ChargeStackParamList, TabParamList } from './src/types/navigation';


const PayStack = createNativeStackNavigator<PayStackParamList>();
const ChargeStack = createNativeStackNavigator<ChargeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function PayStackNavigator() {
  return (
    <PayStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAF9' },
        animation: 'slide_from_right',
      }}
    >
      <PayStack.Screen name="Cards" component={CardsScreen} />
      <PayStack.Screen name="Payment" component={PaymentScreen} />
      <PayStack.Screen name="Success" component={SuccessScreen} />
    </PayStack.Navigator>
  );
}

function ChargeStackNavigator() {
  return (
    <ChargeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAF9' },
        animation: 'slide_from_right',
      }}
    >
      <ChargeStack.Screen name="AccountSelection" component={AccountSelectionScreen} />
      <ChargeStack.Screen name="ChargeHome" component={ChargeHomeScreen} />
      <ChargeStack.Screen name="ChargeWaiting" component={ChargeWaitingScreen} />
      <ChargeStack.Screen name="ChargeSuccess" component={ChargeSuccessScreen} />
    </ChargeStack.Navigator>
  );
}

// Iconos de las tabs
const PayIcon = () => <Text style={styles.textTab}>💳</Text>;
const ChargeIcon = () => <Text style={styles.textTab}>💵</Text>;

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'}/>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4A9B7F',
            tabBarInactiveTintColor: '#8A9A96',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopColor: '#D4E5DE',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen 
            name="PayMode" 
            component={PayStackNavigator}
            options={{
              title: 'Pagar',
              tabBarIcon: PayIcon,
            }}
          />
          <Tab.Screen 
            name="ChargeMode" 
            component={ChargeStackNavigator}
            options={{
              title: 'Cobrar',
              tabBarIcon: ChargeIcon,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  textTab: { fontSize: 24 }
})

export default App;
