import React from 'react';
import { Clock, Users, Thermometer, Gauge, RotateCw, Timer, CheckCircle2, ChefHat, PlayCircle } from 'lucide-react';
import { Recipe, RecipeStep, MccSettings } from '../types';

interface RecipeResultProps {
  recipe: Recipe;
}

const SettingBadge: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass?: string }> = ({ icon, label, value, colorClass = "bg-slate-100 text-slate-700" }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
    {icon}
    <span>{value}</span>
  </div>
);

const StepCard: React.FC<{ step: RecipeStep; index: number }> = ({ step, index }) => {
  const hasSettings = step.settings && (step.settings.time || step.settings.temp || step.settings.speed);

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-200 last:hidden"></div>
      
      {/* Step Number Bubble */}
      <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold z-10 shadow-sm ring-4 ring-white">
        {index + 1}
      </div>

      <div className={`bg-white rounded-xl border ${hasSettings ? 'border-emerald-200 shadow-sm' : 'border-slate-100'} p-4 transition-all hover:border-emerald-300`}>
        <p className="text-slate-700 leading-relaxed mb-3">{step.instruction}</p>
        
        {hasSettings && step.settings && (
          <div className="bg-emerald-50/50 rounded-lg p-3 flex flex-wrap gap-2 border border-emerald-100/50">
            {step.settings.time && (
              <SettingBadge 
                icon={<Timer size={14} />} 
                label="Tiempo" 
                value={step.settings.time} 
                colorClass="bg-blue-100 text-blue-700"
              />
            )}
            {step.settings.temp && (
              <SettingBadge 
                icon={<Thermometer size={14} />} 
                label="Temp" 
                value={step.settings.temp} 
                colorClass="bg-orange-100 text-orange-700"
              />
            )}
            {step.settings.speed && (
              <SettingBadge 
                icon={<Gauge size={14} />} 
                label="Vel" 
                value={step.settings.speed} 
                colorClass="bg-purple-100 text-purple-700"
              />
            )}
            {step.settings.reverse && (
              <SettingBadge 
                icon={<RotateCw size={14} />} 
                label="Giro" 
                value="Inverso" 
                colorClass="bg-indigo-100 text-indigo-700"
              />
            )}
            {step.settings.accessory && (
              <SettingBadge 
                icon={<ChefHat size={14} />} 
                label="Acc" 
                value={step.settings.accessory} 
                colorClass="bg-emerald-100 text-emerald-700"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const RecipeResult: React.FC<RecipeResultProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-fade-in-up">
      {/* Header Image Placeholder or Title Bg */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 font-display">{recipe.title}</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Clock size={16} className="text-emerald-400" />
              <span className="font-medium text-sm">{recipe.totalTime || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Users size={16} className="text-emerald-400" />
              <span className="font-medium text-sm">{recipe.servings} Personas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-0">
        {/* Ingredients Sidebar */}
        <div className="md:col-span-1 bg-slate-50 p-6 border-r border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Ingredientes
          </h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps Content */}
        <div className="md:col-span-2 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
               Preparación
            </h3>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{recipe.steps.length} Pasos</span>
          </div>
          
          <div className="space-y-2">
            {recipe.steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 italic">
              Receta adaptada automáticamente por IA para Monsieur Cuisine Connect. 
              Por favor revisa los pasos antes de cocinar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};