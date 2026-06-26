import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SafeUserProfile } from '../security-demo/SafeUserProfile';
import { VulnerableUserProfile } from '../security-demo/VulnerableUserProfile';

interface DemoSectionProps {
  title: string;
  codeqlQuery: string;
  whatItShows: string;
  whyJavaCannotSee: string;
  children?: ReactNode;
}

function DemoSection({ title, codeqlQuery, whatItShows, whyJavaCannotSee, children }: DemoSectionProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{whatItShows}</p>
      <p className="muted">
        <strong>CodeQL:</strong> <code>{codeqlQuery}</code>
      </p>
      <p className="muted">
        <strong>Dlaczego backend Java tego nie widzi:</strong> {whyJavaCannotSee}
      </p>
      {children}
    </div>
  );
}

function SecurityDemoPage() {
  return (
    <section className="demo-box">
      <h2>Security demo</h2>
      <p className="muted">
        DEMO ONLY. Ta strona pokazuje ryzyka po stronie przegladarki. Zaden destrukcyjny payload nie uruchamia sie automatycznie.
      </p>
      <div className="card-grid">
        <DemoSection
          title="DOM XSS"
          codeqlQuery="js/xss"
          whatItShows="React renderuje atakujacemu kontrolowany HTML przez dangerouslySetInnerHTML."
          whyJavaCannotSee="Renderowanie DOM dzieje sie w przegladarce, poza zasiegiem skanu backendu Java."
        >
          <p className="muted">Wariant podatny:</p>
          <VulnerableUserProfile userHtml="<strong>Injected HTML</strong>" />
          <p className="muted">Wariant bezpieczny:</p>
          <SafeUserProfile userHtml="<strong>Safe text</strong>" />
        </DemoSection>

        <DemoSection
          title="XSS z parametru URL"
          codeqlQuery="js/xss"
          whatItShows="Wartosc q z window.location.search trafia bez sanityzacji do DOM."
          whyJavaCannotSee="Payload nie musi w ogole przejsc przez backend Java - zyje w adresie URL przegladarki."
        >
          <p>
            Otworz{' '}
            <Link to="/security-demo/search?q=%3Cimg%20src=x%20onerror=alert(1)%3E">
              /security-demo/search?q=&lt;img src=x onerror=alert(1)&gt;
            </Link>
          </p>
        </DemoSection>

        <DemoSection
          title="Client-side open redirect"
          codeqlQuery="js/client-side-unvalidated-url-redirection"
          whatItShows="Niezweryfikowany parametr next steruje window.location.href."
          whyJavaCannotSee="Przekierowanie wykonuje przegladarka na podstawie danych klienta, nie odpowiedzi serwera."
        />

        <DemoSection
          title="Cleartext token storage"
          codeqlQuery="js/clear-text-storage-of-sensitive-data"
          whatItShows="Token zapisany w localStorage jest dostepny dla dowolnego skryptu na stronie."
          whyJavaCannotSee="Backend Java nie kontroluje localStorage przegladarki - XSS moze odczytac token."
        />

        <DemoSection
          title="Prototype pollution"
          codeqlQuery="js/prototype-pollution-utility"
          whatItShows="Niebezpieczny recursive merge pozwala zatruc Object.prototype przez klucz __proto__."
          whyJavaCannotSee="Java nie ma globalnego Object.prototype, wiec ta klasa podatnosci nie istnieje po stronie backendu."
        />

        <div className="card">
          <h3>Java security demo</h3>
          <p>SQL injection, path traversal, deserializacja i XXE sa pokazane w backendzie.</p>
          <p className="muted">Zobacz docs/codeql-alerts-guide.md.</p>
        </div>
      </div>
    </section>
  );
}

export default SecurityDemoPage;
