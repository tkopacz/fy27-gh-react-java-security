interface SafeUserProfileProps {
  userHtml: string;
}

export function SafeUserProfile({ userHtml }: SafeUserProfileProps) {
  return <div>{userHtml}</div>;
}
