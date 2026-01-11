import { User, Recipe, SavedRecipe } from "../types";

const USERS_KEY = 'mcc_users';
const RECIPES_KEY = 'mcc_saved_recipes';
const CURRENT_USER_KEY = 'mcc_current_user';

// --- Auth Simulation ---

export const registerUser = (email: string, password: string, name: string): User => {
  const usersStr = localStorage.getItem(USERS_KEY);
  const users: any[] = usersStr ? JSON.parse(usersStr) : [];

  if (users.find((u: any) => u.email === email)) {
    throw new Error("El usuario ya existe");
  }

  const newUser = { id: crypto.randomUUID(), email, password, name }; // In real app, hash password!
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  const publicUser = { id: newUser.id, email: newUser.email, name: newUser.name };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return publicUser;
};

export const loginUser = (email: string, password: string): User => {
  const usersStr = localStorage.getItem(USERS_KEY);
  const users: any[] = usersStr ? JSON.parse(usersStr) : [];

  const user = users.find((u: any) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const publicUser = { id: user.id, email: user.email, name: user.name };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return publicUser;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// --- Recipe Persistence ---

export const saveRecipe = (userId: string, recipe: Recipe): SavedRecipe => {
  const recipesStr = localStorage.getItem(RECIPES_KEY);
  const recipes: SavedRecipe[] = recipesStr ? JSON.parse(recipesStr) : [];

  const newSavedRecipe: SavedRecipe = {
    ...recipe,
    id: crypto.randomUUID(),
    savedAt: Date.now() // Store savedAt on the object itself, but we filter by userId later
  };

  // We need to associate it with the user.
  // For simplicity in this localStorage implementation, we'll store all recipes in one array
  // but add a `userId` property to the storage object (casting to any internally here).
  const storageItem = { ...newSavedRecipe, userId };
  
  recipes.push(storageItem);
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  return newSavedRecipe;
};

export const getSavedRecipes = (userId: string): SavedRecipe[] => {
  const recipesStr = localStorage.getItem(RECIPES_KEY);
  const recipes: any[] = recipesStr ? JSON.parse(recipesStr) : [];
  return recipes.filter(r => r.userId === userId).sort((a, b) => b.savedAt - a.savedAt);
};

export const deleteRecipe = (recipeId: string) => {
    const recipesStr = localStorage.getItem(RECIPES_KEY);
    if(!recipesStr) return;
    const recipes: any[] = JSON.parse(recipesStr);
    const newRecipes = recipes.filter(r => r.id !== recipeId);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(newRecipes));
}