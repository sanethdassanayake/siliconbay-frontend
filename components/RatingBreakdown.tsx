import React from "react";

type RatingBreakdownProps = {
    data?: { [key: number]: number }; // e.g. { 5: 120, 4: 90, ... }
    maxStars?: number;
    barColor?: string;
    bgColor?: string;
    height?: string;
    radius?: string;
    starLabelColor?: string;
    countLabelColor?: string;
};

const RatingBreakdown = ({
    data,                // e.g. { 5: 120, 4: 90, ... }
    maxStars = 5,
    barColor = "bg-amber-500",
    bgColor = "bg-gray-200",
    height = "h-2",
    radius = "rounded-full",
    starLabelColor = "text-gray-600",
    countLabelColor = "text-gray-800",
}: RatingBreakdownProps) => {

    // If no data passed → generate fake sample data (optional)
    const defaultData: Record<number, number> = { 5: 450, 4: 320, 3: 130, 2: 60, 1: 30 };
    const breakdown: Record<number, number> = data || defaultData;

    // Find total reviews
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-4">
            {Array.from({ length: maxStars }, (_, i) => maxStars - i).map((star) => {
                const count = breakdown[star] || 0;
                const percentage = total ? (count / total) * 100 : 0;

                return (
                    <div key={star} className="flex items-center gap-4">

                        {/* Left star label */}
                        <span className={`w-6 text-sm ${starLabelColor}`}>
                            {star}★
                        </span>

                        {/* Bar container */}
                        <div className={`w-full ${bgColor} ${radius} ${height}`}>
                            <div
                                className={`${barColor} ${height} ${radius}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>

                        {/* Right count label */}
                        <span className={`w-12 text-right text-sm ${countLabelColor}`}>
                            {count}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default RatingBreakdown;
