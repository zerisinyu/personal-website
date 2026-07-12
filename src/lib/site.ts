import type { CollectionEntry } from 'astro:content';

/** Prefix an internal path with the configured base path. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Resolve where a project card should link to, based on its type. */
export function projectHref(project: CollectionEntry<'projects'>): string {
  const { type, href } = project.data;
  // A full URL in `href` always means an outbound link, even if `type` was
  // set to `custom` by mistake — prevents it being mangled into a bogus
  // internal path like /personal-website/https://...
  if (href && /^https?:\/\//.test(href)) return href;
  if (type === 'external' && href) return href;
  if (type === 'custom' && href) return url(href);
  return url(`/work/${project.id}`);
}

/** Sort projects: explicit `order` first, then year descending. */
export function sortProjects(projects: CollectionEntry<'projects'>[]) {
  return [...projects].sort((a, b) => {
    const ao = a.data.order ?? Number.POSITIVE_INFINITY;
    const bo = b.data.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return Number(b.data.year) - Number(a.data.year);
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
