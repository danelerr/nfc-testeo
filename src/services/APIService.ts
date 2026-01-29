import { Card, Transaction, PaymentResponse } from '../types/nfc';

// Configurar la URL base de tu backend
// Para desarrollo local con ngrok: reemplaza con tu URL de ngrok
// Ejemplo: https://abc123.ngrok.io
let API_BASE_URL = 'http://10.0.2.2:3000'; // Para emulador Android
// let API_BASE_URL = 'http://localhost:3000'; // Para iOS simulator
// let API_BASE_URL = 'https://tu-url-ngrok.ngrok.io'; // Para dispositivo físico

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

class APIService {
  /**
   * Obtiene todas las tarjetas disponibles
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
   * Obtiene el token de una tarjeta específica
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
   * Autoriza un pago
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
   * Obtiene el saldo de una tarjeta
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
   * Obtiene el historial de transacciones
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

  /**
   * Actualiza la URL base del API (útil para cambiar entre localhost y ngrok)
   */
  setBaseURL(url: string) {
    API_BASE_URL = url;
  }

  /**
   * Verifica la conectividad con el backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/card-token`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new APIService();
