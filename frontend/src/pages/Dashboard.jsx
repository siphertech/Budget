import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ShoppingCart, ChefHat } from 'lucide-react';
import { budgetApi, mealsApi } from '../services/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [budgetData, setBudgetData] = useState({
    budget_summary: {
      total_income: 0,
      total_expenses: 0,
      balance: 0,
      budget_usage: 0,
      categories_summary: []
    },
    recent_transactions: [],
    top_categories: []
  });
  const [mealData, setMealData] = useState({
    weekly_plan: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch budget dashboard data
        const budgetResponse = await budgetApi.getDashboard();
        setBudgetData(budgetResponse.data);
        
        // Fetch meals dashboard data
        const mealsResponse = await mealsApi.getWeeklyPlan();
        setMealData({ weekly_plan: mealsResponse.data });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const { budget_summary, recent_transactions, top_categories } = budgetData;
  const { total_income, total_expenses, balance, budget_usage } = budget_summary;

  const upcomingMeals = mealData.weekly_plan
    .flatMap(day => day.meals)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Your Budget Planner
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Take control of your finances and meal planning with our comprehensive dashboard
        </p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${total_income.toLocaleString()}</div>
            <p className="text-xs text-green-600">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">${total_expenses.toLocaleString()}</div>
            <p className="text-xs text-red-600">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
              ${balance.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600">Available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Budget Usage</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{budget_usage.toFixed(1)}%</div>
            <Progress value={budget_usage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Spending Categories */}
        <Card className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-purple-600" />
              <span>Top Spending Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {top_categories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <span className="font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${category.spent.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}% of budget</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Meals */}
        <Card className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-purple-600" />
              <span>Upcoming Meals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeals.length > 0 ? (
              upcomingMeals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      meal.type === 'breakfast' ? 'bg-yellow-500' : 
                      meal.type === 'lunch' ? 'bg-orange-500' : 'bg-purple-500'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-700">{meal.recipe}</div>
                      <div className="text-sm text-gray-500 capitalize">{meal.type}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {meal.ingredients?.length || 0} ingredients
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChefHat className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No meals planned yet</p>
                <p className="text-sm">Start planning your meals!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800 mb-2">Add Transaction</h3>
            <p className="text-sm text-emerald-600">Record income or expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-blue-800 mb-2">Plan Weekly Meals</h3>
            <p className="text-sm text-blue-600">Create your meal schedule</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold text-purple-800 mb-2">Generate Shopping List</h3>
            <p className="text-sm text-purple-600">From your meal plan</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;