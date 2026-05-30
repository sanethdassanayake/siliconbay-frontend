"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Latest Microcontrollers",
    subtitle: "High-performance embedded systems",
    image: "/carousel/carousel-1.jpg",
  },
  {
    id: 2,
    title: "Memory Solutions",
    subtitle: "Fast and reliable storage",
    image: "/carousel/carousel-2.jpg",
  },
  {
    id: 3,
    title: "Power Management",
    subtitle: "Efficient energy solutions",
    image: "/carousel/carousel-3.jpg",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const lock = useRef(false);

  const next = () => {
    if (lock.current) return;
    lock.current = true;

    setCurrent((prev) => (prev + 1) % slides.length);

    setTimeout(() => {
      lock.current = false;
    }, 700);
  };

  const prev = () => {
    if (lock.current) return;
    lock.current = true;

    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    setTimeout(() => {
      lock.current = false;
    }, 700);
  };

  // Auto play
  useEffect(() => {
    if (paused) return;

    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative bg-secondary overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Carousel container */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out
              ${index === current ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"}
            `}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white drop-shadow">
                <h2 className="text-3xl md:text-5xl font-bold mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow p-2 rounded-full transition z-30"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow p-2 rounded-full transition z-30"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
