import React, { useEffect, useState } from "react";

type TabCategory =
  | "understanding"
  | "userPersona"
  | "featuresList"
  | "competitorAnalysis"
  | "swotAnalysis"
  | "roadmap";

interface ComingSoonProps {
  currentTab: TabCategory;
}

const categories: Record<TabCategory, string[]> = {
  understanding: [
    "Gathering tools for the masterpiece",
    "Sketching out some innovative ideas",
    "Pondering the perfect concept",
    "Brainstorming a creative masterpiece"
  ],
  userPersona: [
    "Drawing inspiration from the data...",
    "Carefully planning each stroke",
    "Mixing the colors of creativity...",
    "Fine-tuning the intricate details..."
  ],
  featuresList: [
    "Adding a touch of genius...",
    "Reviewing the artistic work...",
    "Making the final adjustments...",
    "Polishing the masterpiece..."
  ],
  competitorAnalysis: [
    "Adding a touch of genius...",
    "Reviewing the artistic work...",
    "Making the final adjustments...",
    "Polishing the masterpiece..."
  ],
  swotAnalysis: [
    "Stepping back to admire the work...",
    "Preparing the grand reveal...",
    "Putting on the finishing touches...",
    "Ensuring everything is perfect..."
  ],
  roadmap: [
    "Framing the final masterpiece...",
    "Ready to unveil the creation...",
    "Bringing the idea to life..."
  ]
};

const ComingSoon: React.FC<ComingSoonProps> = ({ currentTab }) => {
  const [currentText, setCurrentText] = useState(0);
  const textArray = categories[currentTab];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textArray.length);
    }, 2000);

    return () => {
      clearInterval(textInterval);
    };
  }, [textArray]);

  return (
    <div className="loader-container">
      <h3 className="load">Loading...</h3>
      <div className="loader"></div>
      <div className="loader-text">{textArray[currentText]}</div>
    </div>
  );
};

export default ComingSoon;
