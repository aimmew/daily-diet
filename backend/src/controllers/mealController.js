
const db = require('../database/database');

// Cadastrar refeição
function createMeal(req, res) {
  try {
    const { name, description, date, is_on_diet } = req.body;

    if (!name || !date || typeof is_on_diet !== 'boolean') {
      return res.status(400).json({
        error: 'Nome, data e situação da dieta são obrigatórios.'
      });
    }

    const result = db.prepare(`
      INSERT INTO meals (name, description, date, is_on_diet, user_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, description || '', date, is_on_diet ? 1 : 0, req.user.id);

    return res.status(201).json({
      message: 'Refeição cadastrada!',
      meal: {
        id: result.lastInsertRowid,
        name,
        description,
        date,
        is_on_diet,
        user_id: req.user.id
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar refeição.' });
  }
}

// Listar refeições
function listMeals(req, res) {
  const meals = db.prepare(`
    SELECT * FROM meals
    WHERE user_id = ?
    ORDER BY date DESC
  `).all(req.user.id);

  return res.json(meals.map(meal => ({
    ...meal,
    is_on_diet: Boolean(meal.is_on_diet)
  })));
}

// Visualizar refeição
function getMeal(req, res) {
  const meal = db.prepare(`
    SELECT * FROM meals
    WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.id);

  if (!meal) {
    return res.status(404).json({
      error: 'Refeição não encontrada.'
    });
  }

  return res.json({
    ...meal,
    is_on_diet: Boolean(meal.is_on_diet)
  });
}

// Editar refeição
function updateMeal(req, res) {
  const { name, description, date, is_on_diet } = req.body;

  if (!name || !date || typeof is_on_diet !== 'boolean') {
    return res.status(400).json({
      error: 'Nome, data e situação da dieta são obrigatórios.'
    });
  }

  const meal = db.prepare(`
    SELECT id FROM meals
    WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.id);

  if (!meal) {
    return res.status(404).json({
      error: 'Refeição não encontrada.'
    });
  }

  db.prepare(`
    UPDATE meals
    SET name = ?, description = ?, date = ?, is_on_diet = ?
    WHERE id = ? AND user_id = ?
  `).run(
    name, description || '', date,
    is_on_diet ? 1 : 0,
    req.params.id, req.user.id
  );

  return res.json({
    message: 'Refeição atualizada com sucesso!'
  });
}

// Excluir refeição
function deleteMeal(req, res) {
  const result = db.prepare(`
    DELETE FROM meals
    WHERE id = ? AND user_id = ?
  `).run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: 'Refeição não encontrada.'
    });
  }

  return res.json({
    message: 'Refeição excluída com sucesso!'
  });
}

// Métricas do usuário
function getMetrics(req, res) {
  const meals = db.prepare(`
    SELECT is_on_diet, date FROM meals
    WHERE user_id = ?
    ORDER BY date ASC, id ASC
  `).all(req.user.id);

  const total = meals.length;

  const insideDiet = meals.filter(
    meal => meal.is_on_diet === 1
  ).length;

  const outsideDiet = total - insideDiet;

  let currentSequence = 0;
  let bestSequence = 0;

  for (const meal of meals) {
    if (meal.is_on_diet === 1) {
      currentSequence++;
      bestSequence = Math.max(bestSequence, currentSequence);
    } else {
      currentSequence = 0;
    }
  }

  return res.json({
    totalMeals: total,
    mealsInsideDiet: insideDiet,
    mealsOutsideDiet: outsideDiet,
    bestDietSequence: bestSequence
  });
}

module.exports = {
  createMeal,
  listMeals,
  getMeal,
  updateMeal,
  deleteMeal,
  getMetrics
};
