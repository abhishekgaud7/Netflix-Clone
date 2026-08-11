import React, { useEffect } from 'react';
import { CheckCircle2, Copy, Film } from 'lucide-react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex items-center space-x-3 bg-gray-900/95 border border-red-600 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-slide-up">
      <CheckCircle2 className="w-5 h-5 text-red-500" />
      <span className="text-sm font-bold tracking-wide">{message}</span>
    </div>
  );
};

export default Toast;
