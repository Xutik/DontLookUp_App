import { useState } from 'react'
import './App.css'

const initialData = [/* Your data array here */]

export default function App() {
  // Remove unused state variables if not needed:
  const [data, setData] = useState(initialData)  // Required if using CRUD operations
  const [selectedPlanet, setSelectedPlanet] = useState('Earth')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingBody, setEditingBody] = useState(null)  // Needed for edit functionality
  const [formData, setFormData] = useState({  // Required for form handling
    name: '',
    size: 1,
    distance: '',
    planet: 'Earth',
    date: '',
    risk: 0
  })

  // Filtering and utility functions here...
  // Add filtering logic to use these variables:
  const filteredData = data.filter(item => 
    item.planet === selectedPlanet &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
// Add this before return()
// const filteredData = data.filter(body => 
//   body.planet === selectedPlanet &&
//   body.name.toLowerCase().includes(searchQuery.toLowerCase())
// )

  return (
    <div className="crt">
      <div className="frame">
        {/* Space visualization area */}
        <div className="space-view">
          {filteredData.map(body => (
            <div 
              key={body.name + body.date}
              className="space-body"
              style={{
                left: `${Math.log(body.distance) / 25}%`,
                width: body.size * 10,
                height: body.size * 10,
                opacity: 1 - (body.risk * 0.3)
              }}
            />
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="row">
          <input
            type="text"
            placeholder="SEARCH OBJECT..."
            className="search-input"
            value={searchQuery}
            // value={formData.name}
            onChange={(e) => setSearchQuery(e.target.value)}
            // onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <select 
            className="planet-select"
            value={selectedPlanet}
            onChange={(e) => setSelectedPlanet(e.target.value)}
          >
            {['Earth', 'Mars', 'Neptune', 'Venice'].map(planet => (
              <option key={planet} value={planet}>{planet}</option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div className="data-table">
          <div className="table-header">
            <span>NAME</span>
            <span>SIZE</span>
            <span>DIST (KM)</span>
            <span>DATE</span>
            <span>RISK</span>
          </div>
          {filteredData.map(body => (
            <div key={body.name + body.date} className="table-row">
              <span>{body.name}</span>
              <span>{body.size}</span>
              <span>{body.distance.toLocaleString()}</span>
              <span>{body.date}</span>
              <span className={`risk-${Math.floor(body.risk * 10)}`}>
                {body.risk}
              </span>
            </div>
          ))}
        </div>

        {/* Edit/Create Form */}
        <div className="form-panel">
          <input type="text" placeholder="NAME" />
          <input type="number" placeholder="SIZE" />
          <input type="number" placeholder="DISTANCE" />
          <input type="date" placeholder="DATE" />
          <select>
            <option>RISK LEVEL</option>
            <option value="0">0 - Safe</option>
            <option value="0.3">0.3 - Monitor</option>
            <option value="0.7">0.7 - Warning</option>
            <option value="1">1 - Critical</option>
          </select>
          <div className="button-group">
            <button className="btn confirm">✔ CONFIRM</button>
            <button className="btn cancel">✖ CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  )
}
