"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function InterviewLink({ interview_id, formData }) {
  const [copied, setCopied] = useState(false);
  const interviewLink = `${window.location.origin}/interview/${interview_id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Interview Invitation - ${formData.jobPosition}`);
    const body = encodeURIComponent(
      `You have been invited to participate in an AI-powered interview for the position of ${formData.jobPosition}.\n\nInterview Link: ${interviewLink}\n\nDuration: ${formData.duration}\n\nPlease click the link to start your interview. Good luck!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Interview Created Successfully!</h2>
        <p className="text-gray-600 dark:text-gray-400">Share this link with candidates to start the interview</p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Interview Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={interviewLink}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <Button onClick={copyToClipboard} variant="outline">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Job Position:</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{formData.jobPosition}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Duration:</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{formData.duration}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Interview ID:</span>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{interview_id}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={shareViaEmail} variant="outline" className="flex-1">
          <Mail className="w-4 h-4 mr-2" />
          Share via Email
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
