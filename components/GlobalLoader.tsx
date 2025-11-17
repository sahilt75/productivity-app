"use client";

import { useEffect, useState } from "react";

interface GlobalLoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export let globalLoader: GlobalLoaderContextType = {
  isLoading: false,
  setIsLoading: () => {},
};

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    globalLoader = { isLoading, setIsLoading };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export function showLoader() {
  globalLoader.setIsLoading(true);
}

export function hideLoader() {
  globalLoader.setIsLoading(false);
}
