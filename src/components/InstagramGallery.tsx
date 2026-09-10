import React, { useMemo } from 'react';
import {
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink
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
    imageUrl: '/assets/darija.png',
    location: 'Merzouga, Sahara',
    caption: 'Coucher de soleil doré et caravane dans les dunes de l\'Erg Chebbi ✨🐪',
    likes: 97,
    comments: 6,
    postUrl: 'https://www.instagram.com/p/DURMRPUiFX6/',
    order: 1,
  },
  {
    id: 'post-2',
    imageUrl: '/assets/wiaam.png',
    location: 'Chefchaouen, La Perle Bleue',
    caption: 'Immersion dans les ruelles bleues les plus photogéniques du Maroc 💙📸',
    likes: 590,
    comments: 6,
    postUrl: 'https://www.instagram.com/p/DbqCmdYiPV_/?img_index=1',
    order: 2,
  },
  {
    id: 'post-3',
    imageUrl: '/assets/akchour.png',
    location: 'Cascades d\'Ouzoud',
    caption: 'Pause fraîcheur face aux plus majestueuses chutes d\'eau du Moyen Atlas 🌊🌿',
    likes: 50,
    comments: 18,
    postUrl: 'https://www.instagram.com/p/DM-cMERIQoX/',
    order: 3,
  },
  {
    id: 'post-4',
    imageUrl: '/assets/merzouga.png',
    location: 'Lagune de Dakhla',
    caption: 'Session glisse et sérénité absolue entre désert et océan turquoise 🏄‍♂️☀️',
    likes: 33,
    comments: 14,
    postUrl: 'https://www.instagram.com/p/C38MMA3N35j/',
    order: 4,
  },
  {
    id: 'post-5',
    imageUrl: '/assets/ifran.png',
    location: 'Kasbah Aït Ben Haddou',
    caption: 'Voyage dans le temps au cœur des citadelles de terre rouge du Sud marocain 🏰🇲🇦',
    likes: 52,
    comments: 6,
    postUrl: 'https://www.instagram.com/p/DT6DA7iiJVd/',
    order: 5,
  },
  {
    id: 'post-6',
    imageUrl: '/assets/akchour2.png',
    location: 'Vallée du Paradis & Taghazout',
    caption: 'Piscines naturelles couleur émeraude et vibe océanique inoubliable 🌴🌊',
    likes: 23,
    comments: 5,
    postUrl: 'https://www.instagram.com/p/DK7kQ2sooJl/?img_index=1',
    order: 6,
  },
];

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/smart_orga/';

export const InstagramGallery: React.FC = () => {
  const { t } = useLanguage();

  // Load Decap CMS JSON files via Vite import.meta.glob (content/instagram/*.json)
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
      // Fallback to default posts
    }
    return DEFAULT_POSTS;
  }, []);

  return (
    <section id="instagram" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center">
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
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.instaTitle || "Instants de Bonheur Capturés"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.instaSubtitle || "Suivez nos aventures régulières en temps réel sur les réseaux sociaux."}
          </p>
        </div>

        {/* Gallery Grid */}
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

        {/* Action Button */}
        <div className="flex items-center justify-center pt-2">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:via-pink-700 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Instagram className="w-5 h-5 text-white" />
            <span>{t.instaFollowBtn || "Suivez-nous sur Instagram @smart_orga"}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
