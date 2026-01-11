import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

interface InputFormProps {
  onConvert: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onConvert, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for Gemini API if present (though inlineData usually expects raw base64, 
        // the client example often handles stripping or the SDK might need raw. 
        // For simplicity in the service we passed the full string, but let's strip here to be safe if needed,
        // Actually, the Service example usually takes base64 data. 
        // Let's keep the `data:image...` prefix for display, and strip it before sending to service.
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !selectedImage) return;
    
    // Strip prefix for API
    const rawBase64 = selectedImage ? selectedImage.split(',')[1] : undefined;
    onConvert(text, rawBase64);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipe-text" className="block text-sm font-semibold text-slate-700 mb-2">
            Pega tu receta aquí
          </label>
          <textarea
            id="recipe-text"
            className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-slate-700 placeholder:text-slate-400"
            placeholder="Ej: Risotto de setas: Ingredientes... Pasos..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            O sube una foto de la receta
          </label>
          
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
            >
              <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-emerald-100 transition-colors">
                <Upload className="text-slate-400 group-hover:text-emerald-600" size={24} />
              </div>
              <p className="text-sm text-slate-600 font-medium">Click para subir imagen</p>
              <p className="text-xs text-slate-400 mt-1">Soporta JPG, PNG</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
              <img src={selectedImage} alt="Recipe preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || (!text && !selectedImage)}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
            ${isLoading || (!text && !selectedImage)
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Cocinando la conversión...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Convertir Receta</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};