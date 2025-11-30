"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';

function QuestionList({ formData, onCreateLink, loading }) {
  const { user } = useUser();
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/ai-interview-questions', {
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        duration: formData.duration,
        type: Array.isArray(formData.type) ? formData.type.join(', ') : formData.type,
      });

      const content = response.data.content;
      let parsedQuestions = [];

      // Try to extract JSON from markdown code blocks
      const match = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        const jsonContent = JSON.parse(match[1].trim());
        parsedQuestions = jsonContent.interviewQuestions || [];
      } else {
        // Try direct parse
        try {
          const jsonContent = JSON.parse(content);
          parsedQuestions = jsonContent.interviewQuestions || [];
        } catch {
          toast.error('Failed to parse questions');
        }
      }

      setQuestions(parsedQuestions);
      toast.success('Questions generated successfully!');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateInterview = async () => {
    const interview_id = uuidv4();
    
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
      
      if (!userEmail) {
        toast.error('User email not found. Please sign in again.');
        return;
      }

      await axios.post('/api/create-interview', {
        interview_id,
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        duration: formData.duration,
        type: formData.type,
        questionList: { interviewQuestions: questions },
        createdBy: userEmail,
      });

      toast.success('Interview created successfully!');
      onCreateLink(interview_id);
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error(error.response?.data?.error || 'Failed to create interview');
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Generating Interview Questions</h3>
        <p className="text-gray-600 dark:text-gray-400">Please wait while AI creates personalized questions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Generated Interview Questions</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">{questions.length} questions</span>
      </div>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {questions.map((q, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{q.question}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">{q.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={generateQuestions} 
          variant="outline"
          disabled={isGenerating}
        >
          Regenerate Questions
        </Button>
        <Button 
          onClick={handleCreateInterview}
          disabled={loading || questions.length === 0}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Interview & Get Link'
          )}
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
