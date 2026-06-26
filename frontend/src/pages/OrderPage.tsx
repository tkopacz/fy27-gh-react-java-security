import OrderForm from '../components/OrderForm';

function OrderPage() {
  return (
    <section className="demo-box">
      <h2>Order</h2>
      <p className="muted">Submit a valid order to see how the React form handles backend validation.</p>
      <OrderForm />
    </section>
  );
}

export default OrderPage;
