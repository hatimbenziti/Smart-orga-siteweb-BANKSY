/**
 * Data loader for Hero Slider (Accueil) dynamically connected to Decap CMS
 * Collection folder: content/slider
 */

export interface HeroSlide {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  image: string;
  order: number;
  link?: string;
}

interface CmsSlideRaw {
  title?: string;
  tag?: string;
  univers?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  photo?: string;
  imageUrl?: string;
  order?: number | string;
  link?: string;
  url?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-merzouga',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    title: 'Merzouga & Erg Chebbi',
    tag: 'Désert Magique',
    subtitle: 'Bivouac étoilé & balade en dromadaire',
    order: 1
  },
  {
    id: 'slide-chefchaouen',
    image: 'https://images.unsplash.com/photo-1558252277-246a06eb5535?auto=format&fit=crop&w=1200&q=80',
    title: 'Chefchaouen & Le Rif',
    tag: 'Perle Bleue',
    subtitle: 'Ruelles féeriques & coucher de soleil panoramique',
    order: 2
  },
  {
    id: 'slide-dakhla',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    title: 'Dakhla & La Dune Blanche',
    tag: 'Sahara Océanique',
    subtitle: 'Lagon turquoise & aventure 4x4 sauvage',
    order: 3
  },
  {
    id: 'slide-taghazout',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    title: 'Taghazout & Paradise Valley',
    tag: 'Plage & Nature',
    subtitle: 'Surf vibes, piscines naturelles & soleil infini',
    order: 4
  }
];

function parseFrontmatter(rawContent: string): Record<string, any> {
  const result: Record<string, any> = {};
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return result;

  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result[key] = val;
  }
  return result;
}

/**
 * Dynamically loads all slides from content/slider/*.json (and public/content/slider/*.json)
 * Reads: title, subtitle, image, tag/univers, link, order
 */
export function loadCmsSlides(): HeroSlide[] {
  const mapBySlug = new Map<string, HeroSlide>();

  // 1. Primary: load from content/slider/*.json (the Decap CMS folder)
  try {
    const jsonModules = import.meta.glob<Record<string, any>>('/content/slider/*.json', { eager: true });
    Object.entries(jsonModules).forEach(([path, mod], idx) => {
      const data = ((mod as { default?: CmsSlideRaw }).default || mod) as CmsSlideRaw;
      if (!data) return;

      const slug = path.split('/').pop()?.replace(/\.json$/, '') || `slide-${idx}`;
      const title = (data.title || '').trim() || 'Séjour Découverte';
      const tag = (data.tag || data.univers || data.badge || '').trim() || 'Maroc Authentique';
      const subtitle = (data.subtitle || data.description || '').trim();
      const image = (data.image || data.photo || data.imageUrl || '').trim();
      const order = typeof data.order === 'number' ? data.order : Number(data.order) || idx + 1;
      const link = (data.link || data.url || '').trim() || undefined;

      if (image || title) {
        mapBySlug.set(slug, {
          id: slug,
          title,
          tag,
          subtitle,
          image: image || DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].image,
          order,
          link
        });
      }
    });
  } catch (err) {
    console.warn('Failed to load JSON modules from /content/slider:', err);
  }

  // 2. Fallback / complement from public/content/slider/*.json (if any slide not already in map)
  try {
    const publicJsonModules = import.meta.glob<Record<string, any>>('/public/content/slider/*.json', { eager: true });
    Object.entries(publicJsonModules).forEach(([path, mod], idx) => {
      const slug = path.split('/').pop()?.replace(/\.json$/, '') || `pub-slide-${idx}`;
      if (mapBySlug.has(slug)) return; // Already loaded from content/slider

      const data = ((mod as { default?: CmsSlideRaw }).default || mod) as CmsSlideRaw;
      if (!data) return;

      const title = (data.title || '').trim() || 'Séjour Découverte';
      const tag = (data.tag || data.univers || data.badge || '').trim() || 'Maroc Authentique';
      const subtitle = (data.subtitle || data.description || '').trim();
      const image = (data.image || data.photo || data.imageUrl || '').trim();
      const order = typeof data.order === 'number' ? data.order : Number(data.order) || idx + 1;
      const link = (data.link || data.url || '').trim() || undefined;

      if (image || title) {
        mapBySlug.set(slug, {
          id: slug,
          title,
          tag,
          subtitle,
          image: image || DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].image,
          order,
          link
        });
      }
    });
  } catch (err) {
    console.warn('Failed to load fallback JSON modules from /public/content/slider:', err);
  }

  // 3. Optional Markdown slides in content/slider/*.md
  try {
    const mdModules = import.meta.glob<string>('/content/slider/*.md', {
      eager: true,
      query: '?raw',
      import: 'default'
    });
    Object.entries(mdModules).forEach(([path, rawContent], idx) => {
      const slug = path.split('/').pop()?.replace(/\.md$/, '') || `slide-md-${idx}`;
      if (mapBySlug.has(slug)) return;

      const data = parseFrontmatter(rawContent) as CmsSlideRaw;
      if (!data) return;

      const title = (data.title || '').trim() || 'Séjour Découverte';
      const tag = (data.tag || data.univers || data.badge || '').trim() || 'Maroc Authentique';
      const subtitle = (data.subtitle || data.description || '').trim();
      const image = (data.image || data.photo || data.imageUrl || '').trim();
      const order = typeof data.order === 'number' ? data.order : Number(data.order) || idx + 10;
      const link = (data.link || data.url || '').trim() || undefined;

      if (image || title) {
        mapBySlug.set(slug, {
          id: slug,
          title,
          tag,
          subtitle,
          image: image || DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].image,
          order,
          link
        });
      }
    });
  } catch (err) {
    console.warn('Failed to load Markdown modules from /content/slider:', err);
  }

  const result = Array.from(mapBySlug.values());

  if (result.length > 0) {
    result.sort((a, b) => a.order - b.order);
    return result;
  }

  return DEFAULT_SLIDES;
}
