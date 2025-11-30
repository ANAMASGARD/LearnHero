"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Video, Clock, Briefcase } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

function InterviewJoinPage() {
  const { interview_id } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [interviewInfo, setInterviewInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      setCandidateName(user.fullName || user.firstName || '');
    }
  }, [isLoaded, user]);

  useEffect(() => {
    loadInterviewInfo();
  }, [interview_id]);

  const loadInterviewInfo = async () => {
    try {
      const response = await axios.get(`/api/interview/${interview_id}`);
      setInterviewInfo(response.data);
    } catch (error) {
      console.error('Error loading interview:', error);
      toast.error('Interview not found');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = () => {
    if (!candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    // Store candidate name in localStorage for the interview
    localStorage.setItem(`candidate_${interview_id}`, candidateName);
    router.push(`/interview/${interview_id}/start`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (!interviewInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Interview Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The interview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to Your AI Interview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get ready for an interactive interview experience
          </p>
        </div>

        {/* Interview Details */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{interviewInfo.jobPosition}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{interviewInfo.duration}</p>
            </div>
          </div>
        </div>

        {/* Candidate Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Full Name
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Before you start:</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Ensure you're in a quiet environment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Allow microphone access when prompted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Speak clearly and naturally</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>The AI will ask questions one at a time</span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <Button 
          onClick={handleStartInterview}
          className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Start Interview
        </Button>
      </div>
    </div>
  );
}

export default InterviewJoinPage;
