import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { Card, MerchantAccount } from './nfc';

export type TabParamList = {
  PayMode: undefined;
  ChargeMode: undefined;
};

export type PayStackParamList = {
  Cards: undefined;
  Payment: { card: Card };
  Success: { amount: number; newBalance: number; transactionId?: string };
};

// ============================================================
// NAVEGACIÓN MODO COBRAR (NO RELACIONADO CON HCE)
// ============================================================

export type ChargeStackParamList = {
  AccountSelection: undefined;
  ChargeHome: { account: MerchantAccount };
  ChargeWaiting: { amount: number; account: MerchantAccount };
  ChargeSuccess: { amount: number; transactionId: string; newBalance: number };
};

export type CardsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PayStackParamList, 'Cards'>,
  BottomTabScreenProps<TabParamList>
>;

export type PaymentScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PayStackParamList, 'Payment'>,
  BottomTabScreenProps<TabParamList>
>;

export type SuccessScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PayStackParamList, 'Success'>,
  BottomTabScreenProps<TabParamList>
>;

export type AccountSelectionScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ChargeStackParamList, 'AccountSelection'>,
  BottomTabScreenProps<TabParamList>
>;

export type ChargeHomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ChargeStackParamList, 'ChargeHome'>,
  BottomTabScreenProps<TabParamList>
>;

export type ChargeWaitingScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ChargeStackParamList, 'ChargeWaiting'>,
  BottomTabScreenProps<TabParamList>
>;

export type ChargeSuccessScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ChargeStackParamList, 'ChargeSuccess'>,
  BottomTabScreenProps<TabParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends PayStackParamList, ChargeStackParamList {}
  }
}
