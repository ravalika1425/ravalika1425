import React from "react";
import { CompetitorAnalysisFragment } from "Mike/models/response";
import "./Competitor.css";

type CompetitorProp = {
  competitorData: CompetitorAnalysisFragment | null | undefined;
};

const CompetitorTable = ({ competitorData }: CompetitorProp) => {
  if (!competitorData?.data || competitorData.data.length === 0) {
    return <p>No competitors found in our database.</p>;
  }

  // Extract feature titles from the first competitor for a consistent order
  const featureTitles = competitorData.data[0].features.map((feature) => feature.title);

  // Function to reorder features of each competitor based on `featureTitles`
  const reorderFeatures = (features: any[]) => {
    return featureTitles.map((title) => features.find((feature) => feature.title === title) || { title, status: "not-available" });
  };

  return (
    <div className="competitor-table">
      <h2>{competitorData.domain} - Competitor Analysis</h2>
      <table>
        <thead>
          <tr>
            <th className="feature-header">Feature</th>
            {competitorData.data.map((competitor, index) => (
              <th key={index} className="competitor-header">
                {competitor.competitor}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureTitles.map((title, rowIndex) => (
            <tr key={rowIndex}>
              <td>{title}</td>
              {competitorData.data.map((competitor, colIndex) => {
                const reorderedFeatures = reorderFeatures(competitor.features);
                console.log("re:", reorderedFeatures)
                const feature = reorderedFeatures.find((f) => f.title === title);
                return (
                  <td key={colIndex}>
                    {feature ? (
                      <span
                        className={`status-circle ${feature.status}`}
                        title={feature.status}
                      ></span>
                    ) : (
                      <span className="status-circle not-available" title="not-available"></span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompetitorTable;
