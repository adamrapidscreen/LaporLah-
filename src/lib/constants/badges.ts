export const BADGES = {
    spotter: {
      emoji: "🔦",
      name: "Spotter",
      flair: "First to shine a light",
      thresholds: { bronze: 1, silver: 5, gold: 15 },
    },
    kampung_hero: {
      emoji: "🤝",
      name: "Kampung Hero",
      flair: "Stronger together",
      thresholds: { bronze: 5, silver: 15, gold: 50 },
    },
    closer: {
      emoji: "✅",
      name: "Closer",
      flair: "Gets things done",
      thresholds: { bronze: 2, silver: 5, gold: 15 },
    },
  } as const;
  