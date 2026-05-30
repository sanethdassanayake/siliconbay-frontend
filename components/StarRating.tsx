"use client";

import React, { useState } from "react";

const StarFill = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: size, height: size }}
    className="text-yellow-500"
  >
    <path d="M19.467,23.316,12,17.828,4.533,23.316,7.4,14.453-.063,9H9.151L12,.122,14.849,9h9.213L16.6,14.453Z" />
  </svg>
);

const StarUnfill = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: size, height: size }}
    className="text-gray-300"
  >
    <path d="M24.062,9.033H14.849L12,.156l-2.849,8.877H-.062l7.46,5.453-2.864,8.863,7.467-5.488,7.467,5.488-2.864-8.863,7.46-5.453Zm-6.5,11.676l-5.562-4.089-5.562,4.089,2.134-6.604L3,10.033h6.881l2.119-6.605,2.12,6.605h6.88l-5.571,4.072,2.134,6.604Z" />
  </svg>
);

interface StarRatingProps {
  rating?: number;          // initial rating
  size?: number;            // pixel size
  interactive?: boolean;    // enable interactivity
  onChange?: (value: number) => void; // callback when rating changes
}

const StarRating = ({ rating = 0, size = 16, interactive = false, onChange }: StarRatingProps) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : currentRating;

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const filled = i <= displayRating;

    const star = filled ? <StarFill size={size} /> : <StarUnfill size={size} />;

    if (interactive) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => {
            setCurrentRating(i);
            onChange?.(i);
          }}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(null)}
          className="focus:outline-none"
        >
          {star}
        </button>
      );
    } else {
      stars.push(<span key={i}>{star}</span>);
    }
  }

  return <div className="flex gap-1">{stars}</div>;
};

export default StarRating;
