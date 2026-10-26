"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { CheckCircle } from "lucide-react";
import { useWindowSize } from "react-use";
import { Logo } from "@/components/icons/Logo";

interface CertificateViewerProps {
  courseId: string;
  onComplete: () => void;
  isCompleted: boolean;
}

export function CertificateViewer({ courseId, onComplete, isCompleted }: CertificateViewerProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isCompleted) {
      onComplete();
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // 5 seconds of confetti
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onComplete]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50/50 p-6 overflow-hidden">
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
      )}

      <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl p-8 text-center shadow-none relative z-10 animate-in zoom-in-95 duration-300">
        <div className="w-[52px] h-[52px] rounded-[14px] bg-white border border-gray-200 shadow-none flex items-center justify-center mx-auto mb-4">
          <Logo className="w-[26px] h-[26px] text-blue-500" />
        </div>

        <h1 className="text-[22px] font-bold text-gray-900 mb-2 tracking-tight">
          Congratulations!
        </h1>

        <p className="text-[14px] text-gray-500 mb-5 max-w-md mx-auto leading-relaxed">
          You have successfully completed this course. Your dedication and hard work have paid off!
        </p>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-[12px] font-medium rounded-full mb-4">
          <CheckCircle className="w-3.5 h-3.5" />
          Course Completed
        </div>

        <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-3.5 text-left">
          <h3 className="text-[12px] font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul className="space-y-1.5 text-gray-600 text-[12px]">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Your progress has been permanently saved to your profile.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>You can revisit this course at any time to review materials.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Explore additional courses to continue expanding your knowledge.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
