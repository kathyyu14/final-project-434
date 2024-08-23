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
        const breeds = response.data.slice(0, 20);
        const fetchImagePromises = breeds.map(dog => 
          axios.get(`http://34.44.107.99/get/${dog.Breed}/imageURL`)
        );

        Promise.all(fetchImagePromises)
          .then(imageResponses => {
            const breedsWithImages = breeds.map((dog, index) => ({
              ...dog,
              imageURL: imageResponses[index].data.ImageURL
            }));
            setDogRanks(breedsWithImages);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching image URLs:', error);
            setError('Error fetching image URLs');
            setLoading(false);
          });
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
      <h1>Top 20 Dog Breeds Predicted for 2024</h1>
      <ul>
        {dogRanks.map((dog, index) => (
          <li key={index}>
            <img src={dog.imageURL} alt={dog.Breed} style={{ width: '100px', marginRight: '10px' }} />
            {dog.Breed}: Rank {dog.PredictedRank2024}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
