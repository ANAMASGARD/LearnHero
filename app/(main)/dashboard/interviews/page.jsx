"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

// Force dynamic rendering to avoid Clerk build-time errors
export const dynamic = 'force-dynamic';
import { Calendar, TrendingUp, Users, Award, BarChart3, Clock, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

function InterviewsInsights() {
  const { user } = useUser();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // 'day', 'week', 'month', 'all'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      loadInterviewResults();
    }
  }, [user]);

  const loadInterviewResults = async () => {
    try {
      const response = await axios.get(`/api/interview-results?email=${user.primaryEmailAddress.emailAddress}`);
      setResults(response.data || []);
    } catch (error) {
      console.error('Error loading interview results:', error);
      toast.error('Failed to load interview results');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resultId) => {
    try {
      setDeletingId(resultId);
      await axios.delete(`/api/interview-results/${resultId}`);
      toast.success('Interview result deleted successfully');
      loadInterviewResults(); // Reload the list
    } catch (error) {
      console.error('Error deleting interview result:', error);
      toast.error('Failed to delete interview result');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter results based on time filter
  const getFilteredResults = () => {
    const now = new Date();
    let startDate;

    switch (timeFilter) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return results;
    }

    return results.filter(result => {
      const completedDate = new Date(result.completed_at);
      return completedDate >= startDate;
    });
  };

  const filteredResults = getFilteredResults();

  // Calculate statistics
  const stats = {
    total: filteredResults.length,
    averageRating: filteredResults.length > 0
      ? filteredResults.reduce((sum, r) => {
          const ratings = r.feedback?.feedback?.rating || {};
          const avg = Object.keys(ratings).length > 0
            ? Object.values(ratings).reduce((s, v) => s + (v || 0), 0) / Object.keys(ratings).length
            : 0;
          return sum + avg;
        }, 0) / filteredResults.length
      : 0,
    recommended: filteredResults.filter(r => 
      r.feedback?.feedback?.Recommendation?.toLowerCase().includes('yes') || 
      r.feedback?.feedback?.Recommendation?.toLowerCase().includes('hire')
    ).length,
  };

  // Generate GitHub-style contribution graph data
  const generateContributionData = () => {
    const days = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = results.filter(r => {
        const completedDate = new Date(r.completed_at);
        return completedDate.toISOString().split('T')[0] === dateStr;
      }).length;

      days.push({
        date: new Date(currentDate),
        count,
        level: count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const contributionData = generateContributionData();

  // Get week labels for contribution graph
  const getWeekLabels = () => {
    const labels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    return labels;
  };

  // Group days by weeks
  const groupByWeeks = () => {
    const weeks = [];
    let currentWeek = [];
    
    contributionData.forEach((day) => {
      if (day.date.getDay() === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = groupByWeeks();

  const getColorClass = (level) => {
    // Improved dark mode colors for better visibility
    const colors = [
      'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      'bg-green-200 dark:bg-green-900/50 border border-green-300 dark:border-green-800',
      'bg-green-400 dark:bg-green-700/70 border border-green-500 dark:border-green-600',
      'bg-green-600 dark:bg-green-600 border border-green-700 dark:border-green-500',
      'bg-green-800 dark:bg-green-500 border border-green-900 dark:border-green-400'
    ];
    return colors[level] || colors[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-secondary dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Interview Insights</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Track your interview performance and progress</p>
        </div>
        
        {/* Time Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['day', 'week', 'month', 'all'].map((filter) => (
            <Button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              className={timeFilter === filter ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md dark:shadow-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Interviews</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md dark:shadow-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.averageRating.toFixed(1)}/10
              </p>
            </div>
            <Award className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md dark:shadow-gray-900/50 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Recommended</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.recommended}/{stats.total}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* GitHub-style Contribution Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md dark:shadow-gray-900/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            Interview Activity - {selectedYear}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedYear(selectedYear - 1)}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedYear(selectedYear + 1)}
              disabled={selectedYear >= new Date().getFullYear()}
            >
              →
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-1 items-start min-w-max">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2 flex-shrink-0">
              {getWeekLabels().map((label, i) => (
                <div key={i} className="h-3 sm:h-3.5 text-xs text-gray-500 dark:text-gray-400 w-8 sm:w-10">
                  {label}
                </div>
              ))}
            </div>
            
            {/* Contribution grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded ${getColorClass(day.level)} hover:ring-2 hover:ring-primary dark:hover:ring-primary/50 cursor-pointer transition-all`}
                      title={`${day.date.toLocaleDateString()}: ${day.count} interview${day.count !== 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded ${getColorClass(level)}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Interview List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md dark:shadow-gray-900/50">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Interviews</h2>
        
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No interviews found for the selected period</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => {
              const ratings = result.feedback?.feedback?.rating || {};
              const avgRating = Object.keys(ratings).length > 0
                ? Object.values(ratings).reduce((s, v) => s + (v || 0), 0) / Object.keys(ratings).length
                : 0;
              const isRecommended = result.feedback?.feedback?.Recommendation?.toLowerCase().includes('yes') || 
                                   result.feedback?.feedback?.Recommendation?.toLowerCase().includes('hire');
              
              return (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {result.interview?.jobPosition || 'Interview'}
                        </h3>
                        {isRecommended && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded flex-shrink-0">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Candidate: {result.fullname}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(result.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                      <div className="text-center sm:text-left">
                        <p className="text-xl sm:text-2xl font-bold text-primary">{avgRating.toFixed(1)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                      </div>
                      
                      <div className="flex flex-col gap-1 flex-1 sm:flex-initial min-w-0">
                        {Object.entries(ratings).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 w-20 sm:w-24 truncate">
                              {key}:
                            </span>
                            <div className="flex-1 sm:flex-initial w-16 sm:w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${(value / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-right">
                              {value}/10
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                          >
                            {deletingId === result.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Interview Result</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this interview result? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(result.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  {result.feedback?.feedback?.summary && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {result.feedback.feedback.summary}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewsInsights;
