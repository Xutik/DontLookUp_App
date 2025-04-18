// Data Entry Section Component
export function DataEntrySection({ action, formData, setFormData, handleSubmit, handleClear }) {
  return (
    <section className="data-entry-section">
      <h2 className="section-title">{action === "ADD" ? "Add New Space Object" : "Edit Space Object"}</h2>
      <div className="form-panel" role="form" aria-label={action === "ADD" ? "Add new space object form" : "Edit space object form"}>
        <div className="labels-row">
          <label htmlFor="name-input">NAME</label>
          <label htmlFor="diameter-input">DIAMETER (KM)</label>
          <label htmlFor="distance-input">DISTANCE (AU)</label>
          <label htmlFor="date-input">DATE</label>
          <label htmlFor="velocity-input">VELOCITY</label>
          <label htmlFor="range-input">RANGE</label>
          <label htmlFor="impact-input">IMPACT</label>
        </div>

        <div className="inputs-row">
          <input
            id="name-input"
            type="text"
            placeholder="NAME"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            aria-required="true"
            disabled={action === "EDIT"}
          />

          <input
            id="diameter-input"
            type="number"
            placeholder="SIZE"
            value={formData.diameter}
            onChange={e => setFormData({ ...formData, diameter: e.target.value })}
            min={0}
            aria-required="true"
          />

          <input
            id="distance-input"
            type="number"
            placeholder="DISTANCE"
            value={formData.distance}
            onChange={e => setFormData({ ...formData, distance: e.target.value })}
            min={0}
            aria-required="true"
          />

          <input
            id="date-input"
            type="text"
            placeholder="DD.MM.YYYY"
            value={formData.date}
            onChange={e => {
              setFormData({ ...formData, date: e.target.value });
            }}
            aria-required="true"
          />

          <input
            id="velocity-input"
            type="number"
            placeholder="VELOCITY"
            value={formData.relativeVelocity}
            onChange={e => {
              setFormData({
                ...formData,
                relativeVelocity: e.target.value,
              });
            }}
            min={0}
            aria-required="true"
          />

          <input
            id="range-input"
            type="text"
            placeholder="RANGE"
            value={formData.range}
            onChange={e => setFormData({ ...formData, range: e.target.value })}
            aria-required="true"
          />

          <input
            id="impact-input"
            type="number"
            placeholder="IMPACT"
            value={formData.impact}
            onChange={e => setFormData({ ...formData, impact: e.target.value })}
            min={0}
            aria-required="true"
          />
        </div>

        <div className="buttons-row">
          <div className="spacer"></div>
          <div className="button-group">
            <button
              className="btn confirm"
              onClick={handleSubmit}
              aria-label={action === "ADD" ? "Confirm creating new object" : "Confirm editing object"}
              disabled={!formData.name}
            >
              ✔ CONFIRM
            </button>
            <button className="btn cancel" onClick={handleClear} aria-label="Clear form">
              ✖ ERASE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
