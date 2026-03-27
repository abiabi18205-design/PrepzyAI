// app/(dashboard)/dashboard/practice/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import { 
  MicrophoneIcon, 
  StopIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

interface Question {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
}

interface SessionData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  currentQuestionIndex: number;
}

export default function PracticeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practice/session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setSession(data.data);
          setTimeRemaining(data.data.questions[0]?.timeLimit || 120);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Timer logic
  useEffect(() => {
    if (timeRemaining > 0 && !showFeedback && !isRecording) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining, showFeedback, isRecording]);

  const handleTimeout = () => {
    alert("Time's up! Moving to next question.");
    nextQuestion();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Stop recording after 2 minutes or when user stops
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 120000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record your answers.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('questionId', session!.questions[currentIndex].id);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practice/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setFeedback(data.data);
        setShowFeedback(true);
        
        // Save answer
        setAnswers(prev => ({
          ...prev,
          [session!.questions[currentIndex].id]: data.data.transcript || "Audio recorded"
        }));
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to process your answer. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < (session?.questions.length || 0)) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
      setFeedback(null);
      setTimeRemaining(session!.questions[currentIndex + 1].timeLimit);
    } else {
      // Session complete
      completeSession();
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowFeedback(false);
      setFeedback(null);
      setTimeRemaining(session!.questions[currentIndex - 1].timeLimit);
    }
  };

  const completeSession = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practice/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          answers,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/dashboard/results/${data.data.resultId}`);
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-[#9aabb8] mb-4">Session not found</p>
          <button
            onClick={() => router.push('/dashboard/practice')}
            className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A]"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard/practice')}
          className="flex items-center gap-2 text-[#9aabb8] hover:text-[#FF6B6B] transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="text-sm">Back to Sessions</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#9aabb8] text-sm">
            <ClockIcon className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <div className="text-[#9aabb8] text-sm">
            Question {currentIndex + 1} of {session.questions.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Question Card */}
        <div className="mb-6 p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block px-2 py-1 rounded-lg text-xs font-mono bg-[#FF6B6B]/10 text-[#FF6B6B] mb-2">
                {currentQuestion.category}
              </span>
              <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">
                {currentQuestion.title}
              </h2>
            </div>
            <span className={`px-2 py-1 rounded-lg text-xs font-mono ${
              currentQuestion.difficulty === 'Easy' ? 'bg-green-400/10 text-green-400' :
              currentQuestion.difficulty === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' :
              'bg-red-400/10 text-red-400'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <p className="text-[#9aabb8] font-body leading-relaxed">
            {currentQuestion.description}
          </p>
        </div>

        {/* Recording Section */}
        {!showFeedback ? (
          <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838] text-center">
            {!isRecording && !isProcessing ? (
              <div>
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center mb-4">
                    <MicrophoneIcon className="h-10 w-10 text-[#FF6B6B]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#FFF5F2] mb-2">
                    Ready to Answer?
                  </h3>
                  <p className="text-[#9aabb8] text-sm mb-4">
                    Click the button below and start speaking. You have {formatTime(timeRemaining)} to answer.
                  </p>
                </div>
                <button
                  onClick={startRecording}
                  className="px-6 py-3 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold hover:bg-[#FFA07A] transition-all flex items-center gap-2 mx-auto"
                >
                  <MicrophoneIcon className="h-5 w-5" />
                  Start Recording
                </button>
              </div>
            ) : isRecording ? (
              <div>
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4 animate-pulse">
                    <MicrophoneIcon className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#FFF5F2] mb-2">
                    Recording in Progress...
                  </h3>
                  <p className="text-[#9aabb8] text-sm mb-4">
                    Speak clearly and concisely. Click stop when you're done.
                  </p>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-heading font-bold hover:bg-red-500/30 transition-all flex items-center gap-2 mx-auto"
                >
                  <StopIcon className="h-5 w-5" />
                  Stop Recording
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center mb-4">
                    <ArrowPathIcon className="h-10 w-10 text-[#FF6B6B] animate-spin" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#FFF5F2] mb-2">
                    Processing Your Answer...
                  </h3>
                  <p className="text-[#9aabb8] text-sm">
                    Our AI is analyzing your response. This will take a moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Feedback Section */
          <div className="p-6 rounded-2xl border border-[#FF6B6B]/20 bg-gradient-to-br from-[#FF6B6B]/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
              <h3 className="font-heading text-lg font-bold text-[#FFF5F2]">Feedback & Analysis</h3>
            </div>

            {feedback && (
              <div className="space-y-4">
                {/* Score */}
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#9aabb8] text-sm">Overall Score</span>
                    <span className="text-[#FF6B6B] font-heading text-2xl font-bold">{feedback.score}%</span>
                  </div>
                  <div className="h-2 bg-[#2a3a4a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF6B6B] rounded-full transition-all"
                      style={{ width: `${feedback.score}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <ChartBarIcon className="h-4 w-4 text-[#FF6B6B]" />
                      <span className="text-[#9aabb8] text-xs">Clarity</span>
                    </div>
                    <div className="text-[#FFF5F2] font-bold">{feedback.clarity}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <ChartBarIcon className="h-4 w-4 text-[#FF6B6B]" />
                      <span className="text-[#9aabb8] text-xs">Confidence</span>
                    </div>
                    <div className="text-[#FFF5F2] font-bold">{feedback.confidence}%</div>
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <p className="text-[#9aabb8] text-sm mb-2">AI Suggestions:</p>
                  <p className="text-[#FFF5F2] text-sm leading-relaxed">{feedback.feedback}</p>
                </div>

                {/* Improved Answer */}
                {feedback.improvedAnswer && (
                  <div className="p-3 rounded-xl bg-[#FF6B6B]/5 border border-[#FF6B6B]/10">
                    <p className="text-[#FF6B6B] text-xs font-mono mb-1">💡 Improved Answer Example:</p>
                    <p className="text-[#9aabb8] text-sm">{feedback.improvedAnswer}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={previousQuestion}
                disabled={currentIndex === 0}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                  currentIndex === 0
                    ? 'border-[#2a3a4a] text-[#4a5a6a] cursor-not-allowed'
                    : 'border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4 inline mr-1" />
                Previous
              </button>
              <button
                onClick={nextQuestion}
                className="flex-1 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] text-sm font-heading font-bold hover:bg-[#FFA07A] transition-all"
              >
                Next Question
                <ChevronRightIcon className="h-4 w-4 inline ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}