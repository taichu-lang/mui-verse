export interface HashRoute {
  section: string | null;
  slug: string | null;
}

export function parseHash(hash: string | null): HashRoute {
  if (!hash) {
    return { section: null, slug: null };
  }

  const [section, ...rest] = hash.split("/");
  return { section, slug: rest.join("/") };
}
