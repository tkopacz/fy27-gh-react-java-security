import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SecurityDemoPage from './SecurityDemoPage';

function renderInRouter() {
  return render(
    <MemoryRouter initialEntries={['/security-demo']}>
      <SecurityDemoPage />
    </MemoryRouter>
  );
}

describe('SecurityDemoPage', () => {
  it('renders the demo-only safety banner', () => {
    renderInRouter();
    expect(screen.getByText(/DEMO ONLY/i)).toBeInTheDocument();
  });

  it('shows all five CodeQL query labels', () => {
    renderInRouter();
    // js/xss appears twice (DOM XSS section + URL-param XSS section)
    expect(screen.getAllByText('js/xss').length).toBe(2);
    expect(screen.getByText('js/client-side-unvalidated-url-redirection')).toBeInTheDocument();
    expect(screen.getByText('js/clear-text-storage-of-sensitive-data')).toBeInTheDocument();
    expect(screen.getByText('js/prototype-pollution-utility')).toBeInTheDocument();
  });

  it('shows the open redirect interactive section', () => {
    renderInRouter();
    expect(screen.getByLabelText(/podatny redirect/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bezpieczny redirect/i)).toBeInTheDocument();
  });

  it('shows the token storage interactive section', () => {
    renderInRouter();
    expect(screen.getByLabelText(/zapisz token/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/odczytaj token/i)).toBeInTheDocument();
  });

  it('shows the prototype pollution interactive section', () => {
    renderInRouter();
    expect(screen.getByLabelText(/podatny merge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bezpieczny merge/i)).toBeInTheDocument();
  });

  it('shows the Java security demo card', () => {
    renderInRouter();
    expect(screen.getByText(/Java security demo/i)).toBeInTheDocument();
  });
});
