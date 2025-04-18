import { isoToDDMMYYYY } from "../utils/dateUtils";

// Data Table Header Component
function DataTableHeader({ userRole }) {
  return (
    <div className="table-header" role="row">
      <span role="columnheader">NAME</span>
      <span role="columnheader">R.VELOCITY</span>
      <span role="columnheader">DISTANCE (AU)</span>
      <span role="columnheader">DATE</span>
      <span role="columnheader">IMPACT</span>
      <span role="columnheader">DIAMETER (KM)</span>
      <span role="columnheader">RANGE</span>
      {userRole === "scientist" && <span role="columnheader">ACTIONS</span>}
    </div>
  );
}

// Data Table Row Component
function DataTableRow({ body, userRole, handleEditRow, handleDeleteObject }) {
  return (
    <div key={body.name + body.date} className="table-row" role="row">
      <span role="cell">{body.name}</span>
      <span role="cell">{body.relativeVelocity}</span>
      <span role="cell">{body.distance?.toLocaleString()}</span>
      <span role="cell">{isoToDDMMYYYY(body.date)}</span>
      <span role="cell">{body.impact}</span>
      <span role="cell">{body.diameter}</span>
      <span role="cell">{body.range}</span>

      {userRole === "scientist" && body.isEditable && (
        <span role="cell" className="action-cell">
          <button className="edit-btn" onClick={() => handleEditRow(body)} aria-label={`Edit ${body.name}`} aria-disabled={!body.isEditable}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => handleDeleteObject(body.name)} aria-label={`Delete ${body.name}`}>
            Delete
          </button>
        </span>
      )}
    </div>
  );
}

// Data Table Body Component
function DataTableBody({ data, userRole, debouncedSearchQuery, handleEditRow, handleDeleteObject }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No space objects found{debouncedSearchQuery ? ` matching "${debouncedSearchQuery}"` : ""}.</p>
      </div>
    );
  }

  return (
    <>
      {data.map(body => (
        <DataTableRow key={body.name + body.date} body={body} userRole={userRole} handleEditRow={handleEditRow} handleDeleteObject={handleDeleteObject} />
      ))}
    </>
  );
}

// Data Section Component
export function DataSection({ paginatedData, userRole, debouncedSearchQuery, handleEditRow, handleDeleteObject }) {
  return (
    <section className="data-section">
      <h2 className="section-title">Space Objects Database</h2>
      <div className="data-table" role="region" aria-label="Space objects data" tabIndex="0">
        <DataTableHeader userRole={userRole} />

        <DataTableBody
          data={paginatedData.data}
          userRole={userRole}
          debouncedSearchQuery={debouncedSearchQuery}
          handleEditRow={handleEditRow}
          handleDeleteObject={handleDeleteObject}
        />
      </div>
    </section>
  );
}
