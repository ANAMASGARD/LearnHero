"use client";

import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getVapiClient } from "@/lib/vapiconfig";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function StartInterview() {
  const { user } = useUser();
  const vapi = getVapiClient();
  const [activeUser, setActiveUser] = useState(false);
  const [start, setStart] = useState(false);
  const [subtitles, setSubtitles] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timer, setTimer] = useState(0);
  const conversation = useRef(null);
  const { interview_id } = useParams();
  const router = useRouter();
  
  const [interviewInfo, setInterviewInfo] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Load interview info
  useEffect(() => {
    const loadInterviewInfo = async () => {
      try {
        const response = await axios.get(`/api/interview/${interview_id}`);
        setInterviewInfo(response.data);
      } catch (error) {
        console.error("Failed to load interview:", error);
        toast.error("Failed to load interview");
        router.push('/dashboard');
      }
    };
    
    if (interview_id) {
      loadInterviewInfo();
    }
  }, [interview_id, router]);

  // Timer
  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [start]);

  // Start call when interview info is loaded
  useEffect(() => {
    if (interviewInfo && vapi && !start) {
      setStart(true);
      startCall();
    }
  }, [interviewInfo, vapi]);

  const startCall = async () => {
    const jobPosition = interviewInfo?.jobPosition || "Unknown Position";
    const questionList = interviewInfo?.questionList?.interviewQuestions?.map((q) => q?.question) || [];

    const assistantOptions = {
      name: "AI Interviewer",
      firstMessage: `Hi ${user?.firstName || 'there'}, how are you? Ready for your interview for ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-3",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
Ask one question at a time and wait for the candidate's response before proceeding.
Questions: ${questionList.join(', ')}
If the candidate struggles, offer hints or rephrase the question without giving away the answer.
Provide brief, encouraging feedback after each answer.
Keep the conversation natural and engaging.
After all questions, wrap up the interview smoothly by summarizing their performance.
End on a positive note.
`.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  useEffect(() => {
    if (!vapi) return;

    const handleMessage = (message) => {
      if (message?.role === "assistant" && message?.content) {
        setSubtitles(message.content);
      }
      
      if (message && message?.conversation) {
        const filteredConversation = message.conversation.filter((msg) => msg.role !== "system") || "";
        conversation.current = JSON.stringify(filteredConversation, null, 2);
      }
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setActiveUser(true);
    };

    vapi.on("message", handleMessage);
    vapi.on("call-start", () => {
      toast.success('Interview started!');
      setStart(true);
    });
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", () => {
      toast.info('Generating feedback...');
      setIsGeneratingFeedback(true);
      GenerateFeedback();
    });

    return () => {
      vapi.off("message", handleMessage);
      vapi.off("call-start", () => {});
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", () => {});
    };
  }, [vapi]);

  const GenerateFeedback = async () => {
    if (!interviewInfo || !conversation.current) {
      toast.error("Interview data missing");
      router.push('/dashboard');
      return;
    }
    
    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: conversation.current,
      });
  
      const Content = result?.data?.content
        ?.replace("```json", "")
        ?.replace("```", "")
        ?.trim();
  
      if (!Content) throw new Error("Feedback content is empty");
  
      let parsedFeedback;
      try {
        parsedFeedback = JSON.parse(Content);
      } catch (e) {
        console.error("Invalid JSON:", Content);
        throw new Error("Could not parse AI feedback JSON");
      }
  
      // Save to database
      await axios.post("/api/interview-result", {
        interview_id: interview_id,
        fullname: user?.fullName || user?.firstName || "Candidate",
        email: user?.primaryEmailAddress?.emailAddress,
        conversation_transcript: JSON.parse(conversation.current),
        feedback: parsedFeedback,
      });
  
      toast.success("Feedback generated successfully!");
      router.push(`/dashboard/interview/${interview_id}/completed`);
    } catch (error) {
      console.error("Feedback generation failed:", error);
      toast.error("Failed to generate feedback");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };
  
  const stopInterview = () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      vapi.stop();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!interviewInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {interviewInfo?.jobPosition} Interview
            </h1>
            <p className="text-gray-600">AI-Powered Interview Assistant</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <Timer className="text-blue-600" />
            <span className="font-mono text-lg font-semibold text-gray-700">
              {formatTime(timer)}
            </span>
          </div>
        </header>

        {/* Interview Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI Interviewer */}
          <div className={`bg-white rounded-xl p-6 shadow-md border transition-all duration-300 ${isSpeaking ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"}`}>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>
                )}
                <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100 flex items-center justify-center">
                  <span className="text-4xl">🤖</span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">AI Interviewer</h2>
                <p className="text-sm text-gray-500">LearnHero AI</p>
              </div>
            </div>
          </div>

          {/* Candidate */}
          <div className={`bg-white rounded-xl p-6 shadow-md border transition-all duration-300 ${activeUser ? "border-purple-300 ring-2 ring-purple-100" : "border-gray-200"}`}>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                {activeUser && (
                  <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping opacity-75"></div>
                )}
                <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {user?.firstName || 'Candidate'}
                </h2>
                <p className="text-sm text-gray-500">Interviewee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitles */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="min-h-16 flex items-center justify-center">
            {subtitles ? (
              <p className="text-center text-gray-700">"{subtitles}"</p>
            ) : (
              <p className="text-center text-gray-400">
                {isSpeaking ? "AI is speaking..." : "Waiting for response..."}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="flex flex-col items-center">
            <button 
              onClick={stopInterview}
              className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-all flex items-center gap-2"
            >
              <Phone size={20} />
              <span>End Interview</span>
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {activeUser ? "Please respond..." : "AI is speaking..."}
            </p>
          </div>
        </div>
      </div>
      
      {isGeneratingFeedback && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Generating Feedback</h2>
            <p className="text-gray-600">Please wait while we analyze your interview...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartInterview;
