import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api'
import { useAuth } from '../context/AuthContext'

function CarDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  useEffect(() => {
    API.get(`/cars/${id}/`).then(res => {
      setCar(res.data)
      setLoading(false)
    })
    // Проверяем избранное
    if (token) {
      API.get('/favorites/').then(res => {
        setIsFavorite(res.data.some(f => f.car === parseInt(id)))
      })
    }
  }, [id])

  const toggleFavorite = async () => {
    if (!token) { navigate('/login'); return }
    setFavLoading(true)
    const res = await API.post(`/favorites/${id}/`)
    setIsFavorite(res.data.status === 'added')
    setFavLoading(false)
  }

  if (loading) return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <p className="text-muted">Загрузка...</p>
    </div>
  )

  if (!car) return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <p>Автомобиль не найден</p>
    </div>
  )

  return (
    <div className="container page">
      <Link to="/cars" className="btn btn-ghost btn-sm mb-24">
        ← Назад к каталогу
      </Link>

      <div className="grid-2" style={{ gap: '32px', alignItems: 'start' }}>

        {/* Левая — фото */}
        <div>
          {car.image_url ? (
            <img src={car.image_url} alt={car.model}
              style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }} />
          ) : (
            <div className="car-card-img-placeholder"
              style={{ height: '350px', borderRadius: '12px' }}>
              🚗
            </div>
          )}

          {/* Логотип бренда */}
          {car.brand_detail?.logo && (
            <div className="flex-center mt-16">
              <img src={`http://localhost:8000${car.brand_detail.logo}`}
                style={{ height: '40px', objectFit: 'contain' }} />
            </div>
          )}
        </div>

        {/* Правая — инфо */}
        <div>
          {/* Бренд + модель */}
          <p className="text-muted" style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {car.brand_detail?.name}
          </p>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>
            {car.model}
          </h1>

          {/* Цена */}
          <p style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent)', marginBottom: '20px' }}>
            {car.price.toLocaleString()} сом
          </p>

          {/* Статус */}
          <span className={`badge ${car.is_available ? 'badge-success' : 'badge-danger'} mb-24`}
            style={{ fontSize: '14px', padding: '6px 14px' }}>
            {car.is_available ? '✓ В наличии' : '✗ Нет в наличии'}
          </span>

          {/* Характеристики */}
          <div className="card mb-24">
            <div className="card-body">
              <h3 className="fw-bold mb-16">Характеристики</h3>
              <div className="grid-2" style={{ gap: '12px' }}>
                {[
                  { label: 'Год', value: car.year },
                  { label: 'Пробег', value: car.mileage === 0 ? 'Новый' : `${car.mileage.toLocaleString()} км` },
                  { label: 'Кузов', value: car.body_type_display },
                  { label: 'Коробка', value: car.transmission_display },
                  { label: 'Двигатель', value: `${car.engine_volume} л` },
                  { label: 'Цвет', value: car.color },
                ].map(spec => (
                  <div key={spec.label} style={{
                    padding: '12px',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <p className="text-muted" style={{ fontSize: '12px', marginBottom: '4px' }}>
                      {spec.label}
                    </p>
                    <p className="fw-bold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="card mb-24">
            <div className="card-body">
              <h3 className="fw-bold mb-16">Описание</h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                {car.description}
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-12">
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`btn btn-lg ${isFavorite ? 'btn-secondary' : 'btn-outline'}`}
              style={{ flex: 1 }}
            >
              {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
            </button>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              📞 Позвонить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail