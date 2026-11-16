
const express = require('express');
const router = express.Router();

const {
  createMeal,
  listMeals,
  getMeal,
  updateMeal,
  deleteMeal,
  getMetrics
} = require('../controllers/mealController');

const {
  identifyUser
} = require('../controllers/userController');

router.use(identifyUser);

router.get('/metrics', getMetrics);

router.post('/meals', createMeal);
router.get('/meals', listMeals);
router.get('/meals/:id', getMeal);
router.put('/meals/:id', updateMeal);
router.delete('/meals/:id', deleteMeal);

module.exports = router;
