
import React from 'react';

interface LoaderProps {
  message: string;
  progress: number;
}

export const Loader: React.FC<LoaderProps> = ({ message, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-lg border border-stone-200">
        <div className="w-16 h-16 border-4 border-t-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-lg font-semibold text-stone-700 text-center">{message}</p>
        <p className="mt-2 text-sm text-stone-500 text-center">AI is working its magic, please wait...</p>
        <div className="w-full bg-stone-200 rounded-full h-2.5 mt-6">
            <div
            className="bg-amber-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
  );
};
