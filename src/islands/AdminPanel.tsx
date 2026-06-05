import { useEffect, useState, useCallback } from 'react';

type Review = {
  id: string;
  name: string;
  email: string;
  company?: string;
  rating: number;
  message: string;
  date: string;
  approved?: boolean;
  rejected?: boolean;
};

type Stats = { total: number; approved: number; pending: number };

const API_URL = 'https://alamia.es/api/admin/resenas';

const AdminPanel = () => {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, pending: 0 });
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadReviews = useCallback(async (authToken: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${authToken.trim()}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 401) {
        setError('Token inválido');
        setAuthenticated(false);
        localStorage.removeItem('admin_token');
        return;
      }
      const data = await response.json();
      setAllReviews(data.all || []);
      setStats(data.stats || { total: 0, approved: 0, pending: 0 });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      setAuthenticated(true);
      loadReviews(saved);
    }
  }, [loadReviews]);

  const handleAuthenticate = () => {
    const clean = token.trim().replace(/\s+/g, '');
    if (!clean || !/^[0-9a-fA-F]+$/.test(clean)) {
      setError('Token inválido');
      return;
    }
    localStorage.setItem('admin_token', clean);
    setAuthenticated(true);
    loadReviews(clean);
  };

  const handleModerate = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reviewId }),
      });
      if (!response.ok) throw new Error('Error al moderar');
      await loadReviews(token);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getFiltered = (): Review[] => {
    let reviews = allReviews;
    if (currentTab === 'pending') reviews = reviews.filter((r) => !r.approved && !r.rejected);
    else if (currentTab === 'approved') reviews = reviews.filter((r) => r.approved);

    if (search) {
      const s = search.toLowerCase();
      reviews = reviews.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s) ||
          r.message.toLowerCase().includes(s)
      );
    }
    if (ratingFilter) {
      reviews = reviews.filter((r) => r.rating === parseInt(ratingFilter));
    }
    return reviews;
  };

  const filtered = getFiltered();

  if (!authenticated) {
    return (
      <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', background: 'white', borderRadius: 12 }}>
        <h1 style={{ marginBottom: '1rem' }}>Panel de Administración</h1>
        <p style={{ marginBottom: '1rem', color: '#64748b' }}>Introduce tu token de administración</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token admin"
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '2px solid #e2e8f0', borderRadius: 8 }}
          aria-label="Token de administración"
        />
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
        <button className="btn btn-primary" type="button" onClick={handleAuthenticate}>
          Acceder
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Reseñas — Admin</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            localStorage.removeItem('admin_token');
            setAuthenticated(false);
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</div>
          <div>Total</div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{stats.approved}</div>
          <div>Aprobadas</div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</div>
          <div>Pendientes</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: 8 }}
          aria-label="Buscar reseñas"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: 8 }}
          aria-label="Filtrar por valoración"
        >
          <option value="">Todas las valoraciones</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} estrellas
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['pending', 'approved', 'all'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn ${currentTab === tab ? 'btn-primary' : ''}`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab === 'pending' ? 'Pendientes' : tab === 'approved' ? 'Aprobadas' : 'Todas'}
          </button>
        ))}
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {filtered.map((review) => (
        <div
          key={review.id}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 12,
            marginBottom: '1rem',
            borderLeft: `4px solid ${review.approved ? '#10b981' : '#f59e0b'}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div>
              <h3>{review.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{review.email}</p>
            </div>
            <div>{'★'.repeat(review.rating)}</div>
          </div>
          <p>{review.message}</p>
          {!review.approved && !review.rejected && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-primary" onClick={() => handleModerate(review.id, 'approve')}>
                Aprobar
              </button>
              <button
                type="button"
                className="btn"
                style={{ background: '#ef4444', color: 'white' }}
                onClick={() => handleModerate(review.id, 'reject')}
              >
                Rechazar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
