import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../api'
import CarCard from '../components/CarCard'

function CarList() {
  const [cars, setCars] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  // Берём фильтры из URL
  const query = searchParams.get('q') || ''
  const brand = searchParams.get('brand') || ''
  const body = searchParams.get('body') || ''
  const transmission = searchParams.get('transmission') || ''

  useEffect(() => {
    API.get('/brands/').then(res => setBrands(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (query) params.q = query
    if (brand) params.brand = brand
    if (body) params.body = body
    if (transmission) params.transmission = transmission

    API.get('/cars/', { params })
      .then(res => setCars(res.data))
      .finally(() => setLoading(false))
  }, [query, brand, body, transmission])

  const setFilter = (key, value) => {
    const current = Object.fromEntries(searchParams)
    if (value) {
      setSearchParams({ ...current, [key]: value })
    } else {
      delete current[key]
      setSearchParams(current)
    }
  }

  const clearFilters = () => setSearchParams({})

  return (
    <div className="container page">

      {/* Заголовок */}
      <div className="flex-between mb-24">
        <div>
          <h1 className="fw-bold">Каталог автомобилей</h1>
          <p className="text-muted mt-8">
            {loading ? 'Загрузка...' : `Найдено: ${cars.length} авто`}
          </p>
        </div>
        {(query || brand || body || transmission) && (
          <button onClick={clearFilters} className="btn btn-ghost btn-sm">
            ✕ Сбросить фильтры
          </button>
        )}
      </div>

      {/* Фильтры */}
      <div className="filters">

        {/* Бренд */}
        <div>
          <p className="form-label">Бренд</p>
          <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('brand', '')}
              className={`filter-chip ${!brand ? 'active' : ''}`}
            >
              Все
            </button>
            {brands.map(b => (
              <button
                key={b.id}
                onClick={() => setFilter('brand', b.id)}
                className={`filter-chip ${brand == b.id ? 'active' : ''}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Кузов */}
        <div>
          <p className="form-label">Кузов</p>
          <div className="flex gap-8">
            {[
              { value: '', label: 'Все' },
              { value: 'sedan', label: 'Седан' },
              { value: 'suv', label: 'Внедорожник' },
              { value: 'hatchback', label: 'Хэтчбек' },
              { value: 'coupe', label: 'Купе' },
              { value: 'wagon', label: 'Универсал' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter('body', opt.value)}
                className={`filter-chip ${body === opt.value ? 'active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Трансмиссия */}
        <div>
          <p className="form-label">Коробка</p>
          <div className="flex gap-8">
            {[
              { value: '', label: 'Все' },
              { value: 'auto', label: 'Автомат' },
              { value: 'manual', label: 'Механика' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter('transmission', opt.value)}
                className={`filter-chip ${transmission === opt.value ? 'active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Машины */}
      {loading ? (
        <div className="flex-center" style={{ padding: '60px' }}>
          <p className="text-muted">Загрузка...</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="flex-center text-center" style={{ padding: '60px', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '48px' }}>🚗</p>
          <p className="fw-bold">Ничего не найдено</p>
          <p className="text-muted">Попробуй изменить фильтры</p>
          <button onClick={clearFilters} className="btn btn-primary mt-16">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid-4">
          {cars.map(car => <CarCard key={car.id} car={car} />)}
        </div>
      )}
    </div>
  )
}

export default CarList