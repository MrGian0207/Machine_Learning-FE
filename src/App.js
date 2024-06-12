import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import file CSS

function App() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [scores, setScores] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPredictions(response.data.predictions);
      setScores(response.data.scores);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="App">
      <h1>Upload CSV and Get Predictions</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {scores && (
        <div>
          <h2>Scores</h2>
          <table className="score-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Training</th>
                <th>Validation</th>
              </tr>
            </thead>
            <tbody>
              {scores.Metric.map((metric, index) => (
                <tr key={index}>
                  <td className="metric-name">{metric}</td>
                  <td>{scores.Training[index]}</td>
                  <td>{scores.Validation[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {predictions.length > 0 && (
        <div>
          <h2>Predictions</h2>
          <table className="prediction-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Prediction</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction, index) => (
                <tr key={index}>
                  <td>{prediction.Store}</td>
                  <td>{prediction.Prediction}</td>
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