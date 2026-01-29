const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos en memoria
const mockDatabase = {
  cards: [
    {
      id: '1',
      cardNumber: '4532015112830366',
      token: '1234567890123456',
      balance: 15000.00,
      cardHolder: 'Juan Pérez',
      expiryDate: '12/28',
      cardType: 'Débito'
    },
    {
      id: '2',
      cardNumber: '5425233430109903',
      token: '6543210987654321',
      balance: 8500.50,
      cardHolder: 'Juan Pérez',
      expiryDate: '06/27',
      cardType: 'Crédito'
    }
  ],
  transactions: []
};

// GET /card-token - Devuelve las tarjetas disponibles
app.get('/card-token', (req, res) => {
  const cards = mockDatabase.cards.map(card => ({
    id: card.id,
    cardNumber: card.cardNumber.replace(/(\d{4})/g, '$1 ').trim(),
    lastFourDigits: card.cardNumber.slice(-4),
    token: card.token,
    balance: card.balance,
    cardHolder: card.cardHolder,
    expiryDate: card.expiryDate,
    cardType: card.cardType
  }));

  res.json({
    success: true,
    cards: cards
  });
});

// GET /card-token/:cardId - Devuelve el token de una tarjeta específica
app.get('/card-token/:cardId', (req, res) => {
  const { cardId } = req.params;
  const card = mockDatabase.cards.find(c => c.id === cardId);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: 'Tarjeta no encontrada'
    });
  }

  res.json({
    success: true,
    token: card.token,
    balance: card.balance,
    cardNumber: card.cardNumber.slice(-4),
    cardType: card.cardType
  });
});

// POST /authorize-payment - Autoriza un pago
app.post('/authorize-payment', (req, res) => {
  const { token, amount, description } = req.body;

  // Validar que se envió el token y el monto
  if (!token || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Token y monto son requeridos'
    });
  }

  // Buscar la tarjeta por token
  const card = mockDatabase.cards.find(c => c.token === token);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: 'Token inválido'
    });
  }

  // Validar que haya saldo suficiente
  if (card.balance < amount) {
    return res.status(400).json({
      success: false,
      message: 'Saldo insuficiente',
      currentBalance: card.balance,
      requestedAmount: amount
    });
  }

  // Procesar el pago
  card.balance -= amount;

  // Registrar la transacción
  const transaction = {
    id: Date.now().toString(),
    cardId: card.id,
    token: token,
    amount: amount,
    description: description || 'Pago NFC',
    timestamp: new Date().toISOString(),
    previousBalance: card.balance + amount,
    newBalance: card.balance
  };

  mockDatabase.transactions.push(transaction);

  res.json({
    success: true,
    message: 'Pago autorizado',
    transaction: {
      id: transaction.id,
      amount: amount,
      newBalance: card.balance,
      timestamp: transaction.timestamp
    }
  });
});

// GET /transactions - Obtener historial de transacciones
app.get('/transactions', (req, res) => {
  res.json({
    success: true,
    transactions: mockDatabase.transactions.slice().reverse() // Más recientes primero
  });
});

// GET /balance/:token - Consultar saldo por token
app.get('/balance/:token', (req, res) => {
  const { token } = req.params;
  const card = mockDatabase.cards.find(c => c.token === token);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: 'Token inválido'
    });
  }

  res.json({
    success: true,
    balance: card.balance,
    cardType: card.cardType
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Mock NFC corriendo en puerto ${PORT}`);
  console.log(`Tarjetas disponibles: ${mockDatabase.cards.length}`);
  console.log(`Endpoints disponibles:`);
  console.log(`GET  /card-token`);
  console.log(`GET  /card-token/:cardId`);
  console.log(`POST /authorize-payment`);
  console.log(`GET  /transactions`);
  console.log(`GET  /balance/:token`);
});
