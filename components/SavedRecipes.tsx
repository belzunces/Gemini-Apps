import React from 'react';
import { SavedRecipe } from '../types';
import { Clock, Users, Trash2, ChevronRight, ChefHat } from 'lucide-react';

interface SavedRecipesProps {
  recipes: SavedRecipe[];
  onSelect: (recipe: SavedRecipe) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const SavedRecipes: React.FC<SavedRecipesProps> = ({ recipes, onSelect, onDelete, onBack }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mis Recetas Guardadas</h2>
          <p className="text-slate-500">Tu colección personal de adaptaciones.</p>
        </div>
        <button 
          onClick={onBack}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          Nueva Conversión
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-700">Aún no tienes recetas</h3>
          <p className="text-slate-500 mt-1">Convierte tu primera receta para guardarla aquí.</p>
          <button onClick={onBack} className="mt-4 text-emerald-600 font-semibold hover:underline">Ir al convertidor</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group relative overflow-hidden flex flex-col">
               <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="p-6 flex-1 cursor-pointer" onClick={() => onSelect(recipe)}>
                 <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                   {recipe.title}
                 </h3>
                 <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                   {recipe.description}
                 </p>
                 
                 <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-auto">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{recipe.totalTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{recipe.servings} p.</span>
                    </div>
                 </div>
               </div>

               <div className="border-t border-slate-100 p-3 bg-slate-50 flex justify-between items-center">
                  <span className="text-xs text-slate-400 px-2">
                    {new Date(recipe.savedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar receta"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={() => onSelect(recipe)}
                      className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Ver receta"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};