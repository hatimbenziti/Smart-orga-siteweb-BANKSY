import { Trip, Language } from '../types';

export function getTripTitle(trip: Trip, lang: Language): string {
  if (lang === 'ar') {
    switch (trip.id) {
      case 'merzouga-desert-vip': return 'سحر صحراء مرزوكة ومضايق دادس';
      case 'dakhla-lagon-kitesurf': return 'مغامرة الداخلة البرية واللاغون الأبيض';
      case 'chefchaouen-tanger-perle-bleue': return 'شفشاون الجوهرة الزرقاء ورأس سبارطيل طنجة';
      case 'agadir-taghazout-paradise': return 'تاغازوت ركوب الأمواج ووادي الجنة بأكادير';
      case 'marrakech-agafay-atlas': return 'مراكش الحمراء وليلة ساحرة في صحراء أكافاي';
      case 'ouzoud-bin-el-ouidane': return 'شلالات أوزود وبحيرة بين الويدان الخلابة';
      case 'toubkal-imlil-trek': return 'صعود قمة توبقال ووادي إمليل (4167 م)';
      case 'ouarzazate-draa-kasbahs': return 'طريق القصبات الألف ووادي درعة الخالد';
      default: return trip.title;
    }
  }
  if (lang === 'en') {
    switch (trip.id) {
      case 'merzouga-desert-vip': return 'Magic of Merzouga Desert & Dades Gorges';
      case 'dakhla-lagon-kitesurf': return 'Wild Escape to Dakhla & The White Dune';
      case 'chefchaouen-tanger-perle-bleue': return 'Chefchaouen Blue Pearl & Cape Spartel Tangier';
      case 'agadir-taghazout-paradise': return 'Taghazout Surf Vibes & Agadir Paradise Valley';
      case 'marrakech-agafay-atlas': return 'Imperial Marrakech & Night in Agafay Desert';
      case 'ouzoud-bin-el-ouidane': return 'Ouzoud Waterfalls & Bin El Ouidane Lake';
      case 'toubkal-imlil-trek': return 'Mount Toubkal Ascent & Imlil Valley (4,167 m)';
      case 'ouarzazate-draa-kasbahs': return 'Road of the Kasbahs & Draa Valley';
      default: return trip.title;
    }
  }
  return trip.title;
}

export function getTripDestination(trip: Trip, lang: Language): string {
  if (lang === 'ar') {
    switch (trip.id) {
      case 'merzouga-desert-vip': return 'مرزوكة والجنوب المغربي';
      case 'dakhla-lagon-kitesurf': return 'الداخلة والساحل الصحراوي';
      case 'chefchaouen-tanger-perle-bleue': return 'شفشاون وطنجة العالية';
      case 'agadir-taghazout-paradise': return 'تاغازوت وأكادير';
      case 'marrakech-agafay-atlas': return 'مراكش وصحراء أكافاي';
      case 'ouzoud-bin-el-ouidane': return 'الأطلس المتوسط وأزيلال';
      case 'toubkal-imlil-trek': return 'إمليل والأطلس الكبير';
      case 'ouarzazate-draa-kasbahs': return 'ورزازات وزاكورة';
      default: return trip.destination;
    }
  }
  if (lang === 'en') {
    switch (trip.id) {
      case 'merzouga-desert-vip': return 'Merzouga & Moroccan South';
      case 'dakhla-lagon-kitesurf': return 'Dakhla & Ocean Sahara';
      case 'chefchaouen-tanger-perle-bleue': return 'Chefchaouen & Tangier';
      case 'agadir-taghazout-paradise': return 'Taghazout & Agadir';
      case 'marrakech-agafay-atlas': return 'Marrakech & Agafay';
      case 'ouzoud-bin-el-ouidane': return 'Middle Atlas & Azilal';
      case 'toubkal-imlil-trek': return 'Imlil & High Atlas';
      case 'ouarzazate-draa-kasbahs': return 'Ouarzazate & Zagora';
      default: return trip.destination;
    }
  }
  return trip.destination;
}

