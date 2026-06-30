import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'
import CarCard from '../components/CarCard'

function Home() {
  const [cars, setCars] = useState([])
  const [brands, setBrands] = useState([])
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/cars/').then(res => setCars(res.data.slice(0, 8)))
    API.get('/brands/').then(res => setBrands(res.data))
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    navigate(`/cars?q=${query}`)
  }

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="container">
          <h1>Найди своё <span>идеальное авто</span></h1>
          <p>Лучшие автомобили премиум класса в Кыргызстане</p>

          <form onSubmit={handleSearch} className="search-bar">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск по марке или модели..."
            />
            <button type="submit">🔍 Найти</button>
          </form>
        </div>
      </div>

      <div className="container page">
        {/* Бренды */}
        <h2 className="mb-16 fw-bold">Бренды</h2>
        <div className="flex gap-12 mb-24" style={{ flexWrap: 'wrap' }}>
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => navigate(`/cars?brand=${brand.id}`)}
              className="btn btn-ghost"
            >
              {brand.logo ? (
                <img src={`http://localhost:8000${brand.logo}`}
                  style={{ height: '20px', objectFit: 'contain' }} />
              ) : null}
              {brand.name}
              <span className="badge badge-info">{brand.cars_count}</span>
            </button>
          ))}
        </div>

        {/* Свежие авто */}
        <div className="flex-between mb-16">
          <h2 className="fw-bold">Свежие поступления</h2>
          <Link to="/cars" className="btn btn-outline btn-sm">
            Смотреть все →
          </Link>
        </div>

        <div className="grid-4">
          {cars.map(car => <CarCard key={car.id} car={car} />)}
        </div>
      </div>
    </div>
  )
}

export default Home