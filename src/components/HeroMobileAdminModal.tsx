import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Check, 
  Eye, 
  Sliders, 
  Image as ImageIcon, 
  Layers, 
  Sparkles, 
  AlertCircle,
  SunMedium,
  Maximize2,
  Mountain,
  Palmtree,
  Users
} from 'lucide-react';
import { 
  getHeroMobileConfig, 
  saveHeroMobileConfig, 
  restoreDefaultHeroMobileConfig, 
  deleteCustomHeroMobileImage, 
  DEFAULT_HERO_MOBILE_CONFIG,
  HeroMobileConfig 
} from '../services/heroMobileService';

interface HeroMobileAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeroMobileAdminModal: React.FC<HeroMobileAdminModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<HeroMobileConfig>(getHeroMobileConfig());
  const [previewImage, setPreviewImage] = useState<string>(config.image);
  const [position, setPosition] = useState<'center' | 'left' | 'right'>(config.position);
  const [fit, setFit] = useState<'contain' | 'cover'>(config.fit || 'cover');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(config.overlayOpacity);
  const [brightness, setBrightness] = useState<'normal' | 'dimmed' | 'dark'>(config.brightness);
  const [enabled, setEnabled] = useState<boolean>(config.enabled);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronisation lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      const current = getHeroMobileConfig();
      setConfig(current);
      setPreviewImage(current.image);
      setPosition(current.position);
      setFit(current.fit || 'cover');
      setOverlayOpacity(current.overlayOpacity);
      setBrightness(current.brightness);
      setEnabled(current.enabled);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Gestion du téléversement de fichier (Upload / Replace)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setEnabled(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Enregistrer (Save)
  const handleSave = () => {
    const updated = saveHeroMobileConfig({
      image: previewImage,
      position,
      fit,
      overlayOpacity,
      brightness,
      enabled
    });
    setConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Rétablir par défaut (Restore Default)
  const handleRestoreDefault = () => {
    if (window.confirm('Voulez-vous rétablir l\'image et les réglages du Hero Mobile par défaut ?')) {
      const def = restoreDefaultHeroMobileConfig();
      setConfig(def);
      setPreviewImage(def.image);
      setPosition(def.position);
      setFit(def.fit || 'cover');
      setOverlayOpacity(def.overlayOpacity);
      setBrightness(def.brightness);
      setEnabled(def.enabled);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Supprimer l'image personnalisée (Delete)
  const handleDeleteCustomImage = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image d\'arrière-plan mobile ?')) {
      const del = deleteCustomHeroMobileImage();
      setConfig(del);
      setPreviewImage('');
      setEnabled(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Galerie rapide de choix d'images existantes
  const sampleImages = [
    { label: 'Désert Merzouga', path: '/assets/merzouga.png' },
    { label: 'Cascades Akchour', path: '/assets/akchour.png' },
    { label: 'Smart Orga Aventure', path: '/images/uploads/9786b470-4b6b-4b95-853a-fe87fd59719f-2-.webp' },
    { label: 'Dunes Sahariennes', path: '/images/uploads/bfc517ab-61e1-48e5-b0ba-cb7061a6c46c.png' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Image Hero — Mobile
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Mobile Uniquement
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Contrôle l'arrière-plan affiché sur smartphone (&lt; 768px). La version Ordinateur et Tablette reste inchangée.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Toast Bar */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-inner animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Modifications enregistrées ! L'image est active en direct sur la version mobile.</span>
            </div>
            <span className="text-[11px] opacity-80">Enregistré</span>
          </div>
        )}

        {/* Content Body (Grid 2 cols: Controls on left, Live Mockup on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto flex-1">
          
          {/* Left Column: Image upload, position, overlay and brightness */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Upload & Replace Area */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>1. Image du Hero Mobile</span>
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/70' 
                    : 'border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      Cliquez pour téléverser ou glissez une image
                    </span>
                    <span className="text-xs text-slate-500">
                      Recommandé : format vertical ou carré haute résolution (WebP, JPG, PNG)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample images pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Ou choisir une image existante du site :
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleImages.map((s) => (
                    <button
                      key={s.path}
                      type="button"
                      onClick={() => {
                        setPreviewImage(s.path);
                        setEnabled(true);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        previewImage === s.path 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Image Position (Left, Center, Right) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>2. Cadrage / Position de l'image</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'left', label: 'Gauche (Left)' },
                  { id: 'center', label: 'Centre (Center)' },
                  { id: 'right', label: 'Droite (Right)' }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      position === pos.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Dimensionnement / Format d'affichage (Taille exacte vs Remplir l'écran) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-blue-600" />
                  <span>3. Format d'affichage & Taille de l'image</span>
                </label>
                <span className="text-xs font-bold text-blue-600">
                  {fit === 'contain' ? 'Taille 100% exacte (Sans couper)' : 'Remplir l\'écran (Cover)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFit('contain')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    fit === 'contain'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${fit === 'contain' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    Taille exacte (Contain)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Affiche 100% de l'image dans ses dimensions réelles. Rien n'est rogné ni coupé.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFit('cover')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    fit === 'cover'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${fit === 'cover' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    Remplir l'écran (Cover)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Étend l'image pour recouvrir tout l'arrière-plan de l'écran mobile.
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Opacité & Netteté de l'image (10% à 100%) */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>4. Opacité & Netteté de l'image : {overlayOpacity}%</span>
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    overlayOpacity === 100 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : overlayOpacity >= 75 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {overlayOpacity === 100 ? '100% - Clean & Nette' : overlayOpacity >= 75 ? 'Haute netteté' : overlayOpacity >= 50 ? 'Modérée' : 'Estompée'}
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>10% (très estompée)</span>
                  <div className="flex gap-1.5">
                    {[50, 70, 85, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setOverlayOpacity(val)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          overlayOpacity === val
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {val === 100 ? '100% (Clean)' : `${val}%`}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  À 100%, l'image apparaît dans sa netteté et clarté maximale sans aucun voile. Ajustez selon votre goût pour doser la présence de la photo.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <SunMedium className="w-4 h-4 text-blue-600" />
                  <span>Luminosité de la photo (Brightness)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Normale (100%)' },
                    { id: 'dimmed', label: 'Légère (90%)' },
                    { id: 'dark', label: 'Sombre (75%)' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBrightness(b.id as any)}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        brightness === b.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activer / Désactiver */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Activer l'image en fond d'écran sur mobile
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Si désactivé, le mobile utilise le dégradé classique sans image.
                </span>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer accent-blue-600"
              />
            </div>

            {/* Actions: Save, Delete, Restore */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </button>

              <button
                type="button"
                onClick={handleRestoreDefault}
                className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Rétablir l'image et réglages par défaut"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Rétablir défaut</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteCustomImage}
                className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Supprimer l'image mobile personnalisée"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>

          </div>

          {/* Right Column: Authentic Live Smartphone Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[310px] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Aperçu Mobile en direct</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  &lt; 768px uniquement
                </span>
              </div>

              {/* Phone Frame */}
              <div className="relative w-full aspect-[9/16] max-h-[500px] rounded-[36px] bg-slate-950 p-3 shadow-2xl border-[5px] border-slate-900 overflow-hidden flex flex-col">
                {/* Phone Speaker & Camera notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 mr-2"></div>
                  <div className="w-8 h-1 rounded-full bg-slate-800"></div>
                </div>

                {/* Inner Screen Content */}
                <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-slate-50 flex flex-col justify-between px-4 py-5 select-none border border-slate-200">
                  {/* Real Mobile Hero Background */}
                  {enabled && previewImage && (
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
                      <img
                        src={previewImage}
                        alt="Hero Mobile Preview"
                        className={`w-full h-full ${
                          fit === 'cover' ? 'object-cover' : 'object-contain'
                        } transition-all duration-200 ${
                          position === 'left' ? 'object-left' :
                          position === 'right' ? 'object-right' : 'object-center'
                        } ${
                          brightness === 'dimmed' ? 'brightness-90' :
                          brightness === 'dark' ? 'brightness-75' : 'brightness-100'
                        }`}
                        style={{
                          opacity: Math.min(1, Math.max(0.1, overlayOpacity / 100))
                        }}
                      />
                      {/* Transition subtile vers le bas de l'écran */}
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50/90 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Real Mobile Hero Content: Badge -> Headline (Haut) */}
                  <div className="relative z-20 space-y-2 mt-2">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50/90 backdrop-blur-xs border border-blue-200/80 text-blue-700 text-[9px] font-bold tracking-wide uppercase shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                      <span>VOYAGEZ EN TOUTE QUIÉTUDE</span>
                    </div>

                    <h1 className="text-sm font-extrabold text-slate-900 leading-tight mt-1">
                      Voyagez en groupe et{' '}
                      <span className="text-blue-600">
                        Créez des souvenirs
                      </span>{' '}
                      avec Smart Orga
                    </h1>

                    {/* Tagline mockup */}
                    <div className="pt-0.5 space-y-0.5">
                      <div className="text-[7px] font-extralight tracking-[0.2em] text-slate-800 uppercase">
                        DESTINATIONS AUTHENTIQUES
                      </div>
                      <div className="flex items-center gap-1 text-[7px] font-extralight tracking-[0.2em] text-slate-800 uppercase">
                        <span className="w-3 h-[0.75px] bg-slate-700/60 inline-block shrink-0"></span>
                        <span>EXPÉRIENCES INOUBLIABLES</span>
                      </div>
                    </div>

                    {/* 3 Piliers mockup */}
                    <div className="grid grid-cols-3 w-[75%] max-w-[200px] pt-1">
                      <div className="flex flex-col items-center text-center pr-1">
                        <Mountain className="w-3.5 h-3.5 text-blue-700/80 mb-0.5" strokeWidth={1.4} />
                        <span className="text-[6px] font-light uppercase leading-tight text-slate-800">
                          NATURE<br />& AVENTURE
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-center px-1 border-x border-slate-300/80">
                        <Users className="w-3.5 h-3.5 text-blue-700/80 mb-0.5" strokeWidth={1.4} />
                        <span className="text-[6px] font-light uppercase leading-tight text-slate-800">
                          VOYAGES<br />EN GROUPE
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-center pl-1">
                        <Palmtree className="w-3.5 h-3.5 text-blue-700/80 mb-0.5" strokeWidth={1.4} />
                        <span className="text-[6px] font-light uppercase leading-tight text-slate-800">
                          DÉCOUVERTE<br />& CULTURE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons (Bas gauche compacts et rehaussés) */}
                  <div className="relative z-20 flex flex-col items-start gap-1 mt-auto mb-5 pt-1">
                    <div className="w-[62%] py-1.5 px-2.5 rounded-lg bg-blue-600 text-white font-bold text-[10px] text-center shadow-xs flex items-center justify-center gap-1">
                      <span className="truncate">Découvrir nos séjours</span>
                      <span>→</span>
                    </div>

                    <div className="w-[62%] py-1.5 px-2.5 rounded-lg bg-white/95 backdrop-blur-xs text-slate-800 border border-slate-200 font-bold text-[10px] text-center shadow-xs flex items-center justify-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                      <span className="truncate">Voyages Populaires</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Info note */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                Position : <strong className="capitalize">{position}</strong> • Voile : <strong>{overlayOpacity}%</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>Disponible dans Decap CMS sous <strong>Configuration &gt; Image Hero — Mobile</strong>.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
