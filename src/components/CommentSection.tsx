"use client";
import React, { useState } from 'react';

const CommentSection = () => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-[#1D2026] mb-4">Comments</h3>
      <div className="mb-4">
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#564FFD]"
          rows={3}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="mt-2 bg-[#564FFD] text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-[#564FFD]/90 transition"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>
      <div>
        {comments.length > 0 ? (
          <ul className="space-y-3">
            {comments.map((comment, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-md p-3 text-sm text-gray-700"
              >
                {comment}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;