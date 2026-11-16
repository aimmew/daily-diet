
import { X, Utensils, CalendarDays, Clock, CheckCircle, XCircle } from 'lucide-react';

function MealDetails({ meal, onClose }) {
  if (!meal) return null;

  const date = new Date(meal.date);

  return (
    <div className="modal-overlay">
      <section className="meal-form details-card">
        <div className="form-heading">
          <h2>Detalhes da refeição</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="details-icon">
          <Utensils size={32} />
        </div>

        <h2 className="details-name">{meal.name}</h2>

        <p className="details-description">
          {meal.description || 'Sem descrição.'}
        </p>

        <div className="details-info">
          <p>
            <CalendarDays size={18} />
            {date.toLocaleDateString('pt-BR')}
          </p>

          <p>
            <Clock size={18} />
            {date.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>

          <p>
            {meal.is_on_diet
              ? <CheckCircle size={18} />
              : <XCircle size={18} />}
            {meal.is_on_diet
              ? 'Dentro da dieta'
              : 'Fora da dieta'}
          </p>
        </div>

        <button className="save-button" onClick={onClose}>
          Fechar
        </button>
      </section>
    </div>
  );
}

export default MealDetails;
