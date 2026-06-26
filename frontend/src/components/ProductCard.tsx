import type { KeyboardEvent } from 'react';
import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onSelect: (id: number) => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(product.id);
    }
  };

  return (
    <article className="card" aria-labelledby={`product-${product.id}`}>
      <h2 id={`product-${product.id}`}>{product.name}</h2>
      <p className="muted">{product.descriptionHtml}</p>
      <p>{product.price.toFixed(2)} PLN</p>
      {product.inStock ? <span className="badge">In stock</span> : <span className="badge">Unavailable</span>}
      <button
        type="button"
        aria-label={`Select ${product.name}`}
        onClick={() => onSelect(product.id)}
        onKeyDown={handleKeyDown}
      >
        View details
      </button>
    </article>
  );
}

export default ProductCard;
