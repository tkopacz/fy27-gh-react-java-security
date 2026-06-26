import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import OrderPage from './pages/OrderPage';
import SecurityDemoPage from './pages/SecurityDemoPage';
import LoginPage from './pages/LoginPage';
import { Outlet } from 'react-router-dom';
import { VulnerableSearchPage } from './security-demo/VulnerableSearchPage';

function AppLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>React + Java Security Demo</h1>
          <p>Customer-friendly storefront with frontend and backend security examples.</p>
        </div>
        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/order">Order</NavLink>
          <NavLink to="/security-demo">Security demo</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

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
