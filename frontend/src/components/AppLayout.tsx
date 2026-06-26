import { NavLink, Outlet } from 'react-router-dom';

/** Top-level shell shared by every route — header + nav + main content area. */
export function AppLayout() {
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
