import { Trip, Review, FAQItem } from '../types';

export const TRIPS_DATA: Trip[] = [
  {
    id: 'merzouga-desert-vip',
    title: 'Magie du Désert de Merzouga & Gorges du Dadès',
    destination: 'Merzouga & Sud Marocain',
    region: 'Désert & Dunes',
    duration: '3 jours / 2 nuits',
    days: 3,
    nights: 2,
    priceMAD: 1450,
    originalPriceMAD: 1750,
    rating: 4.9,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Casablanca', 'Rabat', 'Marrakech'],
    nextDate: 'Vendredi 18 Septembre',
    category: 'popular',
    isPopular: true,
    isWeekly: true,
    highlights: [
      'Nuitée en bivouac de luxe au cœur des dunes de l\'Erg Chebbi',
      'Balade à dos de dromadaire au coucher et lever du soleil',
      'Soirée animée autour du feu de camp avec musiciens Gnawa',
      'Visite des spectaculaires Gorges du Todra et Dadès'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Départ & Traversée du Haut-Atlas vers Ouarzazate',
        description: 'Rendez-vous tôt le matin. Traversée du majestueux col de Tizi n\'Tichka (2 260 m). Déjeuner à la Kasbah d\'Aït Ben Haddou, visite des studios de cinéma de Ouarzazate et nuitée dans les Gorges du Dadès.'
      },
      {
        day: 2,
        title: 'Gorges du Todra & Immersion dans les dunes de Merzouga',
        description: 'Route vers Tinghir et marche dans les falaises impressionnantes des Gorges du Todra. Arrivée à Merzouga en fin d\'après-midi, caravane de dromadaires dans les dunes dorées, dîner traditionnel et nuit sous les étoiles.'
      },
      {
        day: 3,
        title: 'Lever de soleil sur l\'Erg Chebbi & Retour',
        description: 'Réveil matinal pour admirer le lever de soleil sur les crêtes de sable. Petit-déjeuner berbère complet, puis voyage retour avec arrêts panoramiques et souvenirs plein la tête.'
      }
    ],
    included: [
      'Transport touristique tout confort climatisé A/R',
      'Chauffeur professionnel expérimenté & accompagnateur Smart Orga',
      '1 nuitée en hôtel de charme aux Gorges du Dadès en demi-pension',
      '1 nuitée en bivouac supérieur à Merzouga avec sanitaires privés',
      'Balade à dos de dromadaire aller et retour',
      'Dîners et petits-déjeuners inclus'
    ],
    notIncluded: [
      'Déjeuners libres en cours de route',
      'Boissons et dépenses personnelles',
      'Session quad / buggy dans les dunes (en option sur place)'
    ],
    groupSize: '14 à 20 personnes',
    weather: {
      temp: '27°C',
      condition: 'Ensoleillé & Ciel pur',
      conditionAr: 'مشمس وسماء صافية',
      conditionEn: 'Sunny & Clear Sky',
      dailyForecast: [
        { day: 1, temp: '26°C', condition: 'Ensoleillé', conditionAr: 'مشمس', conditionEn: 'Sunny' },
        { day: 2, temp: '28°C', condition: 'Ciel étoilé', conditionAr: 'ليلة صافية', conditionEn: 'Starry & Mild' },
        { day: 3, temp: '25°C', condition: 'Grand soleil', conditionAr: 'مشمس ناصع', conditionEn: 'Bright Sunshine' }
      ]
    }
  },
  {
    id: 'dakhla-lagon-kitesurf',
    title: 'Échappée Sauvage à Dakhla & Lagon Blanc',
    destination: 'Dakhla & Sahara Océanique',
    region: 'Plages & Surf',
    duration: '4 jours / 3 nuits',
    days: 4,
    nights: 3,
    priceMAD: 2950,
    originalPriceMAD: 3400,
    rating: 5.0,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Casablanca', 'Dakhla (sur place)'],
    nextDate: 'Jeudi 24 Septembre',
    category: 'popular',
    isPopular: true,
    isUpcoming: true,
    highlights: [
      'Excursion en 4x4 vers la Dune Blanche et le lagon turquoise',
      'Dégustation d\'huîtres fraîches au parc ostréicole face à l\'océan',
      'Baignade à la source thermale d\'Asnaa (38°C sous le ciel du désert)',
      'Découverte de l\'Île du Dragon et observation des flamants roses'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Accueil à Dakhla & Installation éco-lodge',
        description: 'Accueil à l\'aéroport ou au point de rassemblement. Transfert vers notre campement de charme en bord de lagune. Dîner de poissons frais et briefing de séjour.'
      },
      {
        day: 2,
        title: 'La Dune Blanche, Île du Dragon & Kitesurf',
        description: 'Safari en 4x4 pour atteindre le spectacle féerique de la Dune Blanche se jetant dans le bleu turquoise. Session photo, pause baignade et observation des oiseaux migrateurs.'
      },
      {
        day: 3,
        title: 'Port d\'Imlili, Source d\'Asnaa & Coucher de soleil',
        description: 'Journée dans le désert profond vers les poches d\'eau permanentes d\'Imlili abritant des petits poissons exfoliants, puis relaxation aux eaux sulfureuses tièdes.'
      },
      {
        day: 4,
        title: 'Marché d\'artisanat saharien & Clôture',
        description: 'Visite de la ville de Dakhla, achats de Melhfa, thé sahraoui et artisanat local avant le retour.'
      }
    ],
    included: [
      'Hébergement 3 nuits en éco-resort en pension complète',
      'Tous les transferts 4x4 avec chauffeurs locaux',
      'Guide accompagnateur natif de Dakhla',
      'Excursion Dune Blanche, Imlili et source d\'Asnaa',
      'Visite du parc ostréicole avec dégustation'
    ],
    notIncluded: [
      'Billets d\'avion (disponibles en option sur demande)',
      'Cours de Kitesurf & Wingfoil (location possible)',
      'Dépenses personnelles'
    ],
    groupSize: '12 à 18 personnes',
    weather: {
      temp: '24°C',
      condition: 'Soleil & Brise marine',
      conditionAr: 'مشمس ونسيم بحري',
      conditionEn: 'Sunny & Sea Breeze',
      dailyForecast: [
        { day: 1, temp: '23°C', condition: 'Brise douce', conditionAr: 'نسيم لطيف', conditionEn: 'Gentle Breeze' },
        { day: 2, temp: '25°C', condition: 'Soleil & Vent régulier', conditionAr: 'شمس ورياح مثالية', conditionEn: 'Sunny & Steady Wind' },
        { day: 3, temp: '24°C', condition: 'Lagon radieux', conditionAr: 'أجواء مشمسة رائعة', conditionEn: 'Clear Lagoon' },
        { day: 4, temp: '24°C', condition: 'Ciel bleu', conditionAr: 'سماء زرقاء', conditionEn: 'Blue Sky' }
      ]
    }
  },
  {
    id: 'chefchaouen-tanger-perle-bleue',
    title: 'Chefchaouen la Perle Bleue & Cap Spartel Tanger',
    destination: 'Chefchaouen & Tanger',
    region: 'Villes Impériales',
    duration: '2 jours / 1 nuit',
    days: 2,
    nights: 1,
    priceMAD: 950,
    originalPriceMAD: 1150,
    rating: 4.8,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1558252277-246a06eb5535?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558252277-246a06eb5535?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Casablanca', 'Rabat', 'Kénitra'],
    nextDate: 'Chaque Samedi matin',
    category: 'weekly',
    isWeekly: true,
    isPopular: true,
    highlights: [
      'Flânerie magique dans les ruelles azurées de Chefchaouen',
      'Coucher de soleil inoubliable depuis la Mosquée Espagnole',
      'Visite des Grottes d\'Hercule et du mythique Cap Spartel',
      'Ambiance bohème de la Kasbah et du Petit Socco de Tanger'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivée à Chefchaouen, Ras El Maa & Kasbah',
        description: 'Départ tôt de Casablanca/Rabat. Arrivée à Chefchaouen nichée entre les monts du Rif. Déjeuner rifain authentique, balade guidée vers la source Ras El Maa et montée au coucher du soleil à la Mosquée Bouzaafar.'
      },
      {
        day: 2,
        title: 'Tanger la Blanche, Grottes d\'Hercule & Retour',
        description: 'Départ matinal pour Tanger. Rencontre de l\'Atlantique et de la Méditerranée au Cap Spartel, exploration des célèbres Grottes d\'Hercule, temps libre dans la Médina et retour en soirée.'
      }
    ],
    included: [
      'Transport touristique aller-retour en minibus grand confort',
      '1 nuitée en hôtel 4* ou Riad typique au centre de Chefchaouen',
      'Petit-déjeuner buffet inclus',
      'Guide local pour la visite de la médina bleue',
      'Accompagnement et animation Smart Orga'
    ],
    notIncluded: [
      'Repas de midi et du soir (adresses locales recommandées)',
      'Tickets d\'entrée aux Grottes d\'Hercule (environ 20 MAD)'
    ],
    groupSize: '15 à 22 personnes',
    weather: {
      temp: '22°C',
      condition: 'Doux & Ensoleillé',
      conditionAr: 'معتدل ومشمس',
      conditionEn: 'Mild & Sunny',
      dailyForecast: [
        { day: 1, temp: '21°C', condition: 'Agréable pour flâner', conditionAr: 'جو رائع للمشي', conditionEn: 'Pleasant Stroll' },
        { day: 2, temp: '23°C', condition: 'Ciel bleu & Brise du détroit', conditionAr: 'سماء صافية ونسيم عليل', conditionEn: 'Clear Straits Breeze' }
      ]
    }
  },
  {
    id: 'agadir-taghazout-paradise',
    title: 'Taghazout Surf Vibes & Paradise Valley Agadir',
    destination: 'Taghazout & Agadir',
    region: 'Plages & Surf',
    duration: '3 jours / 2 nuits',
    days: 3,
    nights: 2,
    priceMAD: 1290,
    originalPriceMAD: 1490,
    rating: 4.9,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Casablanca', 'Rabat', 'Marrakech'],
    nextDate: 'Vendredi 25 Septembre',
    category: 'popular',
    isPopular: true,
    isWeekly: true,
    highlights: [
      'Ambiance décontractée dans le village de pêcheurs et surfeurs de Taghazout',
      'Randonnée et baignade dans les piscines naturelles de Paradise Valley',
      'Coucher de soleil sur la baie d\'Agadir depuis la Kasbah Oufella',
      'Initiation au surf ou yoga face à l\'océan en option'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Cap vers la côte Souss : Agadir & Taghazout',
        description: 'Départ par l\'autoroute avec pause café. Arrivée à Agadir, visite de la Kasbah Agadir Oufella avec vue panoramique sur l\'océan. Installation à l\'hôtel à Taghazout Village.'
      },
      {
        day: 2,
        title: 'Trek aquatique à Paradise Valley & Sunset Surf',
        description: 'Excursion dans la vallée d\'Immouzzer, marche au milieu des palmiers et baignade rafraîchissante. Après-midi détente sur la plage d\'Anchor Point et coucher de soleil doré.'
      },
      {
        day: 3,
        title: 'Souk El Had & Retour convivial',
        description: 'Visite du plus grand souk urbain d\'Afrique pour l\'huile d\'argan pure et les épices, puis retour dans vos villes respectives.'
      }
    ],
    included: [
      'Transport aller-retour en autocar de tourisme grand confort',
      '2 nuits en hôtel 4* face à la mer avec piscine',
      'Petits-déjeuners inclus',
      'Excursion guidée complète à Paradise Valley',
      'Assurance assistance voyage'
    ],
    notIncluded: [
      'Repas de midi et du soir',
      'Location planche de surf ou cours encadré'
    ],
    groupSize: '16 à 24 personnes',
    weather: {
      temp: '25°C',
      condition: 'Soleil & Air océanique',
      conditionAr: 'مشمس وهواء المحيط',
      conditionEn: 'Sunny & Ocean Air',
      dailyForecast: [
        { day: 1, temp: '24°C', condition: 'Soleil et houle douce', conditionAr: 'شمس وأمواج هادئة', conditionEn: 'Gentle Surf' },
        { day: 2, temp: '26°C', condition: 'Baignade idéale', conditionAr: 'مثالي للسباحة', conditionEn: 'Warm & Fresh' },
        { day: 3, temp: '25°C', condition: 'Plein soleil', conditionAr: 'مشمس تماماً', conditionEn: 'Full Sunshine' }
      ]
    }
  },
  {
    id: 'marrakech-agafay-atlas',
    title: 'Marrakech Impériale & Nuit Insolite dans le Désert d\'Agafay',
    destination: 'Marrakech & Agafay',
    region: 'Villes Impériales',
    duration: '2 jours / 1 nuit',
    days: 2,
    nights: 1,
    priceMAD: 1100,
    originalPriceMAD: 1300,
    rating: 4.8,
    reviewCount: 165,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Casablanca', 'Rabat'],
    nextDate: 'Samedi 19 Septembre',
    category: 'weekly',
    isWeekly: true,
    highlights: [
      'Dîner sous tente nomade avec spectacle oriental et feu de joie',
      'Piscine avec vue spectaculaire sur les collines arides d\'Agafay',
      'Visite du Jardin Majorelle et des souks artisanaux de la Médina',
      'Session quad ou dromadaire au coucher de soleil'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Marrakech culturelle & Soirée féerique à Agafay',
        description: 'Arrivée à Marrakech, visite guidée de la Médina et du Jardin Majorelle. En fin d\'après-midi, cap sur le désert de pierres d\'Agafay. Dîner gastronomique marocain avec musiciens et cracheurs de feu.'
      },
      {
        day: 2,
        title: 'Matinée détente au désert & Retour',
        description: 'Petit-déjeuner face aux cimes enneigées de l\'Atlas. Baignade dans la piscine panoramique du camp, balade libre et retour en fin d\'après-midi.'
      }
    ],
    included: [
      'Transport climatisé A/R au départ de Casablanca et Rabat',
      '1 nuit en campement de luxe à Agafay avec piscine',
      'Dîner spectacle et petit-déjeuner copieux',
      'Visite guidée de la Médina de Marrakech'
    ],
    notIncluded: [
      'Tickets d\'entrée du Jardin Majorelle',
      'Dépenses personnelles'
    ],
    groupSize: '12 à 20 personnes',
    weather: {
      temp: '26°C',
      condition: 'Ciel azur & Douceur',
      conditionAr: 'سماء صافية وطقس معتدل',
      conditionEn: 'Azure Sky & Warm',
      dailyForecast: [
        { day: 1, temp: '27°C', condition: 'Climat agréable', conditionAr: 'طقس رائع', conditionEn: 'Pleasant' },
        { day: 2, temp: '26°C', condition: 'Matinée lumineuse', conditionAr: 'صباح مشرق', conditionEn: 'Bright Morning' }
      ]
    }
  },
  {
    id: 'ouzoud-bin-el-ouidane',
    title: 'Cascades d\'Ouzoud & Lac Féerique de Bin El Ouidane',
    destination: 'Moyen-Atlas & Azilal',
    region: 'Nature & Randonnée',
    duration: '2 jours / 1 nuit',
    days: 2,
    nights: 1,
    priceMAD: 890,
    originalPriceMAD: 1050,
    rating: 4.9,
    reviewCount: 180,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Casablanca', 'Rabat', 'Marrakech'],
    nextDate: 'Samedi 26 Septembre',
    category: 'popular',
    isPopular: true,
    isWeekly: true,
    highlights: [
      'Randonnée le long des plus hautes chutes d\'eau du Maroc (110 mètres)',
      'Rencontre amicale avec les singes magots dans leur habitat sauvage',
      'Tour en barque au pied des embruns de la cascade',
      'Balade en bateau sur le lac émeraude de Bin El Ouidane'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Descente des cascades d\'Ouzoud & Nuitée panoramique',
        description: 'Départ le matin. Arrivée à Ouzoud, descente des gorges avec guide local, tour en radeau sous les cascades, observation des macaques berbères. Dîner tajine traditionnel et nuit en hôtel avec vue sur la vallée.'
      },
      {
        day: 2,
        title: 'Le majestueux Lac de Bin El Ouidane & Retour',
        description: 'Excursion vers le lac de retenue aux eaux turquoises de Bin El Ouidane. Tour en bateau à moteur, pause déjeuner au bord de l\'eau et retour relaxant.'
      }
    ],
    included: [
      'Transport complet aller-retour climatisé',
      '1 nuit en hôtel de montagne avec petit-déjeuner',
      'Tour en barque traditionnelle à Ouzoud',
      'Guide local certifié pour la randonnée'
    ],
    notIncluded: [
      'Déjeuners',
      'Boissons'
    ],
    groupSize: '15 à 25 personnes',
    weather: {
      temp: '23°C',
      condition: 'Beau temps & Fraîcheur',
      conditionAr: 'مشمس ومنعش',
      conditionEn: 'Pleasant & Fresh',
      dailyForecast: [
        { day: 1, temp: '22°C', condition: 'Fraîcheur des cascades', conditionAr: 'نسيم الشلالات المنعش', conditionEn: 'Waterfalls Freshness' },
        { day: 2, temp: '24°C', condition: 'Lac calme & ensoleillé', conditionAr: 'بحيرة هادئة ومشمسة', conditionEn: 'Calm & Sunny Lake' }
      ]
    }
  },
  {
    id: 'toubkal-imlil-trek',
    title: 'Ascension du Mont Toubkal & Vallée d\'Imlil (4 167 m)',
    destination: 'Imlil & Haut-Atlas',
    region: 'Nature & Randonnée',
    duration: '3 jours / 2 nuits',
    days: 3,
    nights: 2,
    priceMAD: 1650,
    originalPriceMAD: 1950,
    rating: 4.9,
    reviewCount: 87,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Marrakech', 'Casablanca', 'Rabat'],
    nextDate: 'Vendredi 2 Octobre',
    category: 'upcoming',
    isUpcoming: true,
    highlights: [
      'Atteindre le sommet culminant d\'Afrique du Nord à 4 167 m',
      'Vue panoramique à 360° sur l\'Atlas et le début du Sahara',
      'Nuitée chaleureuse au refuge du Toubkal (3 207 m)',
      'Muletiers et cuisinier berbère pour porter les bagages et préparer les repas'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Marrakech - Imlil - Refuge du Toubkal',
        description: 'Transfert jusqu\'au village d\'Imlil (1 740 m). Rencontre avec l\'équipe de muletiers. Montée progressive le long de la vallée de Chamharouch jusqu\'au refuge des Mouflons.'
      },
      {
        day: 2,
        title: 'L\'Ascension du Sommet (4 167 m) & Célébration',
        description: 'Départ à l\'aube à la frontale. Montée vers la crête et arrivée au sommet pour assister à un lever de soleil exceptionnel. Descente vers le refuge pour un thé réconfortant.'
      },
      {
        day: 3,
        title: 'Descente vers Imlil & Retour',
        description: 'Retour paisible vers Imlil, déjeuner convivial chez l\'habitant berbère et trajet retour vers votre ville de départ.'
      }
    ],
    included: [
      'Transport A/R en minibus touristique',
      '2 nuits au refuge de montagne',
      'Pension complète durant tout le trek (préparée par notre chef)',
      'Guide de haute montagne breveté d\'État',
      'Mulets pour le portage des bagages'
    ],
    notIncluded: [
      'Équipement personnel (chaussures de marche, bâtons, sac de couchage)',
      'Pourboires à l\'équipe locale'
    ],
    groupSize: '8 à 14 personnes',
    weather: {
      temp: '18°C',
      condition: 'Air pur & Ciel dégagé',
      conditionAr: 'هواء نقي وسماء صافية',
      conditionEn: 'Fresh Mountain Air',
      dailyForecast: [
        { day: 1, temp: '19°C', condition: 'Idéal pour le trek', conditionAr: 'مثالي للمشي الجبلي', conditionEn: 'Ideal for Trekking' },
        { day: 2, temp: '14°C', condition: 'Sommet dégagé au matin', conditionAr: 'قمة صافية مع الشروق', conditionEn: 'Clear Summit Morning' },
        { day: 3, temp: '17°C', condition: 'Vallée tempérée', conditionAr: 'طقس معتدل بالوادي', conditionEn: 'Mild Valley' }
      ]
    }
  },
  {
    id: 'ouarzazate-draa-kasbahs',
    title: 'Route des Mille Kasbahs & Vallée du Draa',
    destination: 'Ouarzazate & Zagora',
    region: 'Désert & Dunes',
    duration: '3 jours / 2 nuits',
    days: 3,
    nights: 2,
    priceMAD: 1390,
    originalPriceMAD: 1600,
    rating: 4.8,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    departureCities: ['Casablanca', 'Rabat', 'Marrakech'],
    nextDate: 'Vendredi 9 Octobre',
    category: 'upcoming',
    isUpcoming: true,
    highlights: [
      'Visite du Ksar emblématique d\'Aït Ben Haddou classé UNESCO',
      'Balade au cœur de la palmeraie millénaire de la Vallée du Draa',
      'Atelier de poterie ancestrale à Tamegroute et bibliothèque coranique',
      'Nuit sous tente bédouine dans les dunes de Zagora'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Traversée du Tichka & Kasbah de Telouet',
        description: 'Départ tôt, franchissement de l\'Atlas, visite du palais du Glaoui à Telouet et du Ksar d\'Aït Ben Haddou. Dîner et nuit dans un riad traditionnel à Ouarzazate.'
      },
      {
        day: 2,
        title: 'Palmeraie du Draa, Tamegroute & Bivouac à Zagora',
        description: 'Traversée de l\'immense ruban de palmiers du Draa, arrêt poterie artisanale à Tamegroute, caravane de dromadaires dans les dunes et nuitée étoilée.'
      },
      {
        day: 3,
        title: 'Visite d\'Agdz & Retour via Marrakech',
        description: 'Petit-déjeuner au lever du jour, remontée de la vallée avec arrêts photos et retour vers les villes de départ.'
      }
    ],
    included: [
      'Transport touristique tout confort',
      '1 nuit en Riad à Ouarzazate en demi-pension',
      '1 nuit en bivouac nomade à Zagora avec dîner et petit-déjeuner',
      'Balade en dromadaires',
      'Guide local certifié'
    ],
    notIncluded: [
      'Déjeuners libres',
      'Achats de souvenirs'
    ],
    groupSize: '14 à 20 personnes',
    weather: {
      temp: '26°C',
      condition: 'Ensoleillé & Ciel clair',
      conditionAr: 'مشمس وصافٍ',
      conditionEn: 'Sunny & Clear',
      dailyForecast: [
        { day: 1, temp: '25°C', condition: 'Traversée de l\'Atlas sous le soleil', conditionAr: 'عبور الأطلس تحت الشمس', conditionEn: 'Sunny Atlas Crossing' },
        { day: 2, temp: '27°C', condition: 'Palmeraie & dunes ensoleillées', conditionAr: 'شمس دافئة بين الواحات', conditionEn: 'Warm Palm Oasis' },
        { day: 3, temp: '26°C', condition: 'Ciel pur et dégagé', conditionAr: 'سماء نقية ومشرقة', conditionEn: 'Bright Clear Sky' }
      ]
    }
  }
];

