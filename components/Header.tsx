import React from 'react';
import { ChefHat, UtensilsCrossed } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <ChefHat size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-800 leading-none">MonsieurChef AI</h1>
            <span className="text-xs font-medium text-emerald-600/80">Tu asistente de cocina inteligente</span>
          </div>
        </div>
        <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">
          <UtensilsCrossed size={14} />
          <span>Powered by Gemini 2.0</span>
        </a>
      </div>
    </header>
  );
};