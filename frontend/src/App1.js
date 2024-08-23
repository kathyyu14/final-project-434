import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [dogRanks, setDogRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://34.44.107.99/predict')
      .then(response => {
        setDogRanks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching prediction data:', error);
        setError('Error fetching prediction data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <h1>Top 20 Predicted Dog Breed Popularity for 2024</h1>
      <ul>
        {dogRanks.slice(0, 20).map((dog, index) => (
          <li key={index}>{dog.Breed}: Rank {dog.PredictedRank2024}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
