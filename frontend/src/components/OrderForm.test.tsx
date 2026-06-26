import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OrderForm from './OrderForm';
import { createOrder } from '../services/ordersApi';

vi.mock('../services/ordersApi', () => ({
  createOrder: vi.fn()
}));

const mockedCreateOrder = vi.mocked(createOrder);

describe('OrderForm', () => {
  it('submits a valid order', async () => {
    mockedCreateOrder.mockResolvedValue({ orderId: 'ORD-123', status: 'CONFIRMED', message: 'Order received' });

    render(<OrderForm />);
    fireEvent.input(screen.getByLabelText(/produkt/i), { target: { value: '1' } });
    fireEvent.input(screen.getByLabelText(/ilość/i), { target: { value: '2' } });
    fireEvent.input(screen.getByLabelText(/imię/i), { target: { value: 'Ada' } });
    fireEvent.input(screen.getByLabelText(/nazwisko/i), { target: { value: 'Lovelace' } });
    fireEvent.input(screen.getByLabelText(/e-mail/i), { target: { value: 'ada@example.com' } });
    fireEvent.input(screen.getByLabelText(/telefon/i), { target: { value: '123456789' } });
    fireEvent.input(screen.getByLabelText(/adres dostawy/i), { target: { value: '10 Downing Street' } });

    fireEvent.click(screen.getByRole('button', { name: /złóż zamówienie/i }));

    await waitFor(() => expect(mockedCreateOrder).toHaveBeenCalled());
  });
});
