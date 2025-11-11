"use client"
import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import WelcomeContainer from '../_components/WelcomeContainer'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import FormContainer from './_components/FormContainer'

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

  const goToNext = () => {
    // Validate form data
    if (!formData.jobPosition || !formData.jobDescription || !formData.duration || formData.type.length === 0) {
      alert('Please fill all fields');
      return;
    }
    
    setStep(2);
    console.log('Form Data:', formData);
    // Add your next step logic here
  };

  return (
    <div>
      <WelcomeContainer />
      <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
        <div className='flex gap-5 items-center'>
          <ArrowLeft onClick={() => router.back()} className='cursor-pointer'/> 
          <h2 className='font-bold text-2xl'>Create New Interview</h2>
        </div>
        <Progress value={step * 33.33} className='my-5' />
        <FormContainer 
          onHandleInputChange={handleInputChange}
          GoToNext={goToNext}
        /> 
      </div>
    </div>
  )
}

export default CreateInterview