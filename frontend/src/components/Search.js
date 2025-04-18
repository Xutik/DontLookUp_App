// Search Component
export function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div>
      <label htmlFor="search-input" className="visually-hidden">
        Search space objects
      </label>
      <input
        id="search-input"
        type="text"
        placeholder="Search space objects..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        aria-label="Search space objects"
      />
    </div>
  );
}
