"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share2, Mail, Play } from 'lucide-react';
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

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `You have been invited to participate in an AI-powered interview for the position of ${formData.jobPosition}.\n\nInterview Link: ${interviewLink}\n\nDuration: ${formData.duration}\n\nPlease click the link to start your interview. Good luck!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const startInterview = () => {
    window.open(interviewLink, '_blank');
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

      <div className="space-y-3">
        <Button 
          onClick={startInterview} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Interview
        </Button>
        
        <div className="flex gap-3">
          <Button onClick={shareViaEmail} variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Share via Email
          </Button>
          <Button 
            onClick={shareViaWhatsApp} 
            variant="outline" 
            className="flex-1 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Share via WhatsApp
          </Button>
        </div>
        
        <Link href="/dashboard" className="block">
          <Button variant="outline" className="w-full">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
