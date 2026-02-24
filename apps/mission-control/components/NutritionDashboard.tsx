'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, AlertCircle, Utensils } from 'lucide-react';
import MetricCard from './MetricCard';
import MacroRing from './MacroRing';

interface DayNutrition {
  day: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  meals: { name: string; calories: number; protein: number }[];
}

interface WeeklySummary {
  avgCalories: number;
  avgProtein: number;
  avgFats: number;
  avgCarbs: number;
  adherenceScore: number;
  daysTracked: number;
  highestProteinDay: string;
  mostFrequentMeal: string;
}

const TARGETS = {
  calories: 1550,
  protein: 120,
  fats: 45,
  carbs: 166,
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function NutritionDashboard() {
  const [weeklyData, setWeeklyData] = useState<DayNutrition[]>([]);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [harveyVariety, setHarveyVariety] = useState({ uniqueMeals: 0, foodGroups: {} as Record<string, number> });

  // Load data from localStorage
  useEffect(() => {
    loadNutritionData();
    loadHarveyData();
  }, []);

  const loadNutritionData = () => {
    // Get meal plan data from weekly storage
    const weekData = localStorage.getItem('weekly-meal-plans-v1');
    if (!weekData) return;

    const plans = JSON.parse(weekData);
    const currentWeek: any = plans.current ? Object.values(plans.current)[0] : null;
    
    if (!currentWeek?.jades?.meals) return;

    const dayNutrition: DayNutrition[] = DAYS.map(day => {
      const meals = currentWeek.jades.meals[day] || {};
      const dayMeals: { name: string; calories: number; protein: number }[] = [];
      let calories = 0;
      let protein = 0;
      let fats = 0;
      let carbs = 0;

      Object.entries(meals).forEach(([mealType, recipeName]) => {
        if (recipeName && typeof recipeName === 'string') {
          // Try to get recipe details from recipe database
          const recipeData = localStorage.getItem('jade-recipe-database-v1');
          if (recipeData) {
            const recipes = JSON.parse(recipeData);
            const recipe = Object.values(recipes).find((r: any) => r.name === recipeName) as any;
            if (recipe) {
              dayMeals.push({
                name: recipeName as string,
                calories: recipe.macros?.calories || 0,
                protein: recipe.macros?.protein || 0,
              });
              calories += recipe.macros?.calories || 0;
              protein += recipe.macros?.protein || 0;
              fats += recipe.macros?.fats || 0;
              carbs += recipe.macros?.carbs || 0;
            }
          }
        }
      });

      return {
        day,
        calories,
        protein,
        fats,
        carbs,
        meals: dayMeals,
      };
    });

    setWeeklyData(dayNutrition);

    // Calculate summary
    const daysWithData = dayNutrition.filter(d => d.calories > 0);
    if (daysWithData.length > 0) {
      const avgCalories = daysWithData.reduce((sum, d) => sum + d.calories, 0) / daysWithData.length;
      const avgProtein = daysWithData.reduce((sum, d) => sum + d.protein, 0) / daysWithData.length;
      const avgFats = daysWithData.reduce((sum, d) => sum + d.fats, 0) / daysWithData.length;
      const avgCarbs = daysWithData.reduce((sum, d) => sum + d.carbs, 0) / daysWithData.length;

      // Calculate adherence (within 10% of targets)
      const onTargetDays = daysWithData.filter(d => {
        const calDiff = Math.abs(d.calories - TARGETS.calories) / TARGETS.calories;
        return calDiff <= 0.1;
      }).length;

      // Find highest protein day
      const highestProteinDay = daysWithData.reduce((max, d) => 
        d.protein > max.protein ? d : max, daysWithData[0] || { day: '-', protein: 0 }
      );

      // Find most frequent meal
      const mealCounts: Record<string, number> = {};
      dayNutrition.forEach(d => {
        d.meals.forEach(m => {
          mealCounts[m.name] = (mealCounts[m.name] || 0) + 1;
        });
      });
      const mostFrequentMeal = Object.entries(mealCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      setSummary({
        avgCalories: Math.round(avgCalories),
        avgProtein: Math.round(avgProtein),
        avgFats: Math.round(avgFats),
        avgCarbs: Math.round(avgCarbs),
        adherenceScore: Math.round((onTargetDays / daysWithData.length) * 100),
        daysTracked: daysWithData.length,
        highestProteinDay: highestProteinDay.day,
        mostFrequentMeal,
      });
    }
  };

  const loadHarveyData = () => {
    // Get Harvey's meals from weekly storage
    const weekData = localStorage.getItem('weekly-meal-plans-v1');
    if (!weekData) return;

    const plans = JSON.parse(weekData);
    const currentWeek: any = plans.current ? Object.values(plans.current)[0] : null;
    
    if (!currentWeek?.harveys?.meals) return;

    const allMeals: string[] = [];
    const foodGroups: Record<string, number> = {};

    DAYS.forEach(day => {
      const dayMeals = currentWeek.harveys.meals[day] || {};
      ['breakfast', 'lunch', 'snack', 'dinner'].forEach(mealType => {
        const items = dayMeals[mealType] || [];
        items.forEach((item: string) => {
          allMeals.push(item);
          // Categorize by emoji prefix
          const group = item.match(/^([\u{1F300}-\u{1F9FF}])/u)?.[0] || 'Other';
          foodGroups[group] = (foodGroups[group] || 0) + 1;
        });
      });
    });

    const uniqueMeals = new Set(allMeals).size;
    setHarveyVariety({ uniqueMeals, foodGroups });
  };

  const getDayStatus = (day: DayNutrition) => {
    if (day.calories === 0) return 'empty';
    const diff = Math.abs(day.calories - TARGETS.calories) / TARGETS.calories;
    if (diff <= 0.05) return 'good';
    if (diff <= 0.15) return 'warning';
    return 'over';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-700 border-green-200';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'over': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#fbecdb] to-white border border-[#e5ccc6] rounded-xl p-4">
        <h2 className="text-xl font-bold text-[#563f57]">Nutrition Dashboard</h2>
        <p className="text-sm text-gray-600">Weekly nutrition overview and insights</p>
      </div>

      {/* Jade's Weekly Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Avg Calories"
            value={summary.avgCalories}
            target={TARGETS.calories}
            actual={summary.avgCalories}
            icon={TrendingUp}
            color={Math.abs(summary.avgCalories - TARGETS.calories) < 100 ? 'green' : 'orange'}
          />
          <MetricCard
            label="Avg Protein"
            value={`${summary.avgProtein}g`}
            target={TARGETS.protein}
            actual={summary.avgProtein}
            icon={Award}
            color={summary.avgProtein >= TARGETS.protein * 0.9 ? 'green' : 'orange'}
          />
          <MetricCard
            label="Adherence Score"
            value={`${summary.adherenceScore}%`}
            icon={Calendar}
            color={summary.adherenceScore >= 80 ? 'green' : 'orange'}
          />
          <MetricCard
            label="Most Eaten"
            value={summary.mostFrequentMeal.length > 15 
              ? summary.mostFrequentMeal.slice(0, 15) + '...' 
              : summary.mostFrequentMeal}
            icon={Utensils}
            color="plum"
          />
        </div>
      )}

      {/* Macro Rings */}
      {summary && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Weekly Macro Averages</h3>
          <div className="flex justify-around">
            <MacroRing
              value={summary.avgCalories}
              max={TARGETS.calories}
              label="Calories"
              color="purple"
              size="lg"
            />
            <MacroRing
              value={summary.avgProtein}
              max={TARGETS.protein}
              label="Protein"
              color="green"
              size="lg"
            />
            <MacroRing
              value={summary.avgFats}
              max={TARGETS.fats}
              label="Fats"
              color="amber"
              size="lg"
            />
            <MacroRing
              value={summary.avgCarbs}
              max={TARGETS.carbs}
              label="Carbs"
              color="blue"
              size="lg"
            />
          </div>
        </div>
      )}

      {/* Day-by-Day Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Day-by-Day Breakdown</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {weeklyData.map(day => {
            const status = getDayStatus(day);
            return (
              <div
                key={day.day}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900 w-24">{day.day}</span>
                    <div className="flex gap-4 text-sm">
                      <span className={day.calories > 0 ? 'text-gray-700' : 'text-gray-400'}>
                        {day.calories > 0 ? `${day.calories} cal` : '—'}
                      </span>
                      <span className={day.protein > 0 ? 'text-gray-700' : 'text-gray-400'}>
                        {day.protein > 0 ? `${day.protein}g protein` : '—'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                    {status === 'good' ? '✓ On target' : 
                     status === 'warning' ? '⚠ Close' : 
                     status === 'over' ? '✗ Over' : 'Empty'}
                  </span>
                </div>

                {/* Expanded Day Details */}
                {selectedDay === day.day && day.meals.length > 0 && (
                  <div className="mt-3 pl-28 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-600 mb-2">Meals:</p>
                    <div className="space-y-1">
                      {day.meals.map((meal, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{meal.name}</span>
                          <span className="text-gray-500">{meal.calories} cal · {meal.protein}g P</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Harvey's Nutrition Section */}
      <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-200 rounded-xl p-6">
        <h3 className="font-semibold text-pink-700 mb-4 flex items-center gap-2">
          <span>👶</span> Harvey's Weekly Variety
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">{harveyVariety.uniqueMeals}</p>
            <p className="text-sm text-gray-600">Unique meals this week</p>
            {harveyVariety.uniqueMeals < 10 && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Consider adding more variety
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Food Group Balance:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(harveyVariety.foodGroups).map(([group, count]) => (
                <span
                  key={group}
                  className="text-sm bg-white px-3 py-1 rounded-full border border-pink-200"
                >
                  {group} {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Insights</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Highest protein day: <strong>{summary.highestProteinDay}</strong></li>
            <li>• You've eaten <strong>{summary.mostFrequentMeal}</strong> the most this week</li>
            {summary.adherenceScore < 70 && (
              <li>• Try to get closer to your calorie target for better consistency</li>
            )}
            {summary.avgProtein < TARGETS.protein * 0.8 && (
              <li>• Consider adding more protein-rich meals</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