export function getTripDuration(trip: Trip, lang: Language): string {
  if (lang === 'ar') {
    return `${trip.days} أيام / ${trip.nights} ليالي`;
  }
  if (lang === 'en') {
    return `${trip.days} days / ${trip.nights} nights`;
  }
  return trip.duration;
}

export function getTripNextDate(trip: Trip, lang: Language): string {
  if (lang === 'ar') {
    if (trip.nextDate.includes('Chaque')) return 'نهاية كل أسبوع';
    if (trip.nextDate.includes('Vendredi')) return 'الجمعة القادم';
    if (trip.nextDate.includes('Samedi')) return 'السبت القادم';
    return 'موعد الرحلة القريب';
  }
  if (lang === 'en') {
    if (trip.nextDate.includes('Chaque')) return 'Every Weekend';
    if (trip.nextDate.includes('Vendredi')) return 'Next Friday';
    if (trip.nextDate.includes('Samedi')) return 'Next Saturday';
    return trip.nextDate;
  }
  return trip.nextDate;
}

export function getTripHighlights(trip: Trip, lang: Language): string[] {
  if (lang === 'ar') {
    switch (trip.id) {
      case 'merzouga-desert-vip':
        return [
          'مبيت في مخيم صحراوي VIP بقلب كثبان عرق الشبي',
          'جولة بالجمال وقت غروب وشروق الشمس الذهبية',
          'سهرة كناوية حماسية حول موقد النار التقليدي',
          'زيارة مضايق تودغى ودادس الساحرة'
        ];
      case 'dakhla-lagon-kitesurf':
        return [
          'جولة دفع رباعي 4x4 نحو الكثيب الأبيض واللاغون الفيروزي',
          'تذوق المحار الطازج في مزارع الاستزراع البحري',
          'استجمام بمياه عين أسماء الكبريتية الدافئة (38 درجة)',
          'زيارة جزيرة التنين ومشاهدة طيور النحام الوردي'
        ];
      case 'chefchaouen-tanger-perle-bleue':
        return [
          'جولة ساحرة في الأزقة الزرقاء العتيقة لمدينة شفشاون',
          'غروب شمس بانورامي من المسجد الإسباني الشهير',
          'استكشاف مغارات هرقل والتقاء البحرين برأس سبارطيل',
          'أجواء قصبة طنجة وسوقها التقليدي النابض بالحياة'
        ];
      case 'agadir-taghazout-paradise':
        return [
          'أجواء ركوب الأمواج بقرية تاغازوت العالمية',
          'مشي واستحمام في المسابح الطبيعية لوادي الجنة',
          'إطلالة بانورامية على خليج أكادير من قصبة أوفلا',
          'تسوق زيت الأركان الطبيعي بسوق الأحد الكبير'
        ];
      default:
        return trip.highlights;
    }
  }
  if (lang === 'en') {
    switch (trip.id) {
      case 'merzouga-desert-vip':
        return [
          'Night in a VIP luxury desert bivouac in Erg Chebbi dunes',
          'Camel caravan trek at breathtaking sunset & sunrise',
          'Lively campfire evening with traditional Gnawa musicians',
          'Explore majestic Todra and Dades River Gorges'
        ];
      case 'dakhla-lagon-kitesurf':
        return [
          '4x4 safari expedition to the White Dune & turquoise lagoon',
          'Fresh oyster tasting directly facing the Atlantic Ocean',
          'Relax in the warm natural sulphur hot springs of Asnaa',
          'Explore Dragon Island and watch wild pink flamingos'
        ];
      case 'chefchaouen-tanger-perle-bleue':
        return [
          'Enchanting walk through the iconic blue medina of Chefchaouen',
          'Panoramic sunset view from the Spanish Mosque',
          'Visit Hercules Caves & legendary Cape Spartel in Tangier',
          'Vibrant Bohemian Kasbah and Petit Socco cafes'
        ];
      case 'agadir-taghazout-paradise':
        return [
          'Relaxed bohemian surf vibes in Taghazout fishermen village',
          'Trekking and swimming in the natural pools of Paradise Valley',
          'Panoramic ocean sunset from ancient Agadir Oufella Kasbah',
          'Shopping for pure Argan oil and spices in Souk El Had'
        ];
      default:
        return trip.highlights;
    }
  }
  return trip.highlights;
}
