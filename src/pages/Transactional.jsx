import React, { useState } from "react";
import axios from "axios";

function Transactional() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/classify-excel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(response.data);
    } catch (err) {
      setError("Error processing file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transactional</h1>

      {/* File Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="p-2 border rounded"
        />
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-blue-500">Processing file...</p>}

      {/* Error Display */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Results */}
      {data.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Classification</th>
              <th className="border border-gray-300 p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{item.TextColumn}</td>
                <td className="border border-gray-300 p-2">{item.classification}</td>
                <td className="border border-gray-300 p-2">{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No data available. Upload an Excel file to get started.</p>
      )}
    </div>
  );
}

export default Transactional;
