const express = require("express");
const { searchArticles } = require("../controllers/searchController");
const router = express.Router();

// POST /api/search
router.post("/", searchArticles);

module.exports = router;
