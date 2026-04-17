import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Plus, ChefHat, Clock, Users, ShoppingCart, Calendar, Trash2, Edit } from 'lucide-react';
import { useMeals } from '../hooks/useMeals';

const MealPlanner = () => {
  const {
    recipes,
    weeklyPlan,
    shoppingList,
    loading,
    createRecipe,
    deleteRecipe,
    createMealPlan,
    generateShoppingList,
    fetchWeeklyPlan
  } = useMeals();

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    type: 'breakfast',
    instructions: '',
    ingredients: '',
    servings: 1,
    prep_time: '',
  });
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState({ day: '', meal_type: '', recipe_id: '' });
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  const handleAddRecipe = async () => {
    if (!newRecipe.name || !newRecipe.instructions || !newRecipe.ingredients) {
      return;
    }

    try {
      await createRecipe({
        ...newRecipe,
        ingredients: newRecipe.ingredients.split(',').map(ing => ing.trim()),
      });
      
      setNewRecipe({
        name: '',
        type: 'breakfast',
        instructions: '',
        ingredients: '',
        servings: 1,
        prep_time: '',
      });
      setIsRecipeDialogOpen(false);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await deleteRecipe(id);
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleAddToWeeklyPlan = async () => {
    if (!selectedMealPlan.day || !selectedMealPlan.meal_type || !selectedMealPlan.recipe_id) {
      return;
    }

    const recipe = recipes.find(r => r.id === selectedMealPlan.recipe_id);
    if (!recipe) return;

    try {
      await createMealPlan({
        day: selectedMealPlan.day,
        meal_type: selectedMealPlan.meal_type,
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        ingredients: recipe.ingredients,
      });
      
      setSelectedMealPlan({ day: '', meal_type: '', recipe_id: '' });
      setIsPlanDialogOpen(false);
    } catch (error) {
      console.error('Error adding to meal plan:', error);
    }
  };

  const handleGenerateShoppingList = async () => {
    try {
      await generateShoppingList();
    } catch (error) {
      console.error('Error generating shopping list:', error);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meal planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meal Planner
          </h1>
          <p className="text-gray-600 mt-2">Plan your meals and generate shopping lists</p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Recipe Name</Label>
                  <Input
                    id="name"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                    placeholder="Enter recipe name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Meal Type</Label>
                  <Select value={newRecipe.type} onValueChange={(value) => setNewRecipe({...newRecipe, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={newRecipe.servings}
                      onChange={(e) => setNewRecipe({...newRecipe, servings: parseInt(e.target.value)})}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prep_time">Prep Time</Label>
                    <Input
                      id="prep_time"
                      value={newRecipe.prep_time}
                      onChange={(e) => setNewRecipe({...newRecipe, prep_time: e.target.value})}
                      placeholder="15 min"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                  <Textarea
                    id="ingredients"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
                    placeholder="Bread, Avocado, Lemon, Salt, Pepper"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
                    placeholder="Enter cooking instructions"
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleAddRecipe} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Add Recipe
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleGenerateShoppingList} variant="outline" className="border-purple-200 hover:bg-purple-50">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Generate Shopping List
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="weekly-plan">Weekly Plan</TabsTrigger>
          <TabsTrigger value="shopping-list">Shopping List</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Card key={recipe.id} className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Badge variant="outline" className={`${
                        recipe.type === 'breakfast' ? 'bg-yellow-50 border-yellow-200' :
                        recipe.type === 'lunch' ? 'bg-orange-50 border-orange-200' :
                        'bg-purple-50 border-purple-200'
                      }`}>
                        {recipe.type}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.prep_time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                        <div className="flex flex-wrap gap-1">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{recipe.instructions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No recipes yet</p>
                <p className="text-sm">Add your first recipe to get started!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly-plan" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Weekly Meal Plan</h2>
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Meal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Add Meal to Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="day">Day</Label>
                    <Select value={selectedMealPlan.day} onValueChange={(value) => setSelectedMealPlan({...selectedMealPlan, day: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="meal_type">Meal Type</Label>
                    <Select value={selectedMealPlan.meal_type} onValueChange={(value) => setSelectedMealPlan({...selectedMealPlan, meal_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypes.map(type => (
                          <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="recipe">Recipe</Label>
                    <Select value={selectedMealPlan.recipe_id} onValueChange={(value) => setSelectedMealPlan({...selectedMealPlan, recipe_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipes.map(recipe => (
                          <SelectItem key={recipe.id} value={recipe.id}>{recipe.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleAddToWeeklyPlan} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Add to Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyPlan.map((day) => (
              <Card key={day.day} className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span>{day.day}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mealTypes.map(type => {
                      const meal = day.meals.find(m => m.type === type);
                      return (
                        <div key={type} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              type === 'breakfast' ? 'bg-yellow-500' :
                              type === 'lunch' ? 'bg-orange-500' :
                              'bg-purple-500'
                            }`} />
                            <div>
                              <div className="font-medium text-gray-900 capitalize">{type}</div>
                              <div className="text-sm text-gray-500">{meal?.recipe || 'Not planned'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shopping-list" className="space-y-4">
          <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
                <span>Shopping List</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shoppingList.length > 0 ? (
                  shoppingList.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <div>
                          <div className="font-medium text-gray-900">{item.item}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{item.quantity} {item.unit}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">No shopping list yet</p>
                    <p className="text-sm">Generate a shopping list from your meal plan!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MealPlanner;