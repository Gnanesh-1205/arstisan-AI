
import React, { useState } from 'react';
import { Review } from '../types';
import { StarRating } from './StarRating';

interface CommentSectionProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ reviews, onAddReview }) => {
  const [newRating, setNewRating] = useState(0);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || newRating === 0 || !newComment.trim()) {
      setError('Please fill in all fields and provide a rating.');
      return;
    }
    onAddReview({ author: newAuthor, rating: newRating, comment: newComment });
    // Reset form
    setNewAuthor('');
    setNewRating(0);
    setNewComment('');
    setError('');
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-lg shadow-lg border border-stone-200">
      <h3 className="text-2xl font-semibold text-stone-700 border-b pb-3">Customer Reviews</h3>
      
      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-semibold text-lg text-stone-600">Leave a Review</h4>
        <div>
            <label htmlFor="author" className="block text-sm font-medium text-stone-600 mb-1">Your Name</label>
            <input 
                type="text" 
                id="author" 
                value={newAuthor} 
                onChange={(e) => setNewAuthor(e.target.value)} 
                className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Jane Doe"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Your Rating</label>
            <StarRating rating={newRating} setRating={setNewRating} />
        </div>
        <div>
            <label htmlFor="comment" className="block text-sm font-medium text-stone-600 mb-1">Your Comment</label>
            <textarea 
                id="comment"
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                rows={4}
                className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                placeholder="What did you think of this product?"
            />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition">
            Submit Review
        </button>
      </form>

      {/* Existing Reviews */}
      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-t border-stone-200 pt-6">
              <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-stone-800">{review.author}</p>
                    <p className="text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="mt-2 text-stone-600 whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-stone-500 pt-4 border-t border-stone-200">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};
