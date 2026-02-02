const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos en memoria
const mockDatabase = {
  // ============================================================
  // DATOS PARA MODO PAGAR - FUNCIONALIDAD HCE (IMPORTANTE)
  // ============================================================
  // Estas tarjetas son usadas por el modo PAGAR que usa HCE real.
  // El dispositivo emula ser una tarjeta NFC y transmite el token.
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
  
  // ============================================================
  // DATOS PARA MODO COBRAR - NO RELACIONADO CON HCE
  // ============================================================
  // Estas cuentas son para el comerciante que recibe pagos.
  // Usa Reader Mode para leer tokens, no HCE.
  merchantAccounts: [
    {
      id: 'm1',
      accountNumber: '1234567890',
      accountType: 'Ahorros',
      balance: 50000.00,
      accountHolder: 'Comercio GanaMóvil',
      bankName: 'Banco GanaMóvil'
    },
    {
      id: 'm2',
      accountNumber: '0987654321',
      accountType: 'Corriente',
      balance: 125000.00,
      accountHolder: 'Comercio GanaMóvil',
      bankName: 'Banco GanaMóvil'
    },
    {
      id: 'm3',
      accountNumber: '5555666677',
      accountType: 'Nómina',
      balance: 35000.00,
      accountHolder: 'Comercio GanaMóvil',
      bankName: 'Banco Popular'
    }
  ],
  
  transactions: []
};

// ============================================================
// ENDPOINTS MODO PAGAR - FUNCIONALIDAD HCE (IMPORTANTE)
// ============================================================
// Estos endpoints sirven a la funcionalidad HCE real donde
// el dispositivo actúa como tarjeta NFC y transmite tokens.

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

// ============================================================
// ENDPOINTS MODO COBRAR - NO RELACIONADO CON HCE
// ============================================================
// Estos endpoints son para el modo comerciante que usa Reader Mode.
// NO están relacionados con la funcionalidad HCE que es lo importante.

// GET /merchant-accounts - Obtener cuentas del comerciante
app.get('/merchant-accounts', (req, res) => {
  const accounts = mockDatabase.merchantAccounts.map(account => ({
    id: account.id,
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    balance: account.balance,
    accountHolder: account.accountHolder,
    bankName: account.bankName
  }));

  res.json({
    success: true,
    accounts: accounts
  });
});

// POST /charge-payment - Procesar un cobro desde Reader Mode
app.post('/charge-payment', (req, res) => {
  const { token, amount, merchantAccountId } = req.body;

  // Validar parámetros
  if (!token || !amount || !merchantAccountId) {
    return res.status(400).json({
      success: false,
      message: 'Token, monto y cuenta de comerciante son requeridos'
    });
  }

  // Buscar la tarjeta del cliente por token
  const clientCard = mockDatabase.cards.find(c => c.token === token);
  if (!clientCard) {
    return res.status(404).json({
      success: false,
      message: 'Token del cliente inválido'
    });
  }

  // Buscar la cuenta del comerciante
  const merchantAccount = mockDatabase.merchantAccounts.find(a => a.id === merchantAccountId);
  if (!merchantAccount) {
    return res.status(404).json({
      success: false,
      message: 'Cuenta de comerciante no encontrada'
    });
  }

  // Validar saldo del cliente
  if (clientCard.balance < amount) {
    return res.status(400).json({
      success: false,
      message: 'El cliente no tiene saldo suficiente',
      clientBalance: clientCard.balance,
      requestedAmount: amount
    });
  }

  // Procesar la transferencia
  const previousClientBalance = clientCard.balance;
  const previousMerchantBalance = merchantAccount.balance;

  clientCard.balance -= amount;
  merchantAccount.balance += amount;

  // Registrar la transacción
  const transaction = {
    id: Date.now().toString(),
    type: 'charge',
    clientCardId: clientCard.id,
    clientToken: token,
    merchantAccountId: merchantAccountId,
    amount: amount,
    timestamp: new Date().toISOString(),
    previousClientBalance: previousClientBalance,
    newClientBalance: clientCard.balance,
    previousMerchantBalance: previousMerchantBalance,
    newMerchantBalance: merchantAccount.balance
  };

  mockDatabase.transactions.push(transaction);

  res.json({
    success: true,
    message: 'Cobro procesado exitosamente',
    transaction: {
      id: transaction.id,
      amount: amount,
      timestamp: transaction.timestamp,
      merchantNewBalance: merchantAccount.balance
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Mock NFC corriendo en puerto ${PORT}`);
  console.log(`Tarjetas disponibles: ${mockDatabase.cards.length}`);
  console.log(`Cuentas de comerciante: ${mockDatabase.merchantAccounts.length}`);
  console.log(`\nEndpoints HCE (IMPORTANTE - Modo Pagar):`);
  console.log(`GET  /card-token`);
  console.log(`GET  /card-token/:cardId`);
  console.log(`POST /authorize-payment`);
  console.log(`GET  /transactions`);
  console.log(`GET  /balance/:token`);
  console.log(`\nEndpoints Reader Mode (Modo Cobrar):`);
  console.log(`GET  /merchant-accounts`);
  console.log(`POST /charge-payment`);
});
