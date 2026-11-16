
const Database = require('better-sqlite3');
const path = require('node:path');

const db = new Database(
  path.join(__dirname, 'daily-diet.db')
);

// Ativa as chaves estrangeiras
db.pragma('foreign_keys = ON');

// Tabela de usuários
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Tabela de refeições
db.exec(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    is_on_diet INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  );
`);

console.log('Banco de dados conectado!');

module.exports = db;
