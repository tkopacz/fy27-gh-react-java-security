import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createOrder } from '../services/ordersApi';
import type { ApiErrorResponse } from '../types/ApiError';

const schema = z.object({
  productId: z.coerce.number({ invalid_type_error: 'Wybierz produkt' }).int().positive('Wybierz produkt'),
  quantity: z.coerce.number({ invalid_type_error: 'Podaj liczbę' }).int().min(1, 'Minimalna ilość to 1'),
  firstName: z.string().trim().min(1, 'Imię jest wymagane'),
  lastName: z.string().trim().min(1, 'Nazwisko jest wymagane'),
  email: z.string().trim().email('Wpisz poprawny adres e-mail'),
  phone: z.string().trim().min(1, 'Telefon jest wymagany'),
  deliveryAddress: z.string().trim().min(1, 'Adres dostawy jest wymagany')
});

type OrderFormValues = z.infer<typeof schema>;

function OrderForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<OrderFormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: OrderFormValues) => {
    setSuccessMessage(null);
    setFormError(null);

    try {
      const response = await createOrder(values);
      setSuccessMessage(`${response.message} (${response.orderId})`);
    } catch (error) {
      const apiError = error as ApiErrorResponse & { fieldErrors?: Array<{ field: string; message: string }> };
      if (apiError.fieldErrors?.length) {
        apiError.fieldErrors.forEach((fieldError) => {
          setError(fieldError.field as keyof OrderFormValues, {
            type: 'server',
            message: fieldError.message
          });
        });
        return;
      }
      setFormError('Nie udało się wysłać zamówienia. Spróbuj ponownie.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Produkt
        <input type="number" {...register('productId')} />
        {errors.productId ? <span className="error">{errors.productId.message}</span> : null}
      </label>
      <label>
        Ilość
        <input type="number" {...register('quantity')} />
        {errors.quantity ? <span className="error">{errors.quantity.message}</span> : null}
      </label>
      <label>
        Imię
        <input {...register('firstName')} />
        {errors.firstName ? <span className="error">{errors.firstName.message}</span> : null}
      </label>
      <label>
        Nazwisko
        <input {...register('lastName')} />
        {errors.lastName ? <span className="error">{errors.lastName.message}</span> : null}
      </label>
      <label>
        E-mail
        <input {...register('email')} />
        {errors.email ? <span className="error">{errors.email.message}</span> : null}
      </label>
      <label>
        Telefon
        <input {...register('phone')} />
        {errors.phone ? <span className="error">{errors.phone.message}</span> : null}
      </label>
      <label>
        Adres dostawy
        <textarea {...register('deliveryAddress')} />
        {errors.deliveryAddress ? <span className="error">{errors.deliveryAddress.message}</span> : null}
      </label>
      {formError ? <p className="error">{formError}</p> : null}
      {successMessage ? <p className="success">{successMessage}</p> : null}
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Wysyłanie…' : 'Złóż zamówienie'}</button>
    </form>
  );
}

export default OrderForm;
