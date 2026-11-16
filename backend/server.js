
const express = require('express');
const cors = require('cors');

require('./src/database/database');

const userRoutes = require('./src/routes/userRoutes');
const mealRoutes = require('./src/routes/mealRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(mealRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API Daily Diet!'
  });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
