import React, { useState } from 'react';
import { ChefHat, UtensilsCrossed, LogOut, User as UserIcon, BookHeart } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onMyRecipesClick: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, onMyRecipesClick, onLogoClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div 
          className="flex items-center gap-2 text-emerald-600 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={onLogoClick}
        >
          <div className="p-2 bg-emerald-100 rounded-lg">
            <ChefHat size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-800 leading-none">MonsieurChef AI</h1>
            <span className="text-xs font-medium text-emerald-600/80">Tu asistente de cocina inteligente</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors mr-2">
            <UtensilsCrossed size={14} />
            <span className="hidden md:inline">Powered by Gemini 2.0</span>
          </a>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate hidden sm:block">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-fade-in-up">
                    <button 
                      onClick={() => { setShowMenu(false); onMyRecipesClick(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                    >
                      <BookHeart size={16} />
                      Mis Recetas
                    </button>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button 
                      onClick={() => { setShowMenu(false); onLogoutClick(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
            >
              <UserIcon size={16} />
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};