# Backend Mock - POC NFC GanaMóvil

Backend de prueba para simular el Core Bancario en la POC de pagos NFC.

## 🚀 Instalación

```bash
cd backend
npm install
```

## 📱 Ejecutar

```bash
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

## 🌐 Exponer con ngrok (para pruebas en dispositivo)

```bash
ngrok http 3000
```

Copia la URL HTTPS que te da ngrok y úsala en la app móvil.

## 📡 Endpoints

### GET /card-token
Obtiene todas las tarjetas disponibles con sus tokens.

**Respuesta:**
```json
{
  "success": true,
  "cards": [
    {
      "id": "1",
      "cardNumber": "4532 0151 1283 0366",
      "lastFourDigits": "0366",
      "token": "1234567890123456",
      "balance": 15000.00,
      "cardHolder": "Juan Pérez",
      "expiryDate": "12/28",
      "cardType": "Débito"
    }
  ]
}
```

### GET /card-token/:cardId
Obtiene el token de una tarjeta específica.

**Respuesta:**
```json
{
  "success": true,
  "token": "1234567890123456",
  "balance": 15000.00,
  "cardNumber": "0366",
  "cardType": "Débito"
}
```

### POST /authorize-payment
Autoriza un pago y descuenta del saldo.

**Body:**
```json
{
  "token": "1234567890123456",
  "amount": 150.50,
  "description": "Pago en comercio"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Pago autorizado",
  "transaction": {
    "id": "1234567890",
    "amount": 150.50,
    "newBalance": 14849.50,
    "timestamp": "2026-01-26T10:30:00.000Z"
  }
}
```

### GET /transactions
Obtiene el historial de transacciones.

### GET /balance/:token
Consulta el saldo de una tarjeta por su token.

## 💾 Base de Datos

Los datos se almacenan en memoria (se pierden al reiniciar el servidor). Para producción, usar una base de datos real.

## 🧪 Pruebas con curl

```bash
# Obtener tarjetas
curl http://localhost:3000/card-token

# Autorizar pago
curl -X POST http://localhost:3000/authorize-payment \
  -H "Content-Type: application/json" \
  -d '{"token":"1234567890123456","amount":50.00,"description":"Test"}'
```
