import { useState, useEffect } from 'react';
import { mealsApi } from '../services/api';
import { toast } from 'sonner';

export const useMeals = () => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await mealsApi.getRecipes();
      setRecipes(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch meal plans
  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const response = await mealsApi.getMealPlans();
      setMealPlans(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch meal plans');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weekly plan
  const fetchWeeklyPlan = async () => {
    try {
      setLoading(true);
      const response = await mealsApi.getWeeklyPlan();
      setWeeklyPlan(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch weekly plan');
    } finally {
      setLoading(false);
    }
  };

  // Fetch shopping list
  const fetchShoppingList = async () => {
    try {
      setLoading(true);
      const response = await mealsApi.getShoppingList();
      setShoppingList(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch shopping list');
    } finally {
      setLoading(false);
    }
  };

  // Create recipe
  const createRecipe = async (recipeData) => {
    try {
      setLoading(true);
      const response = await mealsApi.createRecipe(recipeData);
      setRecipes([response.data, ...recipes]);
      toast.success('Recipe created successfully!');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update recipe
  const updateRecipe = async (id, recipeData) => {
    try {
      setLoading(true);
      const response = await mealsApi.updateRecipe(id, recipeData);
      setRecipes(recipes.map(r => r.id === id ? response.data : r));
      toast.success('Recipe updated successfully!');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete recipe
  const deleteRecipe = async (id) => {
    try {
      setLoading(true);
      await mealsApi.deleteRecipe(id);
      setRecipes(recipes.filter(r => r.id !== id));
      toast.success('Recipe deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete recipe');
    } finally {
      setLoading(false);
    }
  };

  // Create meal plan
  const createMealPlan = async (mealPlanData) => {
    try {
      setLoading(true);
      const response = await mealsApi.createMealPlan(mealPlanData);
      setMealPlans([...mealPlans.filter(mp => !(mp.day === mealPlanData.day && mp.meal_type === mealPlanData.meal_type)), response.data]);
      toast.success('Meal plan created successfully!');
      await fetchWeeklyPlan(); // Refresh weekly plan
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete meal plan
  const deleteMealPlan = async (id) => {
    try {
      setLoading(true);
      await mealsApi.deleteMealPlan(id);
      setMealPlans(mealPlans.filter(mp => mp.id !== id));
      toast.success('Meal plan deleted successfully!');
      await fetchWeeklyPlan(); // Refresh weekly plan
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete meal plan');
    } finally {
      setLoading(false);
    }
  };

  // Generate shopping list
  const generateShoppingList = async () => {
    try {
      setLoading(true);
      const response = await mealsApi.generateShoppingList();
      setShoppingList(response.data.items);
      toast.success('Shopping list generated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to generate shopping list');
    } finally {
      setLoading(false);
    }
  };

  // Clear shopping list
  const clearShoppingList = async () => {
    try {
      setLoading(true);
      await mealsApi.clearShoppingList();
      setShoppingList([]);
      toast.success('Shopping list cleared successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to clear shopping list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchMealPlans();
    fetchWeeklyPlan();
    fetchShoppingList();
  }, []);

  return {
    recipes,
    mealPlans,
    weeklyPlan,
    shoppingList,
    loading,
    error,
    fetchRecipes,
    fetchMealPlans,
    fetchWeeklyPlan,
    fetchShoppingList,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    createMealPlan,
    deleteMealPlan,
    generateShoppingList,
    clearShoppingList,
  };
};