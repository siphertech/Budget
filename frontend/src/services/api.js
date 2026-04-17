import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Budget API
export const budgetApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/budget/dashboard'),
  
  // Transactions
  getTransactions: () => apiClient.get('/budget/transactions'),
  createTransaction: (transaction) => apiClient.post('/budget/transactions', transaction),
  getTransaction: (id) => apiClient.get(`/budget/transactions/${id}`),
  updateTransaction: (id, transaction) => apiClient.put(`/budget/transactions/${id}`, transaction),
  deleteTransaction: (id) => apiClient.delete(`/budget/transactions/${id}`),
  
  // Categories
  getCategories: () => apiClient.get('/budget/categories'),
  createCategory: (category) => apiClient.post('/budget/categories', category),
  updateCategory: (id, category) => apiClient.put(`/budget/categories/${id}`, category),
  deleteCategory: (id) => apiClient.delete(`/budget/categories/${id}`),
};

// Meals API
export const mealsApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/meals/dashboard'),
  
  // Recipes
  getRecipes: () => apiClient.get('/meals/recipes'),
  createRecipe: (recipe) => apiClient.post('/meals/recipes', recipe),
  getRecipe: (id) => apiClient.get(`/meals/recipes/${id}`),
  updateRecipe: (id, recipe) => apiClient.put(`/meals/recipes/${id}`, recipe),
  deleteRecipe: (id) => apiClient.delete(`/meals/recipes/${id}`),
  
  // Meal Plans
  getMealPlans: () => apiClient.get('/meals/meal-plans'),
  createMealPlan: (mealPlan) => apiClient.post('/meals/meal-plans', mealPlan),
  getMealPlan: (id) => apiClient.get(`/meals/meal-plans/${id}`),
  updateMealPlan: (id, mealPlan) => apiClient.put(`/meals/meal-plans/${id}`, mealPlan),
  deleteMealPlan: (id) => apiClient.delete(`/meals/meal-plans/${id}`),
  
  // Weekly Plan
  getWeeklyPlan: () => apiClient.get('/meals/weekly-plan'),
  
  // Shopping List
  getShoppingList: () => apiClient.get('/meals/shopping-list'),
  createShoppingListItem: (item) => apiClient.post('/meals/shopping-list', item),
  deleteShoppingListItem: (id) => apiClient.delete(`/meals/shopping-list/${id}`),
  generateShoppingList: () => apiClient.post('/meals/shopping-list/generate'),
  clearShoppingList: () => apiClient.delete('/meals/shopping-list'),
};

// General API
export const generalApi = {
  healthCheck: () => apiClient.get('/health'),
  root: () => apiClient.get('/'),
};

export default apiClient;