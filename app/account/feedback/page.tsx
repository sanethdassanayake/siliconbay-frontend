"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, MessageSquare, Star, ThumbsUp } from "lucide-react";

import { requestBackend } from "@/lib/backend";

type FeedbackRow = {
  id: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
  helpful: number;
};

const normalizeFeedback = (value: unknown): FeedbackRow[] => {
  const rows = Array.isArray(value)
    ? value
    : Array.isArray((value as { feedback?: unknown[] } | null)?.feedback)
      ? (value as { feedback: unknown[] }).feedback
      : Array.isArray((value as { reviews?: unknown[] } | null)?.reviews)
        ? (value as { reviews: unknown[] }).reviews
        : [];

  return rows.map((row, index) => {
    const current = row as Record<string, unknown>;

    return {
      id: String(current.id ?? current.feedbackId ?? current.reviewId ?? `FB-${index + 1}`),
      productName: String(current.productName ?? current.product ?? current.title ?? ""),
      rating: Number(current.rating ?? current.stars ?? 0),
      comment: String(current.comment ?? current.message ?? ""),
      date: String(current.date ?? current.createdAt ?? ""),
      status: String(current.status ?? "Published"),
      helpful: Number(current.helpful ?? current.helpfulCount ?? 0),
    };
  });
};

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [loadMessage, setLoadMessage] = useState("Loading feedback records from the backend.");

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await requestBackend<Record<string, unknown>>("/feedback");
        setFeedbacks(normalizeFeedback(response));
        setLoadMessage("");
      } catch {
        setFeedbacks([]);
        setLoadMessage("No feedback records are available yet.");
      }
    };

    loadFeedback();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Reviews", value: String(feedbacks.length), icon: MessageSquare },
      {
        label: "Avg Rating",
        value:
          feedbacks.length > 0
            ? (feedbacks.reduce((total, item) => total + item.rating, 0) / feedbacks.length).toFixed(1)
            : "0.0",
        icon: Star,
      },
      { label: "Published", value: String(feedbacks.filter((item) => item.status === "Published").length), icon: ThumbsUp },
      { label: "Pending", value: String(feedbacks.filter((item) => item.status !== "Published").length), icon: AlertCircle },
    ],
    [feedbacks]
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="bg-white border p-4">
        <h1 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h1>
        <p className="text-sm text-gray-600 mt-1">Share your experience and help other customers make informed decisions</p>
      </div>

      {loadMessage ? (
        <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          {loadMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="bg-amber-50 p-3">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border p-4">
        <div className="flex gap-3">
          <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Feedback records</h3>
            <p className="text-sm text-gray-600">
              Reviews are loaded from the backend when available. No hardcoded sample feedback is shown here.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Feedback ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Comment</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {feedbacks.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-600" colSpan={5}>
                    No feedback records are available yet.
                  </td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{feedback.id}</td>
                    <td className="px-4 py-3 text-gray-900">{feedback.productName || "Unnamed product"}</td>
                    <td className="px-4 py-3">{renderStars(feedback.rating)}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-md">
                      <div className="truncate">{feedback.comment || "No comment provided"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-nowrap">{feedback.date || "Unavailable"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
