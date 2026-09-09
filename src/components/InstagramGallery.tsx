import React, { useState, useEffect, useMemo } from 'react';
import {
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink,
  Settings,
  Sparkles,
  SlidersHorizontal,
  X,
  Check,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface InstagramPost {
  id: string;
  imageUrl: string;
  location: string;
  caption: string;
  likes: number;
  comments: number;
  postUrl: string;
  order: number;
}

interface CmsJsonPost {
  location?: string;
  caption?: string;
  image?: string;
  post_url?: string;
  likes?: number;
  comments?: number;
  order?: number;
}

const DEFAULT_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&h=600&q=80',
    location: 'Merzouga, Sahara',
    caption: 'Coucher de soleil doré et caravane dans les dunes de l\'Erg Chebbi ✨🐪',
    likes: 642,
    comments: 48,
    postUrl: 'https://www.instagram.com/smart_orga/',
    order: 1,
  },
  {
    id: 'post-2',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&h=600&q=80',
    location: 'Chefchaouen, La Perle Bleue',
    caption: 'Immersion dans les ruelles bleues les plus photogéniques du Maroc 💙📸',
    likes: 589,
    comments: 36,
    postUrl: 'https://www.instagram.com/smart_orga/',
    order: 2,
  },
  {
    id: 'post-3',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=600&h=600&q=80',
    location: 'Cascades d\'Ouzoud',
    caption: 'Pause fraîcheur face aux plus majestueuses chutes d\'eau du Moyen Atlas 🌊🌿',
    likes: 475,
    comments: 29,
    postUrl: 'https://www.instagram.com/smart_orga/',
    order: 3,
  },
  {
    id: 'post-4',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&h=600&q=80',
    location: 'Lagune de Dakhla',
    caption: 'Session glisse et sérénité absolue entre désert et océan turquoise 🏄‍♂️☀️',
    likes: 718,
    comments: 53,
    postUrl: 'https://www.instagram.com/smart_orga/',
    order: 4,
  },
  {
    id: 'post-5',
    imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=600&h=600&q=80',
    location: 'Kasbah Aït Ben Haddou',
    caption: 'Voyage dans le temps au cœur des citadelles de terre rouge du Sud marocain 🏰🇲🇦',
    likes: 534,
    comments: 31,
    postUrl: 'https://www.instagram.com/smart_orga/',
    order: 5,
  },
  {
    id: 'post-6',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=600&q=80',
    location: 'Vallée du Paradis & Taghazout',
    caption: 'Piscines naturelles couleur émeraude et vibe océanique inoubliable 🌴🌊',
    likes: 612,
    comments: 44,
    postUrl: 'https://www.instagram.com/smart_orga/',
    order: 6,
  },
];

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/smart_orga/';

