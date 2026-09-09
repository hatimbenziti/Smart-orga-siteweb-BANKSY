import React, { useState } from 'react';
import { FAQ_DATA } from '../data/tripsData';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language, t, isRTL } = useLanguage();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getLocalizedFAQ = (item: typeof FAQ_DATA[0], idx: number) => {
    if (language === 'ar') {
      switch (idx) {
        case 0:
          return {
            q: 'كيف تتم عملية الحجز عبر تطبيق واتساب ؟',
            a: 'العملية في غاية السهولة: اضغط على زر "احجز عبر واتساب" الخاص بالرحلة التي اخترتها. سيتم إنشاء رسالة جاهزة تلقائياً تتضمن اسم الرحلة وتاريخ الانطلاق وعدد المسافرين. يقوم فريقنا بالإجابة فوراً وتأكيد المقاعد الشاغرة وإرشادكم حول دفع العربون.'
          };
        case 1:
          return {
            q: 'ما هي مدن الانطلاق ونقاط التجمع ؟',
            a: 'تنطلق رحلاتنا أساساً من مدينة الدار البيضاء (محطة القطار كازا بورت / كازا فواياجور) ومدينة الرباط (محطة قطار الرباط المدينة). وبالنسبة لرحلات الشمال أو الجنوب، نوفر محطات توقف إضافية بالقنيطرة وطنجة ومراكش حسب مسار الرحلة.'
          };
        case 2:
          return {
            q: 'ما هي الشروط في حال الرغبة في إلغاء الحجز ؟',
            a: 'يمكنكم الإلغاء واسترداد العربون كاملاً حتى 5 أيام قبل موعد الانطلاق. في حال الإلغاء بين 48 و72 ساعة، يمكنكم ترحيل العربون إلى رحلة أخرى من اختياركم في غضون 6 أشهر.'
          };
        case 3:
          return {
            q: 'هل يمكنني السفر بمفردي (Solo Traveler) والانضمام لمجموعة ؟',
            a: 'نعم بكل تأكيد ! أكثر من 40% من مسافرينا يشاركون بمفردهم. نوفر لكم إمكانية حجز غرفة أو خيمة مشتركة مع شخص من نفس الجنس لتفادي أي مصاريف إضافية، وتتميز مجموعاتنا بأجواء ودية وأخوية.'
          };
        case 4:
          return {
            q: 'هل وسائل النقل والإقامات ذات جودة وضمانة ؟',
            a: 'جميع حافلاتنا وسياراتنا السياحية مرخصة من وزارة السياحة وتخضع لمعايير صيانة دورية دقيقة ومزودة بتكييف شامل وتأمين للمسافرين. كما نقوم بفحص الفنادق والمخيمات الصحراوية شخصياً لضمان النظافة والراحة التامة.'
          };
        default:
          return { q: item.question, a: item.answer };
      }
    }
    if (language === 'en') {
      switch (idx) {
        case 0:
          return {
            q: 'How does the WhatsApp booking process work?',
            a: 'It is quick and straightforward: click on any "Book on WhatsApp" button. A pre-filled message is generated with the tour name, departure date, and group size. Our advisors confirm availability instantly and guide you through confirming your deposit.'
          };
        case 1:
          return {
            q: 'Which cities do the tours depart from?',
            a: 'Most of our tours depart from Casablanca (Casa Voyageurs train station) and Rabat (Rabat Ville station). Depending on the route to the North or South, pickup stops are available in Kenitra, Tangier, or Marrakech.'
          };
        case 2:
          return {
            q: 'What is the cancellation and refund policy?',
            a: 'Free cancellation with a full refund of your deposit is available up to 5 days before departure. Between 48 and 72 hours prior, your deposit can be rolled over to any future trip within 6 months.'
          };
        case 3:
          return {
            q: 'Can I travel solo and join a group?',
            a: 'Absolutely! Over 40% of our travelers join on their own. We arrange shared twin rooms or luxury bivouacs with a fellow traveler of the same gender so you never pay single supplements, unless you prefer a private room.'
          };
        case 4:
          return {
            q: 'Are the tourist transport and stays verified and certified?',
            a: '100% of our vehicles are fully licensed by the Moroccan Ministry of Tourism with comprehensive passenger liability insurance. Hotels and luxury desert camps are personally audited for hygiene, comfort, and hot water amenities.'
          };
        default:
          return { q: item.question, a: item.answer };
      }
    }
    return { q: item.question, a: item.answer };
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            {t.faqBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            const localized = getLocalizedFAQ(item, index);
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 overflow-hidden transition-all bg-white shadow-xs"
              >
                <button
                  onClick={() => toggle(index)}
                  className={`w-full px-5 py-4 ${isRTL ? 'text-right' : 'text-left'} flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors cursor-pointer bg-slate-50/50 hover:bg-slate-50`}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100/60 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span>{localized.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white animate-in fade-in duration-200">
                    <p>{localized.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reassurance banner below FAQ */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.faqExtraTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.faqExtraDesc}
            </p>
          </div>
          <a
            href={createGeneralWhatsAppUrl('Question avant réservation', language)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t.faqExtraBtn}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
