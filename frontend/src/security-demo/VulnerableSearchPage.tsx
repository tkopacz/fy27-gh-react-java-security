// DEMO ONLY - intentionally vulnerable
export function VulnerableSearchPage() {
  const search = new URLSearchParams(window.location.search);
  const query = search.get('q') || '';

  return <div dangerouslySetInnerHTML={{ __html: query }} />;
}
