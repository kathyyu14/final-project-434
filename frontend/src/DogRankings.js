import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DogRankings.css';

function DogRankings() {
  const [dogRanks, setDogRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://34.44.107.99/rank')
      .then(response => {
        setDogRanks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching ranking data:', error);
        setError('Error fetching ranking data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
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
          </tr>
        </thead>
        <tbody>
          {dogRanks.slice(1).map((dog, index) => (
            <tr key={index}>
              <td>{dog.breed}</td>
              <td>{dog.rank_2013}</td>
              <td>{dog.rank_2014}</td>
              <td>{dog.rank_2015}</td>
              <td>{dog.rank_2016}</td>
              <td>{dog.rank_2017}</td>
              <td>{dog.rank_2018}</td>
              <td>{dog.rank_2019}</td>
              <td>{dog.rank_2020}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DogRankings;
