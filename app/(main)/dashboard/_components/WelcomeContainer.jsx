"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

function WelcomeContainer() {
    const { user } = useUser();

    return (
        <header className="flex items-center justify-between p-4 md:p-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-gray-900/50 hover:shadow-md transition-shadow duration-200 sticky top-4 z-50 mx-4 mb-4">
            {/* Left side - Welcome text */}
            <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                    Welcome back, {user?.firstName || 'User'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    Ready to continue your learning journey?
                </p>
            </div>

            {/* Right side - User button */}
            <div className="flex-shrink-0 ml-4">
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-6 md:w-10 md:h-10"
                        }
                    }}
                />
            </div>
        </header>
    )
}

export default WelcomeContainer