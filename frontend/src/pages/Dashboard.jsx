
import { useEffect, useState } from 'react';
import {
  Utensils,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  LogOut,
  Pencil,
  Trash2,
  LayoutDashboard,
  ClipboardList,
  Leaf
} from 'lucide-react';

import api from '../services/api';
import MealForm from '../components/MealForm';
import MealDetails from '../components/MealDetails';

function Dashboard({ user, onLogout }) {
  const [metrics, setMetrics] = useState({
    totalMeals: 0,
    mealsInsideDiet: 0,
    mealsOutsideDiet: 0,
    bestDietSequence: 0
  });

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [search, setSearch] = useState('');

  async function loadData() {
    try {
      const config = {
        headers: { 'x-user-id': user.id }
      };

      const [metricsResponse, mealsResponse] = await Promise.all([
        api.get('/metrics', config),
        api.get('/meals', config)
      ]);

      setMetrics(metricsResponse.data);
      setMeals(mealsResponse.data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar os dados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user.id]);

  async function handleSaveMeal(mealData) {
    try {
      const config = {
        headers: { 'x-user-id': user.id }
      };

      if (editingMeal) {
        await api.put(`/meals/${editingMeal.id}`, mealData, config);
      } else {
        await api.post('/meals', mealData, config);
      }

      setShowForm(false);
      setEditingMeal(null);
      await loadData();

      alert('Refeição salva com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Não foi possível salvar a refeição.');
    }
  }

  async function handleDeleteMeal(id) {
    if (!window.confirm('Deseja excluir esta refeição?')) return;

    try {
      await api.delete(`/meals/${id}`, {
        headers: { 'x-user-id': user.id }
      });

      setSelectedMeal(null);
      await loadData();
      alert('Refeição excluída com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir refeição.');
    }
  }

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(search.toLowerCase()) ||
    (meal.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">

      {/* MENU LATERAL */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <Leaf size={27} />
          <span>Daily<span className="logo-light">Diet</span></span>
        </div>

        <span className="sidebar-label">MENU</span>

        <nav className="sidebar-nav">
          <button className="sidebar-link active">
            <LayoutDashboard size={20} />
            <span>Início</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              document.getElementById('meals')?.scrollIntoView({
                behavior: 'smooth'
              })
            }
          >
            <ClipboardList size={20} />
            <span>Refeições</span>
          </button>
        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user.name}</strong>
              <span>Minha conta</span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={onLogout}>
            <LogOut size={19} />
            <span>Sair</span>
          </button>

        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">

        <header className="top-header">
          <div>
            <span className="welcome-label">SEU CONTROLE DIÁRIO</span>
            <h1>Olá, {user.name}! 🌱</h1>
            <p>Vamos acompanhar suas refeições de hoje?</p>
          </div>

          <div className="header-date">
            <span>HOJE</span>
            <strong>
              {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </strong>
          </div>
        </header>

        {/* MÉTRICAS */}
        <section className="metrics-grid">

          <article className="metric-card">
            <div className="metric-icon green-icon">
              <Utensils size={21} />
            </div>
            <span>Total de refeições</span>
            <strong>{metrics.totalMeals}</strong>
            <small>Refeições registradas</small>
          </article>

          <article className="metric-card">
            <div className="metric-icon lime-icon">
              <CheckCircle size={21} />
            </div>
            <span>Dentro da dieta</span>
            <strong>{metrics.mealsInsideDiet}</strong>
            <small>Refeições adequadas</small>
          </article>

          <article className="metric-card">
            <div className="metric-icon red-icon">
              <XCircle size={21} />
            </div>
            <span>Fora da dieta</span>
            <strong>{metrics.mealsOutsideDiet}</strong>
            <small>Refeições fora do plano</small>
          </article>

          <article className="metric-card featured-metric">
            <div className="metric-icon dark-icon">
              <TrendingUp size={21} />
            </div>
            <span>Melhor sequência</span>
            <strong>{metrics.bestDietSequence}</strong>
            <small>Refeições consecutivas na dieta</small>
          </article>

        </section>

        {/* BANNER COM IMAGEM */}
        <section className="activity-banner">

          <div className="banner-content">
            <span>PEQUENOS PASSOS, GRANDES RESULTADOS</span>

            <h2>
              Cuide da sua alimentação
              <br />
              um dia de cada vez.
            </h2>

            <p>
              Registre suas refeições e acompanhe sua evolução.
            </p>

            <button onClick={() => {
              setEditingMeal(null);
              setShowForm(true);
            }}>
              <Plus size={18} />
              Registrar refeição
            </button>
          </div>

          <div className="banner-image-container">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700"
              alt="Salada saudável com vegetais frescos"
              className="banner-image"
            />
          </div>

        </section>

        {/* LISTA DE REFEIÇÕES */}
        <section className="meals-section redesigned-meals" id="meals">

          <div className="new-meals-heading">
            <div>
              <span className="section-eyebrow">SEU HISTÓRICO</span>
              <h2>Minhas refeições</h2>
              <p>Todas as suas refeições em um só lugar.</p>
            </div>

            <button
              className="new-meal-button"
              onClick={() => {
                setEditingMeal(null);
                setShowForm(true);
              }}
            >
              <Plus size={19} />
              Nova refeição
            </button>
          </div>

          <div className="meal-search">
            <input
              type="text"
              placeholder="Pesquisar refeição..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="empty-state">Carregando refeições...</p>
          ) : filteredMeals.length === 0 ? (
            <div className="empty-state">
              <Utensils size={38} />

              <h3>
                {meals.length === 0
                  ? 'Nenhuma refeição registrada'
                  : 'Nenhuma refeição encontrada'}
              </h3>

              <p>
                {meals.length === 0
                  ? 'Comece registrando sua primeira refeição!'
                  : 'Tente pesquisar por outro nome.'}
              </p>
            </div>
          ) : (
            <div className="redesigned-meal-list">

              {filteredMeals.map(meal => (
                <article className="redesigned-meal-item" key={meal.id}>

                  <button
                    className="meal-main-info"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    <div className="meal-symbol">
                      <Utensils size={21} />
                    </div>

                    <div className="meal-text">
                      <strong>{meal.name}</strong>
                      <span>{meal.description || 'Sem descrição'}</span>
                      <small>
                        {new Date(meal.date).toLocaleString('pt-BR')}
                      </small>
                    </div>
                  </button>

                  <div className="redesigned-meal-actions">

                    <span className={
                      meal.is_on_diet ? 'diet-yes' : 'diet-no'
                    }>
                      {meal.is_on_diet
                        ? 'Dentro da dieta'
                        : 'Fora da dieta'}
                    </span>

                    <button
                      className="action-button"
                      title="Editar"
                      onClick={() => {
                        setEditingMeal(meal);
                        setShowForm(true);
                      }}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="action-button delete-action"
                      title="Excluir"
                      onClick={() => handleDeleteMeal(meal.id)}
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>

        <footer className="dashboard-footer">
          <span>Daily Diet © 2026</span>
          <span>
            Cuide de você. Cuide da sua alimentação. <Leaf size={14} />
          </span>
        </footer>

      </main>

      {/* FORMULÁRIO */}
      {showForm && (
        <MealForm
          meal={editingMeal}
          onSave={handleSaveMeal}
          onClose={() => {
            setShowForm(false);
            setEditingMeal(null);
          }}
        />
      )}

      {/* DETALHES */}
      {selectedMeal && (
        <MealDetails
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}

    </div>
  );
}

export default Dashboard;
