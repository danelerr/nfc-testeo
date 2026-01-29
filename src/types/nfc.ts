// Tipos TypeScript para el módulo NFC nativo

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
}
