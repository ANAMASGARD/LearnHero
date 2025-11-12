"use client";
import React from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function InterviewCompleted() {
  const { interview_id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Interview Completed!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for completing the interview. Your responses have been recorded and our AI is analyzing your performance.
        </p>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600 text-left">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Your interview has been saved and analyzed by our AI</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>The recruiter will review your performance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>You'll be contacted if you're selected for the next round</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Interview ID: {interview_id}
        </p>
      </div>
    </div>
  );
}

export default InterviewCompleted;
