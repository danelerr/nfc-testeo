import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { NFCModule } = NativeModules;
const nfcEventEmitter = new NativeEventEmitter(NFCModule);

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

class NFCService {
  private listeners: EmitterSubscription[] = [];

  /**
   * Verifica si el dispositivo soporta NFC
   */
  async isNFCSupported(): Promise<boolean> {
    try {
      return await NFCModule.isNFCSupported();
    } catch (error) {
      console.error('Error verificando soporte NFC:', error);
      return false;
    }
  }

  /**
   * Verifica si NFC está habilitado
   */
  async isNFCEnabled(): Promise<boolean> {
    try {
      return await NFCModule.isNFCEnabled();
    } catch (error) {
      console.error('Error verificando estado NFC:', error);
      return false;
    }
  }

  /**
   * Abre la configuración de NFC del sistema
   */
  async openNFCSettings(): Promise<boolean> {
    try {
      return await NFCModule.openNFCSettings();
    } catch (error) {
      console.error('Error abriendo configuración NFC:', error);
      return false;
    }
  }

  /**
   * Obtiene información completa del NFC
   */
  async getNFCInfo(): Promise<NFCInfo> {
    try {
      return await NFCModule.getNFCInfo();
    } catch (error) {
      console.error('Error obteniendo info NFC:', error);
      return { supported: false, enabled: false, hceSupported: false };
    }
  }

  /**
   * Arma el pago con el token especificado
   * El token estará disponible cuando el teléfono toque el lector
   */
  async armPayment(token: string): Promise<PaymentResult> {
    try {
      return await NFCModule.armPayment(token);
    } catch (error: any) {
      console.error('Error armando pago:', error);
      throw new Error(error.message || 'Error al armar pago NFC');
    }
  }

  /**
   * Desactiva el pago
   */
  async disarmPayment(): Promise<PaymentResult> {
    try {
      return await NFCModule.disarmPayment();
    } catch (error) {
      console.error('Error desarmando pago:', error);
      throw new Error('Error al cancelar pago NFC');
    }
  }

  /**
   * Verifica si el pago está listo
   */
  async isPaymentReady(): Promise<boolean> {
    try {
      const result = await NFCModule.isPaymentReady();
      return result.ready;
    } catch (error) {
      console.error('Error verificando estado de pago:', error);
      return false;
    }
  }

  /**
   * Suscribirse a eventos cuando el pago es armado
   */
  onPaymentArmed(callback: (data: PaymentResult) => void): EmitterSubscription {
    const listener = nfcEventEmitter.addListener('onPaymentArmed', callback);
    this.listeners.push(listener);
    return listener;
  }

  /**
   * Suscribirse a eventos cuando el pago es desarmado
   */
  onPaymentDisarmed(callback: (data: PaymentResult) => void): EmitterSubscription {
    const listener = nfcEventEmitter.addListener('onPaymentDisarmed', callback);
    this.listeners.push(listener);
    return listener;
  }

  /**
   * Suscribirse a eventos cuando el pago se completa
   */
  onPaymentComplete(callback: (data: any) => void): EmitterSubscription {
    const listener = nfcEventEmitter.addListener('onPaymentComplete', callback);
    this.listeners.push(listener);
    return listener;
  }

  /**
   * Limpia todos los listeners
   */
  removeAllListeners() {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }
}

export default new NFCService();
