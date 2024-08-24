import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [dogRanks, setDogRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('predicted');

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
      <header>
        <h1>ACK US Dog Breed Popularity App</h1>
        <div className="tabs">
          <button onClick={() => setActiveTab('predicted')} className={activeTab === 'predicted' ? 'active' : ''}>
            Top 20 Predicted Dog Breed Popularity for Future
          </button>
          <button onClick={() => setActiveTab('rankings')} className={activeTab === 'rankings' ? 'active' : ''}>
            Dog Breed Rankings by Year
          </button>
        </div>
      </header>

      {activeTab === 'predicted' && (
        <div>
          <h2>Top 20 Predicted Dog Breed Popularity for 2024</h2>
          <ul>
            {dogRanks.map((dog, index) => (
              <li key={index}>
                <img src={dog.imageURL} alt={dog.Breed} style={{ width: '100px', marginRight: '10px' }} />
                {dog.Breed}: Rank {dog.PredictedRank2024}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'rankings' && (
        <div>
          <h2>Dog Breed Rankings by Year</h2>
          <table>
            <thead>
              <tr>
                <th>Breed</th>
                <th>2013 Rank</th>
                <th>2014 Rank</th>
                <th>2015 Rank</th>
                <th>2016 Rank</th>
                <th>2017 Rank</th>
                <th>2018 Rank</th>
                <th>2019 Rank</th>
                <th>2020 Rank</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {dogRanks.map((dog, index) => (
                <tr key={index}>
                  <td>{dog.Breed}</td>
                  <td>{dog.rank_2013}</td>
                  <td>{dog.rank_2014}</td>
                  <td>{dog.rank_2015}</td>
                  <td>{dog.rank_2016}</td>
                  <td>{dog.rank_2017}</td>
                  <td>{dog.rank_2018}</td>
                  <td>{dog.rank_2019}</td>
                  <td>{dog.rank_2020}</td>
                  <td><a href={dog.image_url} target="_blank" rel="noopener noreferrer">Link</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [dogRanks, setDogRanks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get('http://34.44.107.99/predict')
//       .then(response => {
//         const breeds = response.data.slice(0, 20);
//         const fetchImagePromises = breeds.map(dog => 
//           axios.get(`http://34.44.107.99/get/${dog.Breed}/imageURL`)
//         );

//         Promise.all(fetchImagePromises)
//           .then(imageResponses => {
//             const breedsWithImages = breeds.map((dog, index) => ({
//               ...dog,
//               imageURL: imageResponses[index].data.ImageURL
//             }));
//             setDogRanks(breedsWithImages);
//             setLoading(false);
//           })
//           .catch(error => {
//             console.error('Error fetching image URLs:', error);
//             setError('Error fetching image URLs');
//             setLoading(false);
//           });
//       })
//       .catch(error => {
//         console.error('Error fetching prediction data:', error);
//         setError('Error fetching prediction data');
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="App">
//       <h1>Top 20 Predicted Dog Breed Popularity for 2024</h1>
//       <ul>
//         {dogRanks.map((dog, index) => (
//           <li key={index}>
//             <img src={dog.imageURL} alt={dog.Breed} style={{ width: '100px', marginRight: '10px' }} />
//             {dog.Breed}: Rank {dog.PredictedRank2024}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
