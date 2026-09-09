import { WHATSAPP_NUMBER } from '../data/tripsData';
import { Trip, BookingFormData, Language } from '../types';
import { getTripTitle, getTripDuration } from './localized';

/**
 * Builds a direct WhatsApp reservation URL with pre-filled text in the user's language
 */
export function createTripWhatsAppUrl(
  trip: Trip,
  options?: { date?: string; people?: number; city?: string; notes?: string; lang?: Language }
): string {
  const lang = options?.lang || 'fr';
  const chosenDate = options?.date || trip.nextDate;
  const travelers = options?.people || 2;
  const title = getTripTitle(trip, lang);
  const duration = getTripDuration(trip, lang);

  let message = '';

  if (lang === 'ar') {
    const cityText = options?.city ? ` من مدينة ${options.city}` : '';
    const notesText = options?.notes ? `\n• ملاحظة: ${options.notes}` : '';
    message = `السلام عليكم فريق سمارت أورغا 👋
أود حجز مقاعد في الرحلة السياحية التالية:
📍 *${title}* (${duration})
💰 السعر: ${trip.priceMAD.toLocaleString()} درهم مغربي / للشخص
👥 عدد المسافرين: ${travelers} مسافر${cityText}
📅 التاريخ المرغوب: ${chosenDate}${notesText}

هل لا زالت المقاعد متوفرة؟ وكيف يمكنني تأكيد الحجز ومقدم الأداء؟ شكراً جزيلاً لكم !`;
  } else if (lang === 'en') {
    const cityText = options?.city ? ` departing from ${options.city}` : '';
    const notesText = options?.notes ? `\n• Note: ${options.notes}` : '';
    message = `Hello Smart Orga team 👋
I would like to reserve the following trip:
📍 *${title}* (${duration})
💰 Price: ${trip.priceMAD.toLocaleString()} MAD / person
👥 Number of travelers: ${travelers} person(s)${cityText}
📅 Preferred date: ${chosenDate}${notesText}

Could you please confirm remaining availability and booking details? Thank you!`;
  } else {
    const cityText = options?.city ? ` au départ de ${options.city}` : '';
    const notesText = options?.notes ? `\n• Remarque : ${options.notes}` : '';
    message = `Bonjour l'équipe Smart Orga 👋
Je souhaite réserver le séjour suivant :
📍 *${title}* (${duration})
💰 Tarif : ${trip.priceMAD.toLocaleString()} MAD / personne
👥 Nombre de voyageurs : ${travelers} personne(s)${cityText}
📅 Date souhaitée : ${chosenDate}${notesText}

Pourriez-vous me confirmer les disponibilités restantes et les modalités pour valider la réservation ? Merci d'avance !`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds WhatsApp URL from the booking modal form data
 */
export function createFormBookingWhatsAppUrl(data: BookingFormData, trip: Trip, lang: Language = 'fr'): string {
  const title = getTripTitle(trip, lang);

  if (lang === 'ar') {
    const message = `السلام عليكم سمارت أورغا 👋
أرغب في تأكيد حجز لرحلة:
📍 *${title}*
• المسافر الرئيسي: ${data.fullName || 'غير محدد'}
• الهاتف: ${data.phone || 'غير محدد'}
• عدد المسافرين: ${data.travelersCount}
• مدينة الانطلاق: ${data.departureCity}
• التاريخ المقترح: ${data.departureDate}
• السعر للشخص: ${trip.priceMAD.toLocaleString()} درهم${data.customNotes ? `\n• ملاحظات: ${data.customNotes}` : ''}

شكراً لإفادتي بتفاصيل تأكيد الحجز وإرسال العربون !`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  if (lang === 'en') {
    const message = `Hello Smart Orga 👋
I would like to confirm my booking request for:
📍 *${title}*
• Lead Traveler: ${data.fullName || 'Not specified'}
• Phone: ${data.phone || 'Not specified'}
• Travelers: ${data.travelersCount}
• Departure city: ${data.departureCity}
• Preferred date: ${data.departureDate}
• Price per pers: ${trip.priceMAD.toLocaleString()} MAD${data.customNotes ? `\n• Notes: ${data.customNotes}` : ''}

Please let me know how to proceed with the deposit and confirmation!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  const message = `Bonjour Smart Orga 👋
Je vous contacte pour confirmer une réservation pour :
📍 *${title}*
• Voyageur principal : ${data.fullName || 'Non spécifié'}
• Téléphone : ${data.phone || 'Non spécifié'}
• Nombre de personnes : ${data.travelersCount}
• Ville de départ souhaitée : ${data.departureCity}
• Date envisagée : ${data.departureDate}
• Tarif indicatif : ${trip.priceMAD.toLocaleString()} MAD / pers${data.customNotes ? `\n• Remarque : ${data.customNotes}` : ''}

Merci de m'indiquer la marche à suivre pour l'acompte et l'organisation du départ !`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds WhatsApp URL for general inquiry / custom trip
 */
export function createGeneralWhatsAppUrl(subject?: string, lang: Language = 'fr'): string {
  let text = '';
  if (lang === 'ar') {
    text = subject
      ? `السلام عليكم سمارت أورغا ! أود الاستفسار بخصوص: *${subject}*. هل يمكنكم مساعدتي ؟`
      : `السلام عليكم سمارت أورغا ! أبحث عن معلومات حول رحلاتكم المنظمة في المغرب ومواعيد الانطلاق القادمة.`;
  } else if (lang === 'en') {
    text = subject
      ? `Hello Smart Orga! I would like more information about: *${subject}*. Could you please assist me?`
      : `Hello Smart Orga! I'm interested in joining an organized tour in Morocco. Could you share your upcoming departure dates?`;
  } else {
    text = subject
      ? `Bonjour Smart Orga ! Je souhaite avoir des informations concernant : *${subject}*. Pourriez-vous m'aider ?`
      : `Bonjour Smart Orga ! Je cherche des renseignements pour un voyage organisé au Maroc. Pourriez-vous me renseigner sur vos prochains départs ?`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds WhatsApp URL for Sur-Mesure request
 */
export function createSurMesureWhatsAppUrl(
  data: {
    destination: string;
    duration: string;
    groupSize: string;
    budget: string;
    date: string;
    comments: string;
  },
  lang: Language = 'fr'
): string {
  if (lang === 'ar') {
    const message = `السلام عليكم سمارت أورغا 👋
أرغب في تنظيم *رحلة خاصة / مجموعة خاصة* في المغرب:
📍 الوجهة المطلوبة: ${data.destination || 'للاقتراح معاً'}
⏳ المدة المقترحة: ${data.duration}
👥 حجم المجموعة: ${data.groupSize}
📅 الفترة أو الموعد: ${data.date || 'مرن'}
💵 الميزانية التقريبية للشخص: ${data.budget || 'للنقاش'}
📝 متطلبات خاصة: ${data.comments || 'لا يوجد'}

هل يمكنكم تزويدي ببرنامج مخصص وعرض سعر مناسب؟ شكراً جزيلاً !`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  if (lang === 'en') {
    const message = `Hello Smart Orga 👋
I would like to organize a *Custom Private Tour* in Morocco:
📍 Destination: ${data.destination || 'Open to recommendations'}
⏳ Duration: ${data.duration}
👥 Group size: ${data.groupSize}
📅 Period / Date: ${data.date || 'Flexible'}
💵 Estimated budget / pers: ${data.budget || 'To discuss'}
📝 Specific requests: ${data.comments || 'None'}

Could you please provide a tailored itinerary and quotation? Thank you!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  const message = `Bonjour Smart Orga 👋
Je souhaite organiser un *Voyage Sur-Mesure / Groupe Privé* au Maroc :
📍 Destination : ${data.destination || 'À définir avec vous'}
⏳ Durée estimée : ${data.duration}
👥 Nombre de personnes : ${data.groupSize}
📅 Période envisagée : ${data.date || 'Flexible'}
💵 Budget approximatif par personne : ${data.budget || 'À discuter'}
📝 Détails particuliers : ${data.comments || 'Aucun'}

Pouvez-vous me proposer un itinéraire personnalisé et un devis adapté ? Merci !`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
