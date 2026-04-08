"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface CelebrationModalProps {
  isOpen: boolean;
  percentage: number;
  onClose: () => void;
}

export function CelebrationModal({
  isOpen,
  percentage,
  onClose,
}: CelebrationModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const isPerfect = percentage === 100;
  const message = isPerfect
    ? "Perfect Day! 🎊"
    : "Great Job! Day Well Spent 🎉";
  const subtitle = isPerfect
    ? "You crushed every single task! You're unstoppable! 🔥"
    : "80%+ tasks done! You're amazing! ✨";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Celebration Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <div className="relative bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md sm:max-w-lg text-center overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Celebration Emoji/Icons */}
            <div className="text-6xl sm:text-7xl mb-4 animate-bounce flex justify-center gap-2">
              <span className="animate-bounce" style={{ animationDelay: "0s" }}>
                🎊
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                ✨
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                🎉
              </span>
            </div>

            {/* Main Message */}
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {message}
            </h2>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/90 mb-6 drop-shadow-md">
              {subtitle}
            </p>

            {/* Progress Display */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30">
              <p className="text-sm font-medium text-white/80 mb-2">
                Task Completion Rate
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-3xl font-bold text-white">
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Motivational Quote */}
            <p className="text-sm sm:text-base text-white/95 italic mb-6 drop-shadow-md">
              {isPerfect
                ? "Nothing is impossible to a determined heart."
                : "Every accomplishment brings you closer to greatness."}
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:shadow-lg active:scale-95"
            >
              Celebrate & Continue
              <X size={18} />
            </button>
          </div>

          {/* Star sparkles animation */}
          <div className="absolute top-4 right-4 text-2xl animate-spin">⭐</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-spin" style={{ animationDirection: "reverse" }}>
            ⭐
          </div>
        </div>
      </div>
    </>
  );
}
