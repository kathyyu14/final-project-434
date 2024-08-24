import React, { useState } from 'react';
import './App.css';
import DogRankings from './DogRankings';
import PredictedDogRanks from './PredictedDogRanks';

function App() {
  const [activeTab, setActiveTab] = useState('predicted');

  return (
    <div className="App">
      <header>
        <h1>Most Popular Dog Breeds - American Kennel Club</h1>
        <div className="tabs">
          <button onClick={() => setActiveTab('predicted')} className={activeTab === 'predicted' ? 'active' : ''}>
            Top 20 Predicted Dog Breed Popularity for Future
          </button>
          <button onClick={() => setActiveTab('rankings')} className={activeTab === 'rankings' ? 'active' : ''}>
            Dog Breed Rankings by Year
          </button>
        </div>
      </header>

      {activeTab === 'predicted' && <PredictedDogRanks />}
      {activeTab === 'rankings' && <DogRankings />}
    </div>
  );
}

export default App;
