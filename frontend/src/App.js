import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import BudgetTracker from './pages/BudgetTracker';
import MealPlanner from './pages/MealPlanner';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Router>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/meals" element={<MealPlanner />} />
          </Routes>
        </main>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;