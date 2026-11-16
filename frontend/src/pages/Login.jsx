
import { useState } from 'react';
import { Utensils, Leaf } from 'lucide-react';
import api from '../services/api';

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Preencha seu nome e e-mail!');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/users/login', {
        name,
        email
      });

      onLogin(response.data.user);

    } catch (error) {
      console.error(error);
      alert('Não foi possível entrar no sistema.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <div className="logo">
          <Leaf size={32} />
          <h1>Daily Diet</h1>
        </div>

        <Utensils size={45} className="food-icon" />

        <h2>Bem-vindo!</h2>

        <p>
          Organize suas refeições e acompanhe
          seus hábitos alimentares.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Seu nome</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Seu e-mail</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Daily Diet'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
