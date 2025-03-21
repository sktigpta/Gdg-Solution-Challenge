import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/cards-and-containers/Card";
import "./Query.css";

const Query = () => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState("");
  const API_URL = "http://localhost:5000/api/search-queries"; 

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(API_URL);
      setQueries(response.data);
    } catch (error) {
      console.error("❌ Error fetching queries:", error);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && newQuery.trim()) {
      try {
        const response = await axios.post(API_URL, { query: newQuery });
        setQueries([...queries, response.data]);
        setNewQuery("");
      } catch (error) {
        console.error("❌ Error adding query:", error);
      }
    }
  };

  const deleteQuery = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setQueries(queries.filter((query) => query.id !== id));
    } catch (error) {
      console.error("❌ Error deleting query:", error);
    }
  };

  return (
    <div className="query-container">
      <Card>
        <div className="query-input">
          <input
            type="text"
            className="search-box"
            placeholder="Add Query"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="queries-list">
          {queries.length === 0 ? (
            <p>No queries found.</p>
          ) : (
            queries.map((query) => (
              <div className="query-item" key={query.id}>
                <div className="b-back"></div>
                {query.query}
                <button style={{padding:"0"}} className="delete-btn" onClick={() => deleteQuery(query.id)}>X</button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Query;
