
import React from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, size = 'md' }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const isInteractive = !!setRating;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleStarClick = (starValue: number) => {
    if (setRating) {
      setRating(starValue);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${isInteractive ? 'cursor-pointer' : ''}`}>
      {stars.map((starValue) => (
        <button
          key={starValue}
          type="button"
          onClick={() => handleStarClick(starValue)}
          disabled={!isInteractive}
          className={`text-amber-500 transition-transform duration-200 ${isInteractive ? 'hover:scale-110' : ''}`}
          aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
        >
          <StarIcon
            isFilled={starValue <= rating}
            className={sizeClasses[size]}
          />
        </button>
      ))}
    </div>
  );
};
