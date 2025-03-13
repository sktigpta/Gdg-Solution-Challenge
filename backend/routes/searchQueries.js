const express = require("express");
const { getSearchQueries, addSearchQuery, deleteSearchQuery } = require("../controllers/searchQueriesController");

const router = express.Router();

// Get all search queries
router.get("/", getSearchQueries);

// Add new search query
router.post("/", addSearchQuery);

// Delete a search query by ID
router.delete("/:id", deleteSearchQuery);

module.exports = router;
