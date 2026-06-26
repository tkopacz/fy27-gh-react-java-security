import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import ProductsPage from './pages/ProductsPage';
import OrderPage from './pages/OrderPage';
import SecurityDemoPage from './pages/SecurityDemoPage';
import LoginPage from './pages/LoginPage';
import { VulnerableSearchPage } from './security-demo/VulnerableSearchPage';


function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/security-demo" element={<SecurityDemoPage />} />
        <Route path="/security-demo/search" element={<VulnerableSearchPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
