// DEMO ONLY - intentionally vulnerable
interface VulnerableUserProfileProps {
  userHtml: string;
}

export function VulnerableUserProfile({ userHtml }: VulnerableUserProfileProps) {
  return <div dangerouslySetInnerHTML={{ __html: userHtml }} />;
}
