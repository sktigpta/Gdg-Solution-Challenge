import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/cards-and-containers/Card";
import "./Query.css";

const Query = () => {
  const [queries, setQueries] = useState([]); // Store queries from Firebase
  const [newQuery, setNewQuery] = useState(""); // For input field
  const API_URL = "http://localhost:5000/api/search-queries"; // Backend API URL

  // ✅ Fetch search queries from Firebase
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(API_URL);
      setQueries(response.data); // Update state with fetched queries
    } catch (error) {
      console.error("❌ Error fetching queries:", error);
    }
  };

  // ✅ Add query on "Enter" key press
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && newQuery.trim()) {
      try {
        const response = await axios.post(API_URL, { query: newQuery });
        setQueries([...queries, response.data]); // Add new query to state
        setNewQuery(""); // Clear input field
      } catch (error) {
        console.error("❌ Error adding query:", error);
      }
    }
  };

  // ✅ Delete a query from Firebase
  const deleteQuery = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setQueries(queries.filter((query) => query.id !== id)); // Remove from UI
    } catch (error) {
      console.error("❌ Error deleting query:", error);
    }
  };

  return (
    <div className="query-container">
      <Card>
        {/* 🔹 Input field (No button) */}
        <div className="query-input">
          <input
            type="text"
            className="search-box"
            placeholder="Add Query"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            onKeyDown={handleKeyDown} // ✅ Add query on "Enter"
          />
        </div>

        {/* 🔹 List of queries */}
        <div className="queries-list">
          {queries.length === 0 ? (
            <p>No queries found.</p>
          ) : (
            queries.map((query) => (
              <div className="query-item" key={query.id}>
                <div className="b-back"></div> {/* Gradient overlay */}
                {query.query}
                <button className="delete-btn" onClick={() => deleteQuery(query.id)}>X</button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Query;
