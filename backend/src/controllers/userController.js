
const db = require('../database/database');

// Criar usuário
function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Nome e e-mail são obrigatórios.'
      });
    }

    const existingUser = db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).get(email);

    if (existingUser) {
      return res.status(409).json({
        error: 'Este e-mail já está cadastrado.'
      });
    }

    const result = db.prepare(`
      INSERT INTO users (name, email)
      VALUES (?, ?)
    `).run(name, email);

    return res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: {
        id: result.lastInsertRowid,
        name,
        email
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao criar usuário.'
    });
  }
}

// Entrar ou cadastrar usuário
function loginUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Nome e e-mail são obrigatórios.'
      });
    }

    let user = db.prepare(`
      SELECT id, name, email FROM users
      WHERE email = ?
    `).get(email);

    if (!user) {
      const result = db.prepare(`
        INSERT INTO users (name, email)
        VALUES (?, ?)
      `).run(name, email);

      user = {
        id: result.lastInsertRowid,
        name,
        email
      };
    }

    return res.json({
      message: 'Login realizado com sucesso!',
      user
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao realizar login.'
    });
  }
}

// Identificar usuário
function identifyUser(req, res, next) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({
      error: 'Usuário não identificado.'
    });
  }

  const user = db.prepare(
    'SELECT id, name, email FROM users WHERE id = ?'
  ).get(userId);

  if (!user) {
    return res.status(401).json({
      error: 'Usuário não encontrado.'
    });
  }

  req.user = user;
  next();
}

module.exports = {
  createUser,
  loginUser,
  identifyUser
};
