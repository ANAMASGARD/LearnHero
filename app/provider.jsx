"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { UserDetailContext } from '@/context/UserDetailContext'
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext'

function Provider({ children }) {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState({});
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    try {
      // Only call API if user data is available
      if (!user?.fullName || !user?.primaryEmailAddress?.emailAddress) {
        console.log('User data not ready yet');
        return;
      }

      const result = await axios.post('/api/user', {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress
      });
      console.log('User created/fetched:', result.data);
      setUserDetails(result.data);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
      } else {
        // Something else happened
        console.error('Error:', error.message);
      }
    }
  }

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <SelectedChapterIndexContext.Provider value={{ selectedChapterIndex, setSelectedChapterIndex }}>
        <div>{children}</div>
      </SelectedChapterIndexContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider
