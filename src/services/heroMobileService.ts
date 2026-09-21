/**
 * Service de gestion pour la configuration du Hero Mobile
 * Supporte :
 * 1. La lecture depuis /content/settings/hero_mobile.json (Decap CMS)
 * 2. La persistance locale (localStorage) avec mise à jour en temps réel sans rechargement
 * 3. Les actions : voir, charger, prévisualiser, remplacer, enregistrer, supprimer, rétablir par défaut
 */

import { normalizeCmsImagePath } from '../data/sliderData';
import heroMobileJson from '../../content/settings/hero_mobile.json';

export interface HeroMobileConfig {
  image: string;
  position: 'center' | 'left' | 'right';
  overlayOpacity: number; // Valeur en pourcentage (0 à 100)
  opacity?: number; // Opacité directe de l'image (0 à 100)
  brightness: 'normal' | 'dimmed' | 'dark';
  enabled: boolean;
}

export const DEFAULT_HERO_MOBILE_CONFIG: HeroMobileConfig = {
  image: '/uploads/heroy.png',
  position: 'center',
  overlayOpacity: 100,
  opacity: 100,
  brightness: 'normal',
  enabled: true
};

const STORAGE_KEY = 'smart_orga_hero_mobile_config';
const EVENT_NAME = 'smart_orga_hero_mobile_change';

function parseRawHeroConfig(data: any): Partial<HeroMobileConfig> | null {
  if (!data || typeof data !== 'object') return null;
  const rawOp = typeof data.opacity === 'number'
    ? data.opacity
    : (typeof data.overlayOpacity === 'number' ? data.overlayOpacity : undefined);

  return {
    image: typeof data.image === 'string' ? normalizeCmsImagePath(data.image) : undefined,
    position: data.position === 'left' || data.position === 'right' ? data.position : 'center',
    overlayOpacity: rawOp !== undefined ? Math.min(100, Math.max(0, rawOp)) : undefined,
    opacity: rawOp !== undefined ? Math.min(100, Math.max(0, rawOp)) : undefined,
    brightness: data.brightness === 'dimmed' || data.brightness === 'dark' ? data.brightness : 'normal',
    enabled: typeof data.enabled === 'boolean' ? data.enabled : true
  };
}

/**
 * Charge la configuration de base depuis /content/settings/hero_mobile.json
 */
function loadFileConfig(): Partial<HeroMobileConfig> | null {
  const direct = parseRawHeroConfig(heroMobileJson);
  if (direct && direct.image) {
    return direct;
  }

  try {
    const modules = import.meta.glob<Record<string, any>>('/content/settings/hero_mobile.json', { eager: true });
    for (const mod of Object.values(modules)) {
      const data = ((mod as { default?: any }).default || mod) as any;
      const parsed = parseRawHeroConfig(data);
      if (parsed) return parsed;
    }
  } catch (err) {
    console.warn('Could not load /content/settings/hero_mobile.json:', err);
  }

  // Fallback public folder
  try {
    const pubModules = import.meta.glob<Record<string, any>>('/public/content/settings/hero_mobile.json', { eager: true });
    for (const mod of Object.values(pubModules)) {
      const data = ((mod as { default?: any }).default || mod) as any;
      const parsed = parseRawHeroConfig(data);
      if (parsed) return parsed;
    }
  } catch {}

  return direct || null;
}

/**
 * Récupère la configuration actuelle active
 */
export function getHeroMobileConfig(): HeroMobileConfig {
  const fileConfig = loadFileConfig() || {};
  let localConfig: Partial<HeroMobileConfig> = {};

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localConfig = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erreur lecture localStorage hero mobile:', e);
    }
  }

  // Si une ancienne image est en cache ou si le fichier a été configuré avec heroy.png
  const localImg = localConfig.image;
  const isStaleLocal = localImg && localImg.includes('0.7588255303774318');
  const activeImage = (localImg && !isStaleLocal)
    ? localImg
    : (fileConfig.image || DEFAULT_HERO_MOBILE_CONFIG.image);

  return {
    image: activeImage,
    position: localConfig.position || fileConfig.position || DEFAULT_HERO_MOBILE_CONFIG.position,
    overlayOpacity: typeof localConfig.overlayOpacity === 'number'
      ? localConfig.overlayOpacity
      : (typeof fileConfig.overlayOpacity === 'number' ? fileConfig.overlayOpacity : DEFAULT_HERO_MOBILE_CONFIG.overlayOpacity),
    brightness: localConfig.brightness || fileConfig.brightness || DEFAULT_HERO_MOBILE_CONFIG.brightness,
    enabled: localConfig.enabled !== undefined
      ? localConfig.enabled
      : (fileConfig.enabled !== undefined ? fileConfig.enabled : DEFAULT_HERO_MOBILE_CONFIG.enabled)
  };
}

/**
 * Tente de rafraîchir la configuration depuis le fichier sur le serveur en direct
 */
export async function refreshHeroMobileConfigFromRemote(): Promise<HeroMobileConfig | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(`/content/settings/hero_mobile.json?_t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      const parsed = parseRawHeroConfig(data);
      if (parsed && parsed.image) {
        const current = getHeroMobileConfig();
        const updated: HeroMobileConfig = {
          ...current,
          ...parsed
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
        return updated;
      }
    }
  } catch (err) {
    // Non-blocking
  }
  return null;
}

/**
 * Sauvegarde la configuration dans le stockage local et avertit les composants
 */
export function saveHeroMobileConfig(config: Partial<HeroMobileConfig>): HeroMobileConfig {
  const current = getHeroMobileConfig();
  const rawOp = typeof config.opacity === 'number'
    ? config.opacity
    : (typeof config.overlayOpacity === 'number' ? config.overlayOpacity : undefined);

  const updated: HeroMobileConfig = {
    ...current,
    ...config,
    overlayOpacity: rawOp !== undefined ? Math.min(100, Math.max(0, rawOp)) : current.overlayOpacity,
    opacity: rawOp !== undefined ? Math.min(100, Math.max(0, rawOp)) : (current.opacity ?? current.overlayOpacity)
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    } catch (e) {
      console.error('Erreur sauvegarde localStorage hero mobile:', e);
    }
  }

  return updated;
}

/**
 * Rétablit l'image et les paramètres par défaut
 */
export function restoreDefaultHeroMobileConfig(): HeroMobileConfig {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_HERO_MOBILE_CONFIG }));
    } catch (e) {
      console.error('Erreur réinitialisation hero mobile:', e);
    }
  }
  return { ...DEFAULT_HERO_MOBILE_CONFIG };
}

/**
 * Supprime l'image personnalisée (désactive l'image ou la vide)
 */
export function deleteCustomHeroMobileImage(): HeroMobileConfig {
  const updated: HeroMobileConfig = {
    ...getHeroMobileConfig(),
    image: '',
    enabled: false
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    } catch (e) {
      console.error('Erreur suppression image hero mobile:', e);
    }
  }

  return updated;
}

/**
 * S'abonne aux changements de configuration du Hero mobile
 */
export function subscribeHeroMobile(callback: (config: HeroMobileConfig) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<HeroMobileConfig>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getHeroMobileConfig());
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
