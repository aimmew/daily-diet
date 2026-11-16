
import { useState } from 'react';
import { X } from 'lucide-react';

function MealForm({ meal, onSave, onClose }) {
  const [name, setName] = useState(meal?.name || '');
  const [description, setDescription] = useState(meal?.description || '');
  const [date, setDate] = useState(
    meal?.date
      ? meal.date.slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [isOnDiet, setIsOnDiet] = useState(
    meal ? meal.is_on_diet : true
  );

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      name,
      description,
      date,
      is_on_diet: isOnDiet
    });
  }

  return (
    <div className="modal-overlay">
      <section className="meal-form">
        <div className="form-heading">
          <h2>{meal ? 'Editar refeição' : 'Nova refeição'}</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nome da refeição</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Almoço"
            required
          />

          <label>Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva sua refeição"
            rows="3"
          />

          <label>Data e horário</label>
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />

          <label>Está dentro da dieta?</label>

          <div className="diet-options">
            <button
              type="button"
              className={isOnDiet ? 'selected-yes' : ''}
              onClick={() => setIsOnDiet(true)}
            >
              Sim
            </button>

            <button
              type="button"
              className={!isOnDiet ? 'selected-no' : ''}
              onClick={() => setIsOnDiet(false)}
            >
              Não
            </button>
          </div>

          <button className="save-button" type="submit">
            Salvar refeição
          </button>
        </form>
      </section>
    </div>
  );
}

export default MealForm;
