import { Recipe, BusinessPlan } from './gemini';

const RECIPES_KEY = 'culinabiz_recipes';
const BUSINESS_PLANS_KEY = 'culinabiz_business_plans';

const isStorageAvailable = () => {
  try {
    return typeof localStorage !== 'undefined';
  } catch (e) {
    return false;
  }
};

export const saveRecipe = (recipe: Recipe) => {
  if (!isStorageAvailable()) return;
  try {
    const existing = getSavedRecipes();
    const updated = [recipe, ...existing];
    localStorage.setItem(RECIPES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Storage failed", e);
  }
};

export const getSavedRecipes = (): Recipe[] => {
  if (!isStorageAvailable()) return [];
  try {
    const data = localStorage.getItem(RECIPES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveBusinessPlan = (plan: BusinessPlan) => {
  if (!isStorageAvailable()) return;
  try {
    const existing = getSavedBusinessPlans();
    const updated = [plan, ...existing];
    localStorage.setItem(BUSINESS_PLANS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Storage failed", e);
  }
};

export const getSavedBusinessPlans = (): BusinessPlan[] => {
  if (!isStorageAvailable()) return [];
  try {
    const data = localStorage.getItem(BUSINESS_PLANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const clearAllData = () => {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(RECIPES_KEY);
  localStorage.removeItem(BUSINESS_PLANS_KEY);
};
