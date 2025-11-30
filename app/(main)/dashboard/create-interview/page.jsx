"use client"
import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import WelcomeContainer from '../_components/WelcomeContainer'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import InterviewLink from './_components/InterviewLink'
import axios from 'axios'

// Force dynamic rendering to avoid Clerk build-time errors
export const dynamic = 'force-dynamic'

function CreateInterview() {
  const router = useRouter();  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    duration: '',
    type: []
  });

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const [interviewId, setInterviewId] = useState(null);

  const goToNext = () => {
    // Validate form data
    if (!formData.jobPosition || !formData.jobDescription || !formData.duration || formData.type.length === 0) {
      alert('Please fill all fields');
      return;
    }
    
    setStep(2);
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(3);
  };

  return (
    <div>
      <WelcomeContainer />
      <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
        <div className='flex gap-5 items-center'>
          <ArrowLeft onClick={() => router.back()} className='cursor-pointer text-gray-900 dark:text-gray-100'/> 
          <h2 className='font-bold text-2xl text-gray-900 dark:text-gray-100'>Create New Interview</h2>
        </div>
        <Progress value={step * 33.33} className='my-5' />
        
        {step === 1 && (
          <FormContainer 
            onHandleInputChange={handleInputChange}
            GoToNext={goToNext}
          />
        )}
        
        {step === 2 && (
          <QuestionList 
            formData={formData}
            onCreateLink={onCreateLink}
            loading={false}
          />
        )}
        
        {step === 3 && interviewId && (
          <InterviewLink 
            interview_id={interviewId}
            formData={formData}
          />
        )} 
      </div>
    </div>
  )
}

export default CreateInterview