import { Card, Transaction, PaymentResponse, MerchantAccount } from '../types/nfc';

const API_BASE_URL = 'https://backend-nfc.vercel.app/';

const TIMEOUT = 10000;

const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// ============================================================
// SERVICIO DE API - CON SEPARACIÓN HCE vs READER MODE
// ============================================================
// Los métodos marcados como HCE son los importantes para la 
// funcionalidad real de emulación de tarjetas NFC.
// Los métodos de comerciante son complementarios (Reader Mode).

class APIService {
  // ============================================================
  // MÉTODOS HCE (IMPORTANTE - Modo Pagar)
  // ============================================================
  // Estos métodos soportan la funcionalidad HCE real donde el
  // dispositivo actúa como tarjeta NFC y transmite tokens.

  /**
   * [HCE] Obtiene todas las tarjetas disponibles
   */
  async getCards(): Promise<Card[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/card-token`);
      const data = await response.json();
      
      if (data.success) {
        return data.cards;
      }
      throw new Error('Error al obtener tarjetas');
    } catch (error: any) {
      console.error('Error obteniendo tarjetas:', error);
      throw new Error(error.message || 'Error de conexión con el servidor');
    }
  }

  /**
   * [HCE] Obtiene el token de una tarjeta específica
   */
  async getCardToken(cardId: string): Promise<{ token: string; balance: number }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/card-token/${cardId}`);
      const data = await response.json();
      
      if (data.success) {
        return {
          token: data.token,
          balance: data.balance,
        };
      }
      throw new Error('Error al obtener token');
    } catch (error: any) {
      console.error('Error obteniendo token:', error);
      throw new Error(error.message || 'Error de conexión con el servidor');
    }
  }

  /**
   * [HCE] Autoriza un pago desde el dispositivo cliente
   */
  async authorizePayment(token: string, amount: number, description?: string): Promise<PaymentResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/authorize-payment`, {
        method: 'POST',
        body: JSON.stringify({
          token,
          amount,
          description: description || 'Pago NFC',
        }),
      });
      
      const data = await response.json();
      
      // Manejar errores específicos
      if (!response.ok) {
        throw new Error(data.message || 'Saldo insuficiente');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error autorizando pago:', error);
      throw new Error(error.message || 'Error al procesar el pago');
    }
  }

  /**
   * [HCE] Obtiene el saldo de una tarjeta
   */
  async getBalance(token: string): Promise<number> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/balance/${token}`);
      const data = await response.json();
      
      if (data.success) {
        return data.balance;
      }
      throw new Error('Error al obtener saldo');
    } catch (error: any) {
      console.error('Error obteniendo saldo:', error);
      throw new Error(error.message || 'Error de conexión con el servidor');
    }
  }

  /**
   * [HCE] Obtiene el historial de transacciones
   */
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/transactions`);
      const data = await response.json();
      
      if (data.success) {
        return data.transactions;
      }
      return [];
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      return [];
    }
  }

  // ============================================================
  // MÉTODOS READER MODE (NO RELACIONADO CON HCE)
  // ============================================================
  // Estos métodos son para el modo comerciante que usa Reader Mode.
  // NO están relacionados con la funcionalidad HCE que es lo importante.

  /**
   * [READER MODE] Obtiene las cuentas del comerciante
   */
  async getMerchantAccounts(): Promise<MerchantAccount[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/merchant-accounts`);
      const data = await response.json();
      
      if (data.success) {
        return data.accounts;
      }
      throw new Error('Error al obtener cuentas');
    } catch (error: any) {
      console.error('Error obteniendo cuentas de comerciante:', error);
      throw new Error(error.message || 'Error de conexión con el servidor');
    }
  }

  /**
   * [READER MODE] Procesa un cobro desde el dispositivo comerciante
   */
  async processCharge(
    token: string,
    amount: number,
    merchantAccountId: string
  ): Promise<PaymentResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/charge-payment`, {
        method: 'POST',
        body: JSON.stringify({
          token,
          amount,
          merchantAccountId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar cobro');
      }
      
      return {
        success: data.success,
        message: data.message || 'Cobro procesado exitosamente',
        transactionId: data.transaction?.id,
        newBalance: data.transaction?.merchantNewBalance,
        error: data.message,
      };
    } catch (error: any) {
      console.error('Error procesando cobro:', error);
      throw new Error(error.message || 'Error al procesar el cobro');
    }
  }

  /**
   * Verifica la conectividad con el backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/card-token`);
      return response.ok;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default new APIService();
