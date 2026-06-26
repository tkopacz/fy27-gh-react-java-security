import { fireEvent, render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('calls onSelect when clicked', () => {
    const handleSelect = vi.fn();
    render(<ProductCard product={{ id: 1, name: 'Demo', price: 50, imageUrl: '', inStock: true, descriptionHtml: 'demo' }} onSelect={handleSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /select demo/i }));
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('supports keyboard activation', () => {
    const handleSelect = vi.fn();
    render(<ProductCard product={{ id: 1, name: 'Demo', price: 50, imageUrl: '', inStock: true, descriptionHtml: 'demo' }} onSelect={handleSelect} />);

    fireEvent.keyDown(screen.getByRole('button', { name: /select demo/i }), { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith(1);
  });
});
