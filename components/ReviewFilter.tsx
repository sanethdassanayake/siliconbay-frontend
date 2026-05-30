'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';

type Review = {
    by: string;
    date: string;
    stars: number;
    message: string;
    images: string[];
};

type FilterType = 'all' | 'positive' | 'neutral' | 'negative';

interface ReviewFilterProps {
    reviews: Review[];
}

export default function ReviewFilter({ reviews }: ReviewFilterProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filterReviews = (reviews: Review[], filter: FilterType) => {
        if (!reviews || reviews.length === 0) return [];
        
        switch (filter) {
            case 'positive':
                return reviews.filter(review => Number(review.stars) >= 4);
            case 'neutral':
                return reviews.filter(review => Number(review.stars) === 3);
            case 'negative':
                return reviews.filter(review => Number(review.stars) <= 2);
            default:
                return reviews;
        }
    };

    const filteredReviews = filterReviews(reviews, activeFilter);

    console.log('Active Filter:', activeFilter);
    console.log('Total Reviews:', reviews?.length);
    console.log('Filtered Reviews:', filteredReviews?.length);

    return (
        <div className='flex-1 min-w-0'>
            {/* FILTER BUTTONS */}
            <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-4">
                <div className="flex gap-2 whitespace-nowrap">
                    <Button
                        variant={activeFilter === 'all' ? 'default' : 'outline'}
                        className={`rounded-full shrink-0 ${activeFilter === 'all' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Reviews
                    </Button>
                    <Button
                        variant={activeFilter === 'positive' ? 'default' : 'outline'}
                        className={`rounded-full shrink-0 ${activeFilter === 'positive' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                        onClick={() => setActiveFilter('positive')}
                    >
                        Positive Reviews
                    </Button>
                    <Button
                        variant={activeFilter === 'neutral' ? 'default' : 'outline'}
                        className={`rounded-full shrink-0 ${activeFilter === 'neutral' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                        onClick={() => setActiveFilter('neutral')}
                    >
                        Neutral Reviews
                    </Button>
                    <Button
                        variant={activeFilter === 'negative' ? 'default' : 'outline'}
                        className={`rounded-full shrink-0 ${activeFilter === 'negative' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                        onClick={() => setActiveFilter('negative')}
                    >
                        Negative Reviews
                    </Button>
                </div>
            </div>

            {/* REVIEWS LIST */}
            {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                    <div key={`${review.by}-${review.date}-${index}`} className="grid py-4 border-t gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Image
                                src="/users/user-placeholder.png"
                                alt="User Avatar"
                                width={48}
                                height={48}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className='grid'>
                                <span className="text-sm">
                                    {review.by} on {new Date(review.date).toLocaleDateString()}
                                </span>
                                <StarRating rating={review.stars} interactive={false} />
                            </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.message}</p>
                        <div className="flex items-center gap-2">
                            {review.images.map((img, imgIndex) => (
                                <Image
                                    key={imgIndex}
                                    src={img}
                                    alt={`Review Image ${imgIndex + 1}`}
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 object-cover rounded-md border"
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No reviews found for this filter.
                </div>
            )}
        </div>
    );
}