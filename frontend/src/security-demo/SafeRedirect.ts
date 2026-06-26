export function getSafeRedirectPath(rawPath: string | null): string | null {
  if (!rawPath || !rawPath.startsWith('/')) {
    return null;
  }

  if (rawPath.startsWith('//') || rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('javascript:')) {
    return null;
  }

  return rawPath;
}
