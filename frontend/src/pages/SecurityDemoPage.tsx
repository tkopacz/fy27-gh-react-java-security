import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SafeUserProfile } from '../security-demo/SafeUserProfile';
import { VulnerableUserProfile } from '../security-demo/VulnerableUserProfile';
import { redirectAfterLogin } from '../security-demo/VulnerableRedirect';
import { getSafeRedirectPath } from '../security-demo/SafeRedirect';
import { saveToken } from '../security-demo/VulnerableTokenStorage';
import { mergeObjects } from '../security-demo/VulnerableMerge';
import { mergeObjectsSafely } from '../security-demo/SafeMerge';

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

/**
 * Shows the vulnerable open redirect side-by-side with the safe variant.
 * The vulnerable button calls redirectAfterLogin() which reads window.location.search — since we're
 * on /security-demo there is no ?next= param, so the redirect silently does nothing unless the
 * presenter navigates to /security-demo?next=https://evil.example.com first.
 * The safe button uses getSafeRedirectPath and shows what it returns.
 */
function OpenRedirectDemo() {
  const [safeResult, setSafeResult] = useState<string | null>(undefined as unknown as null);
  const [vulnTriggered, setVulnTriggered] = useState(false);

  function handleVulnRedirect() {
    // DEMO ONLY - calls the intentionally vulnerable function so CodeQL sees actual usage
    setVulnTriggered(true);
    redirectAfterLogin(); // reads ?next= from window.location.search — no auto-navigation here since the param is absent
  }

  function handleSafeRedirect() {
    const raw = new URLSearchParams(window.location.search).get('next');
    const result = getSafeRedirectPath(raw);
    setSafeResult(result === null ? '(odrzucone — nie jest bezpieczną ścieżką)' : result);
  }

  return (
    <div>
      <p className="muted">
        Aby zademonstrować przekierowanie, przejdź do{' '}
        <code>/security-demo?next=https://evil.example.com</code> i kliknij przycisk podatny.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={handleVulnRedirect} aria-label="Podatny redirect — uruchom VulnerableRedirect.ts">
          Podatny redirect {vulnTriggered && '✓'}
        </button>
        <button onClick={handleSafeRedirect} aria-label="Bezpieczny redirect — użyj SafeRedirect.ts">
          Bezpieczny redirect
        </button>
      </div>
      {safeResult !== null && safeResult !== undefined && (
        <p className="muted">SafeRedirect zwrócił: <code>{safeResult}</code></p>
      )}
    </div>
  );
}

/**
 * Demonstrates localStorage token storage vs the secure HttpOnly-cookie recommendation.
 * Pressing "Store token" writes a placeholder to localStorage — no real credentials involved.
 */
function TokenStorageDemo() {
  const [stored, setStored] = useState(false);
  const [readBack, setReadBack] = useState<string | null>(null);

  function handleStore() {
    // DEMO ONLY - calls the intentionally vulnerable saveToken so CodeQL sees actual usage
    saveToken('demo-placeholder-token');
    setStored(true);
  }

  function handleRead() {
    setReadBack(localStorage.getItem('authToken') ?? '(brak)');
  }

  function handleClear() {
    localStorage.removeItem('authToken');
    setStored(false);
    setReadBack(null);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={handleStore} aria-label="Zapisz token w localStorage (podatny)">
          Zapisz token (localStorage) {stored && '✓'}
        </button>
        <button onClick={handleRead} aria-label="Odczytaj token z localStorage">
          Odczytaj token
        </button>
        <button onClick={handleClear} aria-label="Wyczyść token">
          Wyczyść
        </button>
      </div>
      {readBack !== null && (
        <p className="muted">localStorage[&apos;authToken&apos;] = <code>{readBack}</code></p>
      )}
      <p className="muted">
        Bezpieczna alternatywa: HttpOnly cookie ustawiane przez backend — JavaScript nie ma do niego dostępu.
      </p>
    </div>
  );
}

type JsonObject = Record<string, unknown>;

/**
 * Demonstrates prototype pollution: the vulnerable mergeObjects does not block __proto__ keys,
 * while mergeObjectsSafely rejects them. No destructive payload auto-runs — the user must
 * click the button to trigger the merge.
 */
function PrototypePollutionDemo() {
  const PAYLOAD = '{"__proto__": {"isAdmin": true}}';
  const [vulnResult, setVulnResult] = useState<string | null>(null);
  const [safeResult, setSafeResult] = useState<string | null>(null);

  function handleVulnMerge() {
    // DEMO ONLY - calls the intentionally vulnerable mergeObjects so CodeQL sees actual usage
    // We restore Object.prototype after the demo to avoid polluting the rest of the session.
    const source = JSON.parse(PAYLOAD) as JsonObject;
    const target: JsonObject = {};
    mergeObjects(target, source);
    // Check whether pollution happened
    const polluted = (({} as JsonObject)['isAdmin'] as boolean | undefined) === true;
    // Clean up to avoid side effects in the rest of the app
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (Object.prototype as any)['isAdmin'];
    setVulnResult(polluted ? 'Object.prototype.isAdmin === true ⚠️ (podatność potwierdzona)' : 'Brak efektu (silnik ją zablokował)');
  }

  function handleSafeMerge() {
    const source = JSON.parse(PAYLOAD) as JsonObject;
    const target: JsonObject = {};
    mergeObjectsSafely(target, source);
    const polluted = (({} as JsonObject)['isAdmin'] as boolean | undefined) === true;
    setSafeResult(polluted ? 'Zatruto! (to nie powinno się zdarzyć)' : 'Object.prototype bez zmian ✓');
  }

  return (
    <div>
      <p className="muted">Payload: <code>{PAYLOAD}</code></p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={handleVulnMerge} aria-label="Uruchom podatny merge z payloadem __proto__">
          Podatny merge
        </button>
        <button onClick={handleSafeMerge} aria-label="Uruchom bezpieczny merge z payloadem __proto__">
          Bezpieczny merge
        </button>
      </div>
      {vulnResult && <p className="muted">Podatny: {vulnResult}</p>}
      {safeResult && <p className="muted">Bezpieczny: {safeResult}</p>}
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
        >
          <OpenRedirectDemo />
        </DemoSection>

        <DemoSection
          title="Cleartext token storage"
          codeqlQuery="js/clear-text-storage-of-sensitive-data"
          whatItShows="Token zapisany w localStorage jest dostepny dla dowolnego skryptu na stronie."
          whyJavaCannotSee="Backend Java nie kontroluje localStorage przegladarki - XSS moze odczytac token."
        >
          <TokenStorageDemo />
        </DemoSection>

        <DemoSection
          title="Prototype pollution"
          codeqlQuery="js/prototype-pollution-utility"
          whatItShows="Niebezpieczny recursive merge pozwala zatruc Object.prototype przez klucz __proto__."
          whyJavaCannotSee="Java nie ma globalnego Object.prototype, wiec ta klasa podatnosci nie istnieje po stronie backendu."
        >
          <PrototypePollutionDemo />
        </DemoSection>

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
