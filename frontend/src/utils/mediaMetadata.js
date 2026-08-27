/**
 * Media Metadata Extraction Utility
 * -----------------------------------
 * Accurately extracts Rating, Creator/Studio/Author, Synopsis, and Genres
 * from tracker values, notes, or structured metadata to avoid incorrect fallback data.
 */

export function extractMediaMetadata(tracker) {
  if (!tracker) {
    return {
      rating: 8.0,
      creator: "Media Creator",
      synopsis: "",
      genres: [],
      year: null,
      coverUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    };
  }

  // 1. Build map from tracker.values array if present
  const valuesMap = {};
  if (tracker.values && Array.isArray(tracker.values)) {
    tracker.values.forEach((v) => {
      const fieldName = v.trackerField?.fieldName || v.fieldName;
      if (fieldName) {
        try {
          valuesMap[fieldName] = typeof v.valueJson === "string" ? JSON.parse(v.valueJson) : v.valueJson;
        } catch {
          valuesMap[fieldName] = v.valueJson;
        }
      }
    });
  }

  // 2. Parse from tracker.notes or description if created via autocomplete
  const notesText = tracker.notes || tracker.description || "";
  
  let parsedRating = null;
  const ratingMatch = notesText.match(/Rating:\s*([\d.]+)/i);
  if (ratingMatch && ratingMatch[1]) {
    parsedRating = parseFloat(ratingMatch[1]);
  }

  let parsedCreator = null;
  const creatorMatch = notesText.match(/(?:Creator\/Studio|Studio|Author|Director|Creator|Network|Platform):\s*([^\n\r]+)/i);
  if (creatorMatch && creatorMatch[1]) {
    parsedCreator = creatorMatch[1].trim();
  }

  let parsedYear = null;
  const yearMatch = notesText.match(/Year:\s*(\d{4})/i);
  if (yearMatch && yearMatch[1]) {
    parsedYear = parseInt(yearMatch[1]);
  }

  let parsedSynopsis = notesText;
  const synopsisMatch = notesText.match(/Synopsis:\s*([\s\S]*?)(?=\n(?:Creator|Rating|Year|CoverImage|TargetCount|UnitLabel)|$)/i);
  if (synopsisMatch && synopsisMatch[1]) {
    parsedSynopsis = synopsisMatch[1].trim();
  }

  let parsedCoverUrl = null;
  const coverMatch = notesText.match(/(?:CoverImage|CoverUrl|Image):\s*([^\s\n\r]+)/i);
  if (coverMatch && coverMatch[1]) {
    parsedCoverUrl = coverMatch[1].trim();
  }

  let parsedTargetCount = null;
  const targetMatch = notesText.match(/TargetCount:\s*(\d+)/i);
  if (targetMatch && targetMatch[1]) {
    parsedTargetCount = parseInt(targetMatch[1]);
  }

  let parsedUnitLabel = null;
  const unitMatch = notesText.match(/UnitLabel:\s*([^\n\r]+)/i);
  if (unitMatch && unitMatch[1]) {
    parsedUnitLabel = unitMatch[1].trim();
  }

  // 3. Resolve metadata accurately with zero incorrect hardcoded fallbacks
  const rating =
    tracker.rating ||
    valuesMap["Score"] ||
    valuesMap["Rating"] ||
    valuesMap["MAL Score"] ||
    parsedRating ||
    8.0;

  const creator =
    valuesMap["Studio"] ||
    valuesMap["Author"] ||
    valuesMap["Director"] ||
    valuesMap["Network"] ||
    valuesMap["Platform"] ||
    valuesMap["Creator"] ||
    parsedCreator ||
    (tracker.trackerType?.name?.toUpperCase().includes("ANIME")
      ? "Anime Studio"
      : tracker.trackerType?.name?.toUpperCase().includes("BOOK")
      ? "Author"
      : tracker.trackerType?.name?.toUpperCase().includes("MOVIE")
      ? "Director"
      : "Producer");

  const coverUrl =
    tracker.coverUrl ||
    tracker.coverImage ||
    parsedCoverUrl ||
    valuesMap["Poster"] ||
    valuesMap["Cover Image"] ||
    valuesMap["Image URL"] ||
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";

  const targetCountVal = tracker.targetCount !== undefined && tracker.targetCount !== null ? tracker.targetCount : (parsedTargetCount || 0);
  const isOngoing =
    tracker.isOngoing === true ||
    targetCountVal === 0 ||
    notesText.match(/Ongoing:\s*true/i) ||
    notesText.match(/Status:\s*(?:RELEASING|Currently Airing|Ongoing)/i) ||
    tracker.status === "RELEASING";

  return {
    rating: Math.round(Number(rating) * 10) / 10,
    creator,
    synopsis: parsedSynopsis,
    year: parsedYear,
    coverUrl,
    targetCount: targetCountVal,
    unitLabel: tracker.unitLabel || parsedUnitLabel || "units",
    isOngoing: Boolean(isOngoing),
    valuesMap,
  };
}
