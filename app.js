const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_CONNECTION = process.env.DB_CONNECTION || 'not configured';

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
    database: DB_CONNECTION,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${DB_CONNECTION}`);
});
