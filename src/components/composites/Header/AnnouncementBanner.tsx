"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/atoms/badge";
interface Announcement {
  text: string;
  linkText: string;
  linkUrl: string;
  order: number;
}

interface AnnouncementBannerProps {
  announcements: Announcement[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

export default function AnnouncementBanner({
  announcements,
  autoRotate = true,
  rotationInterval = 5000,
}: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort announcements by order
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => a.order - b.order
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sortedAnnouncements.length - 1 : prev - 1
    );
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === sortedAnnouncements.length - 1 ? 0 : prev + 1
    );
  }, [sortedAnnouncements.length]);

  // Auto-rotate announcements if enabled
  useEffect(() => {
    if (!autoRotate || sortedAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoRotate, rotationInterval, sortedAnnouncements.length, handleNext]);

  // If no announcements, don't render anything
  if (sortedAnnouncements.length === 0) return null;

  const currentAnnouncement = sortedAnnouncements[currentIndex];

  return (
    <div className="w-[90%] mx-auto mt-4 px-4 rounded-full py-4 bg-primary  flex items-center justify-center">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <Badge className="rounded-full">NEWS</Badge>
          <span className="text-white mr-3">{currentAnnouncement.text}</span>
          <Link
            href={currentAnnouncement.linkUrl}
            className="font-medium text-white underline"
          >
            {currentAnnouncement.linkText}
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-2">
          {" "}
          <button
            onClick={handlePrevious}
            className="text-white/80 cursor-pointer hover:text-white transition-colors"
            aria-label="Previous announcement"
            disabled={sortedAnnouncements.length <= 1}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="text-white/80 cursor-pointer hover:text-white transition-colors"
            aria-label="Next announcement"
            disabled={sortedAnnouncements.length <= 1}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
