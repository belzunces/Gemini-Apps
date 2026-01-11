import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { RecipeResult } from './components/RecipeResult';
import { AuthModal } from './components/AuthModal';
import { SavedRecipes } from './components/SavedRecipes';
import { convertRecipeWithGemini } from './services/gemini';
import { getCurrentUser, logoutUser, saveRecipe, getSavedRecipes, deleteRecipe } from './services/storage';
import { Recipe, ConversionState, User, SavedRecipe } from './types';
import { AlertCircle, ChefHat } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'converter' | 'saved'>('converter');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  
  // Recipe Data State
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
  });
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [viewingSavedRecipe, setViewingSavedRecipe] = useState<SavedRecipe | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      refreshSavedRecipes(currentUser.id);
    }
  }, []);

  const refreshSavedRecipes = (userId: string) => {
    setSavedRecipes(getSavedRecipes(userId));
  };

  const handleConvert = async (text: string, imageBase64?: string) => {
    setConversionState({ status: 'loading' });
    setJustSaved(false);
    try {
      const recipe = await convertRecipeWithGemini(text, imageBase64);
      setConversionState({ status: 'success', recipe });
    } catch (error) {
      setConversionState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Ocurrió un error desconocido' 
      });
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    refreshSavedRecipes(loggedInUser.id);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setView('converter');
    setSavedRecipes([]);
  };

  const handleSaveRecipe = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    if (conversionState.recipe && !justSaved) {
      saveRecipe(user.id, conversionState.recipe);
      refreshSavedRecipes(user.id);
      setJustSaved(true);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    if(!user) return;
    deleteRecipe(id);
    refreshSavedRecipes(user.id);
    if (viewingSavedRecipe?.id === id) {
        setViewingSavedRecipe(null);
    }
  };

  // Render logic helpers
  const showConverter = view === 'converter';
  const showSavedList = view === 'saved' && !viewingSavedRecipe;
  const showSavedDetail = view === 'saved' && viewingSavedRecipe;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header 
        user={user} 
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onMyRecipesClick={() => { setView('saved'); setViewingSavedRecipe(null); }}
        onLogoClick={() => { setView('converter'); }}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
      
      <main className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* Saved Recipes View */}
        {showSavedList && user && (
           <SavedRecipes 
             recipes={savedRecipes} 
             onSelect={setViewingSavedRecipe}
             onDelete={handleDeleteRecipe}
             onBack={() => setView('converter')}
           />
        )}

        {/* Saved Recipe Detail View */}
        {showSavedDetail && viewingSavedRecipe && (
           <RecipeResult 
             recipe={viewingSavedRecipe} 
             onBack={() => setViewingSavedRecipe(null)}
             // No save button here as it is already saved
           />
        )}

        {/* Main Converter View */}
        {showConverter && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Input */}
            <div className="lg:col-span-5 space-y-6">
              <div className="prose prose-slate sm:prose-sm">
                <h2 className="text-2xl font-bold text-slate-800">Transforma tus recetas</h2>
                <p className="text-slate-600">
                  Pega cualquier receta o sube una foto de tu libro de cocina. 
                  Nuestra IA la adaptará con los tiempos, temperaturas y velocidades exactas para tu Monsieur Cuisine.
                </p>
              </div>
              
              <InputForm 
                onConvert={handleConvert} 
                isLoading={conversionState.status === 'loading'} 
              />

              {/* Error Message */}
              {conversionState.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-pulse">
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-medium">{conversionState.error}</p>
                </div>
              )}
              
              <div className="hidden lg:block bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <h4 className="font-semibold text-emerald-800 mb-2 text-sm">Consejo Pro</h4>
                <p className="text-emerald-700/80 text-sm">
                  Crea una cuenta para guardar tus recetas favoritas y acceder a ellas desde cualquier dispositivo (en este navegador).
                </p>
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-7">
              {conversionState.status === 'success' && conversionState.recipe ? (
                <RecipeResult 
                  recipe={conversionState.recipe} 
                  onSave={handleSaveRecipe}
                  isSaved={justSaved}
                />
              ) : (
                // Empty State
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                   {conversionState.status === 'loading' ? (
                     <div className="space-y-4 max-w-sm">
                        <div className="mx-auto w-16 h-16 relative">
                          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">Analizando receta...</h3>
                        <p className="text-slate-500 text-sm">Estamos calculando los tiempos de cocción y velocidades óptimas para tu máquina.</p>
                     </div>
                   ) : (
                     <div className="space-y-3 max-w-sm opacity-60">
                       <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto flex items-center justify-center">
                         <ChefHat size={32} className="text-slate-400" />
                       </div>
                       <h3 className="text-lg font-semibold text-slate-700">Esperando tu receta</h3>
                       <p className="text-sm text-slate-500">
                         El resultado aparecerá aquí formateado específicamente para tu Monsieur Cuisine Connect.
                       </p>
                     </div>
                   )}
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;