import React, { useState, useEffect, useRef } from 'react';
import { Star, X, CheckCircle2, Heart, Send, AlertCircle, Loader2, Camera, Trash2, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitReview } from '../services/reviewsService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_TRIP_SUGGESTIONS = [
  'Désert de Merzouga & Ouarzazate',
  'Dakhla & La Dune Blanche',
  'Chefchaouen & Cascades d\'Akchour',
  'Ouzoud, Marrakech & Béni Mellal',
  'Tanger & Belyounech',
  'Évasion à Istanbul',
  'Agafay, Imlil & Palmeraie'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { language, isRTL } = useLanguage();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [trip, setTrip] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot

  // Photo upload states (Optional photo)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoFileSize, setPhotoFileSize] = useState<string>('');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Reset form states
      setName('');
      setCity('');
      setTrip('');
      setRating(5);
      setHoverRating(null);
      setComment('');
      setHoneypot('');
      setPhotoPreview(null);
      setPhotoFileName('');
      setPhotoFileSize('');
      setPhotoError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setErrors({});
      setServerError(null);
      setIsSuccess(false);
      setIsSubmitting(false);

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handles photo selection with strict 5MB and format check
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['jpg', 'jpeg', 'png', 'webp'];

    if (!validTypes.includes(file.type) && (!ext || !validExts.includes(ext))) {
      setPhotoError('Format non supporté. Veuillez sélectionner une photo au format JPG, PNG ou WEBP.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check size limit: max 5 MB (5 * 1024 * 1024 bytes)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      setPhotoError(`La taille du fichier (${sizeInMb} Mo) dépasse la limite autorisée de 5 Mo.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Format human-readable size
    const sizeStr = file.size < 1024 * 1024
      ? `${Math.round(file.size / 1024)} Ko`
      : `${(file.size / (1024 * 1024)).toFixed(1)} Mo`;
    setPhotoFileSize(sizeStr);
    setPhotoFileName(file.name);

    // Read file as Base64 Data URL for preview and payload
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
      }
    };
    reader.onerror = () => {
      setPhotoError("Impossible de charger la photo sélectionnée. Veuillez réessayer.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFileName('');
    setPhotoFileSize('');
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Veuillez indiquer votre nom complet.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Le nom doit comporter au moins 2 caractères.';
    }

    if (!city.trim()) {
      newErrors.city = 'Veuillez indiquer votre ville de résidence.';
    }

    if (!trip.trim()) {
      newErrors.trip = 'Veuillez indiquer le séjour ou le circuit effectué.';
    }

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Veuillez sélectionner une note entre 1 et 5 étoiles.';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Veuillez rédiger votre avis.';
    } else if (comment.trim().length < 10) {
      newErrors.comment = `Votre commentaire est trop court (${comment.trim().length}/10 caractères minimum).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReview({
        name,
        city,
        trip,
        rating,
        comment,
        photo: photoPreview || null,
        honeypot
      });

      setIsSuccess(true);

      // Automatically close modal after 3.5 seconds
      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (err: any) {
      setServerError(
        err.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 1:
        return '1 / 5 - Décevant';
      case 2:
        return '2 / 5 - Moyen';
      case 3:
        return '3 / 5 - Bien';
      case 4:
        return '4 / 5 - Très bien';
      case 5:
      default:
        return '5 / 5 - Exceptionnel !';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 sm:px-7 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div>
            <h3
              id="review-modal-title"
              className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"
            >
              <span>Laisser un avis</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Partagez votre expérience avec la communauté Smart Orga
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            aria-label="Fermer la fenêtre"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-7 overflow-y-auto min-h-0 flex-1">
          {/* SUCCESS STATE */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="text-xl font-bold text-slate-900">
                  Merci pour votre avis ! ❤️
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Votre témoignage sera publié après validation par notre équipe Smart Orga.
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block text-xs text-slate-400">
                  Fermeture automatique dans quelques secondes...
                </span>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Server-level error */}
              {serverError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Honeypot field for bot protection (hidden from humans) */}
              <div className="sr-only" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="hp_field">Ne pas remplir ce champ</label>
                <input
                  id="hp_field"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Row 1: Nom & Ville */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Nom */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="review-name"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Nom & Prénom <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Ex. Yassine Alaoui"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all ${
                      errors.name
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Ville */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="review-city"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Ville de résidence <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="review-city"
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    placeholder="Ex. Casablanca, Rabat..."
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all ${
                      errors.city
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Voyage effectué */}
              <div className="space-y-1.5">
                <label
                  htmlFor="review-trip"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Voyage effectué <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="review-trip"
                    type="text"
                    list="trips-list"
                    value={trip}
                    onChange={(e) => {
                      setTrip(e.target.value);
                      if (errors.trip) setErrors((prev) => ({ ...prev, trip: '' }));
                    }}
                    placeholder="Ex. Désert de Merzouga, Dakhla, Chefchaouen..."
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all ${
                      errors.trip
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  <datalist id="trips-list">
                    {POPULAR_TRIP_SUGGESTIONS.map((sugg, i) => (
                      <option key={i} value={sugg} />
                    ))}
                  </datalist>
                </div>
                {errors.trip && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.trip}</p>
                )}
              </div>

              {/* Row 3: Note (1 à 5 étoiles) */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Votre note globale <span className="text-rose-500">*</span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200/80 rounded-xl">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled =
                        (hoverRating !== null ? hoverRating : rating) >= starValue;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => {
                            setRating(starValue);
                            if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                          }}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-hidden"
                          aria-label={`Attribuer ${starValue} étoiles sur 5`}
                        >
                          <Star
                            className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400 drop-shadow-2xs'
                                : 'text-slate-300 fill-slate-200'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-semibold text-slate-600">
                    {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.rating}</p>
                )}
              </div>

              {/* Row 4: Commentaire */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="review-comment"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Votre avis / commentaire <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] ${
                      comment.trim().length >= 10 ? 'text-slate-400' : 'text-amber-600 font-medium'
                    }`}
                  >
                    {comment.trim().length} / 10 car. min.
                  </span>
                </div>
                <textarea
                  id="review-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (errors.comment) setErrors((prev) => ({ ...prev, comment: '' }));
                  }}
                  placeholder="Partagez vos impressions : l'ambiance, les visites, les hébergements, les guides... Votre expérience aidera nos prochains voyageurs !"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all resize-y ${
                    errors.comment
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.comment && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.comment}</p>
                )}
              </div>

              {/* Row 5: Ajouter une photo (Optionnel) */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Ajouter une photo <span className="text-slate-400 font-normal">(optionnel)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG ou WEBP • 5 Mo max
                  </span>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                />

                {/* Button state if no photo selected */}
                {!photoPreview ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/80 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-2xs group active:scale-98"
                    >
                      <Camera className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span>📷 Ajouter une photo</span>
                    </button>
                  </div>
                ) : (
                  /* Photo preview & Delete option */
                  <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200/90 shrink-0 bg-white shadow-2xs">
                        <img
                          src={photoPreview}
                          alt="Prévisualisation de votre photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {photoFileName || 'Photo sélectionnée'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {photoFileSize || ''}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Photo prête à l'envoi</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Supprimer la photo</span>
                      <span className="sm:hidden">Supprimer</span>
                    </button>
                  </div>
                )}

                {/* Photo Error display */}
                {photoError && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{photoError}</span>
                  </p>
                )}
              </div>

              {/* Buttons: Envoyer / Annuler */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 text-center"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer mon avis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
