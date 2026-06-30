import { Link } from 'react-router-dom'

function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card car-card">
        {car.image_url ? (
          <img src={car.image_url} alt={car.model} className="car-card-img" />
        ) : (
          <div className="car-card-img-placeholder">🚗</div>
        )}

        <div className="car-card-body">
          {/* Бренд */}
          <p className="car-card-brand">
            {car.brand_detail?.name}
          </p>

          {/* Модель */}
          <h3 className="car-card-title">{car.model}</h3>

          {/* Цена */}
          <p className="car-card-price">
            {car.price.toLocaleString()} сом
          </p>

          {/* Характеристики */}
          <div className="car-card-specs">
            <span className="car-card-spec">{car.year}</span>
            <span className="car-card-spec">{car.body_type_display}</span>
            <span className="car-card-spec">{car.transmission_display}</span>
            <span className="car-card-spec">{car.engine_volume}л</span>
          </div>

          {/* Пробег */}
          <p className="text-muted mt-8" style={{ fontSize: '13px' }}>
            📍 {car.mileage === 0 ? 'Новый' : `${car.mileage.toLocaleString()} км`}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default CarCard