export const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    title: 'Merzouga & Erg Chebbi',
    tag: 'Désert Magique',
    subtitle: 'Bivouac étoilé & balade en dromadaire'
  },
  {
    image: 'https://images.unsplash.com/photo-1558252277-246a06eb5535?auto=format&fit=crop&w=1200&q=80',
    title: 'Chefchaouen & Le Rif',
    tag: 'Perle Bleue',
    subtitle: 'Ruelles féeriques & coucher de soleil panoramique'
  },
  {
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    title: 'Dakhla & La Dune Blanche',
    tag: 'Sahara Océanique',
    subtitle: 'Lagon turquoise & aventure 4x4 sauvage'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    title: 'Taghazout & Paradise Valley',
    tag: 'Plage & Nature',
    subtitle: 'Surf vibes, piscines naturelles & soleil infini'
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    name: 'Youssef El Amrani',
    city: 'Casablanca',
    tripTitle: 'Désert de Merzouga VIP',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: 'Une organisation millimétrée ! Les chauffeurs étaient très prudents, le bivouac à Merzouga était digne d\'un hôtel 5 étoiles avec eau chaude et douches privées. L\'ambiance au coin du feu avec le groupe restera gravée dans ma mémoire. Merci Smart Orga !',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-2',
    name: 'Sara Benkirane',
    city: 'Rabat',
    tripTitle: 'Chefchaouen & Tanger',
    rating: 5,
    date: 'Il y a 3 semaines',
    comment: 'C\'était mon premier voyage en solo avec un groupe organisé et j\'avais quelques appréhensions. Dès la première heure, l\'équipe nous a mis à l\'aise. J\'ai rencontré des amis géniaux et les photos de Chefchaouen sont magnifiques !',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-3',
    name: 'Mehdi & Salma Tazi',
    city: 'Marrakech',
    tripTitle: 'Échappée Dakhla',
    rating: 5,
    date: 'Le mois dernier',
    comment: 'La Dune Blanche et les huîtres fraîches face au lagon : un pur bonheur. Le rapport qualité/prix est imbattable et la communication sur WhatsApp était instantanée avant et pendant le séjour. On repart avec vous à Ouzoud bientôt.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Comment réserver un séjour avec Smart Orga ?',
    answer: 'C\'est très simple et rapide ! Il vous suffit de cliquer sur le bouton "Réserver sur WhatsApp" de votre voyage favori. Un message pré-rempli avec les détails du voyage sera envoyé à nos conseillers qui vérifieront la disponibilité et finaliseront votre réservation instantanément.',
    category: 'Réservation'
  },
  {
    question: 'Quelles sont les modalités de paiement des arrhes ?',
    answer: 'Pour garantir votre place dans le groupe, un acompte de 30% à 50% est demandé par virement bancaire sécurisé (Attijariwafa, CIH Bank, BCP) ou versement en agence. Le reliquat est réglé en espèces ou virement le jour du départ.',
    category: 'Réservation'
  },
  {
    question: 'Quelles sont les villes de départ disponibles ?',
    answer: 'Nos principaux points de départ sont Casablanca (gare Casa Voyageurs) et Rabat (gare Rabat Ville). Pour certains séjours comme le désert ou le nord, nous effectuons également des ramassages à Marrakech, Kénitra, Tanger ou Meknès.',
    category: 'Transport & Hébergement'
  },
  {
    question: 'Le transport touristique et le logement sont-ils inclus ?',
    answer: 'Absolument ! Tous nos séjours comprennent le transport en autocars ou minibus touristiques récents, tout confort et climatisés, ainsi que les nuitées en hôtels de charme ou bivouacs confortablement équipés.',
    category: 'Transport & Hébergement'
  },
  {
    question: 'Puis-je voyager seul(e) et intégrer un groupe ?',
    answer: 'Tout à fait ! Près de 45% de nos participants voyagent seuls pour faire de nouvelles rencontres dans une ambiance saine, chaleureuse et sécurisée. Vous partagerez une chambre twin avec un voyageur du même sexe, ou opterez pour une chambre single en supplément.',
    category: 'Sur place'
  },
  {
    question: 'Que se passe-t-il en cas d\'imprévu ou d\'annulation ?',
    answer: 'Si vous nous prévenez au moins 7 jours avant la date du départ, votre acompte est soit remboursé intégralement (hors frais bancaires), soit reporté sans aucuns frais sur un voyage ultérieur de votre choix valable pendant 12 mois.',
    category: 'Réservation'
  }
];

export const WHATSAPP_NUMBER = '212690060366'; // Format international marocain (+212 690-060366)
export const WHATSAPP_DISPLAY = '+212 690-060366';
export const AGENCY_EMAIL = 'smartorga.travel@gmail.com';
export const AGENCY_ADDRESS = 'Casablanca / Rabat, Maroc';
