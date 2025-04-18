// Space Object Component for Visualization
function SpaceObject({ body, index }) {
  // Convert distance to number (in AU)
  const distance = parseFloat(body.distance) || 0.05;

  // Calculate size based on diameter (with fallback and scaling)
  let size = 6; // Default base size

  if (body.diameter) {
    // Convert diameter to pixels with logarithmic scaling
    const diameterValue = parseFloat(body.diameter);
    if (diameterValue > 0) {
      // Scale diameter logarithmically - larger objects appear bigger
      size = Math.max(3, Math.min(24, 5 + Math.log2(diameterValue * 100)));
    }
  }

  // Create evenly distributed angles around Earth
  // Use index combined with name hash for consistent but distributed positioning
  const nameHash = body.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Distribute full 360 degrees (2π radians)
  // Combine index-based distribution with name-based offset for natural variation
  const angle = (((index * 137.5) % 360) + (nameHash % 60)) * (Math.PI / 180);

  // Properly scale distances - AU distances are typically 0.001-0.05 range
  // Map distances to a reasonable radius within our visualization area
  const minDistance = 8; // Minimum distance from center in %
  const maxDistance = 44; // Maximum distance from center in %

  // Calculate normalized radius (as percentage from center)
  // Using logarithmic scale to better distribute objects visually
  const radius = minDistance + Math.min(maxDistance - minDistance, (Math.log(1 + distance * 100) / Math.log(1 + 5)) * (maxDistance - minDistance));

  // Calculate position
  const left = 50 + radius * Math.cos(angle);
  const top = 50 + radius * Math.sin(angle);

  // Determine color based on impact factor or other properties
  let color = "#88ff88"; // Default green low impact
  if (body.impact) {
    const impact = parseFloat(body.impact);
    if (impact > 0.5)
      color = "#ff5555"; // High impact
    else if (impact > 0.2) color = "#ffaa55"; // Medium impact
  }
  if (body.isEditable) {
    color = "#00ffff";
  }

  return (
    <div
      className="space-body"
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: `0 0 ${size / 2}px ${color}`,
        transition: "all 0.3s ease-in-out",
        zIndex: "2",
      }}
      title={`${body.name} - ${body.distance} AU`}
      aria-hidden="true"
    />
  );
}

// Visualization Section Component
export function VisualizationSection({ objects }) {
  return (
    <section className="visualization-section">
      <h2 className="section-title">Space Objects Visualization</h2>
      <div className="frame" aria-hidden="true">
        <div className="space-view" role="img" aria-label="Visual representation of space objects around Earth">
          {/* Earth representation */}
          <div className="earth" aria-hidden="true" />

          {objects?.map((body, index) => (
            <SpaceObject key={body.name + body.date} body={body} index={index} />
          ))}
        </div>
      </div>
      <div className="visualization-legend">
        <div className="legend-title">Object Editability:</div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#00ffff" }}></span>
          <span>Editable objects</span>
        </div>
        <div className="legend-title">Impact Risk:</div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#ff5555" }}></span>
          <span>High impact risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#ffaa55" }}></span>
          <span>Medium impact risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#88ff88" }}></span>
          <span>Low impact risk</span>
        </div>
      </div>
    </section>
  );
}