export const InstagramGallery: React.FC = () => {
  const { language, t } = useLanguage();

  // Mode: 'cms' (Decap CMS / Local Posts) | 'auto' (Behold.so automatic live feed)
  const [galleryMode, setGalleryMode] = useState<'cms' | 'auto'>(() => {
    return (localStorage.getItem('smart_orga_gallery_mode') as 'cms' | 'auto') || 'cms';
  });

  // Behold Widget ID (configured via settings or env)
  const [beholdId, setBeholdId] = useState<string>(() => {
    return (
      localStorage.getItem('smart_orga_behold_id') ||
      ((import.meta as any).env?.VITE_BEHOLD_WIDGET_ID as string) ||
      ''
    );
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempBeholdId, setTempBeholdId] = useState(beholdId);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load Decap CMS JSON files via Vite import.meta.glob
  const cmsPosts = useMemo<InstagramPost[]>(() => {
    try {
      const globFiles = (import.meta as any).glob
        ? (import.meta as any).glob('/content/instagram/*.json', { eager: true })
        : {};
      const items: InstagramPost[] = [];

      Object.entries(globFiles).forEach(([, content], idx) => {
        const data = ((content as { default?: CmsJsonPost }).default || content) as CmsJsonPost;
        if (data && (data.image || data.caption)) {
          items.push({
            id: `cms-post-${idx}`,
            imageUrl: data.image || DEFAULT_POSTS[idx % DEFAULT_POSTS.length].imageUrl,
            location: data.location || 'Maroc',
            caption: data.caption || 'Aventure inoubliable avec Smart Orga ✨',
            likes: typeof data.likes === 'number' ? data.likes : 500 + (idx * 37) % 250,
            comments: typeof data.comments === 'number' ? data.comments : 25 + (idx * 7) % 30,
            postUrl: data.post_url || INSTAGRAM_PROFILE_URL,
            order: typeof data.order === 'number' ? data.order : idx + 1,
          });
        }
      });

      if (items.length > 0) {
        items.sort((a, b) => a.order - b.order);
        return items;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_POSTS;
  }, []);

  // Dynamically load Behold Widget Script when in 'auto' mode and beholdId is present
  useEffect(() => {
    if (galleryMode === 'auto' && beholdId) {
      const scriptId = 'behold-widget-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'module';
        script.src = 'https://w.behold.so/widget.js';
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [galleryMode, beholdId]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = tempBeholdId.trim();
    setBeholdId(cleanId);
    localStorage.setItem('smart_orga_behold_id', cleanId);
    if (cleanId) {
      setGalleryMode('auto');
      localStorage.setItem('smart_orga_gallery_mode', 'auto');
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsConfigOpen(false);
    }, 900);
  };

  const toggleMode = (mode: 'cms' | 'auto') => {
    setGalleryMode(mode);
    localStorage.setItem('smart_orga_gallery_mode', mode);
  };

  return (
    <section id="instagram" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-3">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-600 hover:text-pink-600 uppercase transition-colors group cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>{t.instaBadge || "@SMART_ORGA • INSTAGRAM GALLERY"}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Admin Config Button */}
            <button
              onClick={() => setIsConfigOpen(true)}
              title="Options de gestion Galerie (Option A: Behold / Option B: Decap CMS)"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Configuration Galerie Instagram"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.instaTitle || "Instants de Bonheur Capturés"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.instaSubtitle || "Suivez nos aventures régulières en temps réel sur les réseaux sociaux."}
          </p>

          {/* Mode Selector Tabs */}
          <div className="pt-2 flex justify-center items-center gap-2">
            <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => toggleMode('cms')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  galleryMode === 'cms'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'ar' ? 'المنشورات المختارة (CMS)' : 'Posts Sélectionnés (CMS)'}</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded-full text-slate-600">
                  {cmsPosts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleMode('auto')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  galleryMode === 'auto'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>{language === 'ar' ? 'البث التلقائي (Behold.so)' : 'Flux Auto (Behold.so)'}</span>
                {beholdId && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Connecté" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content View: Option A (Behold Widget) OR Option B (Decap CMS dynamic grid) */}
        {galleryMode === 'auto' && beholdId ? (
          /* OPTION A: Live Behold.so Widget */
          <div className="rounded-2xl overflow-hidden bg-slate-50 p-4 border border-slate-200/80 min-h-[360px]">
            <figure data-behold-id={beholdId} className="w-full min-h-[320px]"></figure>
          </div>
        ) : galleryMode === 'auto' && !beholdId ? (
          /* OPTION A Prompt: Connect Behold.so Widget */
          <div className="max-w-2xl mx-auto text-center p-8 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-blue-50/40 rounded-2xl border border-pink-200/60 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <Instagram className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Option A : Connecter le Widget Automatique (Behold.so)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Chargez instantanément les dernières photos publiées sur votre compte Instagram <strong>@smart_orga</strong> sans aucune intervention manuelle.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfigOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>Entrer mon ID Behold.so</span>
              </button>
              <button
                type="button"
                onClick={() => toggleMode('cms')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Utiliser la Galerie Decap CMS (Option B)</span>
              </button>
            </div>
          </div>
        ) : (
          /* OPTION B: Curated Decap CMS & JSON Gallery Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {cmsPosts.map((post) => (
              <a
                key={post.id}
                href={post.postUrl || INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${post.location} - ${post.caption}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block cursor-pointer"
              >
                {/* Photo */}
                <img
                  src={post.imageUrl}
                  alt={post.location}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Top Instagram badge */}
                <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-80 group-hover:opacity-0 transition-opacity">
                  <Instagram className="w-3.5 h-3.5" />
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {post.location}
                    </span>
                    <Instagram className="w-4 h-4 text-pink-400" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-100 line-clamp-2 leading-snug font-medium">
                      {post.caption}
                    </p>

                    <div className="flex items-center justify-between text-xs text-white/90 pt-1.5 border-t border-white/10 font-semibold">
                      <span className="flex items-center gap-1 text-pink-300">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Action Button & Decap CMS shortcut */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:via-pink-700 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Instagram className="w-5 h-5 text-white" />
            <span>{t.instaFollowBtn || "Suivez-nous sur Instagram @smart_orga"}</span>
          </a>

          {/* Quick link to Decap CMS */}
          <a
            href="/admin/#/collections/instagram_gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Gérer les posts dans Decap CMS"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Gérer dans Decap CMS (/admin)</span>
          </a>
        </div>

      </div>

      {/* CONFIG MODAL: Option A (Behold) & Option B (Decap CMS) Management */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Configuration Galerie Instagram
                </h3>
              </div>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Option A Configuration */}
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="bg-gradient-to-br from-pink-50/60 to-purple-50/60 p-4 rounded-xl border border-pink-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Option A : Widget Automatique Behold.so
                  </span>
                  <a
                    href="https://behold.so"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-pink-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>Créer un feed gratuit</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Behold.so synchronise automatiquement votre compte <strong>@smart_orga</strong>. Entrez simplement votre Feed ID Behold ci-dessous :
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Behold Widget ID
                  </label>
                  <input
                    type="text"
                    value={tempBeholdId}
                    onChange={(e) => setTempBeholdId(e.target.value)}
                    placeholder="Ex : p8FkX4y9Z1..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                  />
                </div>
              </div>

              {/* Option B Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Option B : Gestion Decap CMS (/admin)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  La collection <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">instagram_gallery</code> est configurée dans <strong>admin/config.yml</strong>. Vous pouvez y ajouter ou retirer manuellement des photos, liens et légendes.
                </p>
                <div className="pt-1">
                  <a
                    href="/admin/#/collections/instagram_gallery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Ouvrir Decap CMS Dashboard (/admin)</span>
                  </a>
                </div>
              </div>

              {/* Save or Close Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Enregistré !</span>
                    </>
                  ) : (
                    <span>Appliquer</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
};
