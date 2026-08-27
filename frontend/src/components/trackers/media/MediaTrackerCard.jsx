"use client";

import AnimeTrackerCard from "./AnimeTrackerCard";
import BookTrackerCard from "./BookTrackerCard";
import MovieTrackerCard from "./MovieTrackerCard";
import SeriesTrackerCard from "./SeriesTrackerCard";
import CourseTrackerCard from "./CourseTrackerCard";
import GameTrackerCard from "./GameTrackerCard";
import HabitTrackerCard from "./HabitTrackerCard";
import TrackerCard from "../TrackerCard";

export default function MediaTrackerCard({ tracker, onSelect }) {
  const typeName = (tracker?.trackerType?.name || "").toUpperCase();

  if (typeName.includes("ANIME")) {
    return <AnimeTrackerCard tracker={tracker} onSelect={onSelect} />;
  } else if (typeName.includes("BOOK")) {
    return <BookTrackerCard tracker={tracker} onSelect={onSelect} />;
  } else if (typeName.includes("MOVIE") || typeName.includes("FILM")) {
    return <MovieTrackerCard tracker={tracker} onSelect={onSelect} />;
  } else if (typeName.includes("SERIES") || typeName.includes("TV")) {
    return <SeriesTrackerCard tracker={tracker} onSelect={onSelect} />;
  } else if (typeName.includes("COURSE") || typeName.includes("LEARNING")) {
    return <CourseTrackerCard tracker={tracker} onSelect={onSelect} />;
  } else if (typeName.includes("GAME") || typeName.includes("GAMING")) {
    return <GameTrackerCard tracker={tracker} onSelect={onSelect} />;
  } else if (typeName.includes("HABIT") || typeName.includes("ROUTINE")) {
    return <HabitTrackerCard tracker={tracker} onSelect={onSelect} />;
  }

  // Fallback to standard TrackerCard
  return <TrackerCard tracker={tracker} onSelect={onSelect} />;
}
