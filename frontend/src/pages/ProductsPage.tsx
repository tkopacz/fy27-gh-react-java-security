import ProductCard from '../components/ProductCard';
import useProducts from '../hooks/useProducts';

function ProductsPage() {
  const { data, loading, error, refetch } = useProducts();

  return (
    <section className="demo-box">
      <h2>Products</h2>
      <p className="muted">Browse the store catalog loaded from the Spring Boot backend.</p>
      <button type="button" onClick={() => refetch()} style={{ marginBottom: 16 }}>
        Refresh products
      </button>
      {loading ? <p>Loading products…</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="card-grid">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={() => undefined} />
        ))}
      </div>
    </section>
  );
}

export default ProductsPage;
