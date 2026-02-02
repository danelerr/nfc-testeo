export interface NFCInfo {
  supported: boolean;
  enabled: boolean;
  hceSupported: boolean;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface PaymentReadyStatus {
  ready: boolean;
}

export interface Card {
  id: string;
  cardNumber: string;
  lastFourDigits: string;
  token: string;
  balance: number;
  cardHolder: string;
  expiryDate: string;
  cardType: string;
}

// ============================================================
// TIPOS PARA MODO COMERCIANTE (NO RELACIONADO CON HCE)
// ============================================================
// Estas interfaces son para la funcionalidad de cobro,
// que es complementaria a la funcionalidad HCE real de pago

export interface MerchantAccount {
  id: string;
  accountNumber: string;
  accountType: 'Ahorros' | 'Corriente' | 'Nómina';
  balance: number;
  accountHolder: string;
  bankName: string;
}

export interface Transaction {
  id: string;
  amount: number;
  newBalance: number;
  timestamp: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transaction?: Transaction;
  transactionId?: string;
  newBalance?: number;
  error?: string;
}
