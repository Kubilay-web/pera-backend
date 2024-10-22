const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const {
  errorResponserHandler,
  invalidPathHandler,
} = require("./middleware/errorHandler");

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postCategoriesRoutes = require("./routes/postCategoriesRoutes");
const searchRoutes = require("./routes/search");
const subscriberRoutes = require("./routes/subscriberRoutes");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(express.json());

// CORS options
const corsOptions = {
  exposedHeaders: "*",
};

app.use(cors(corsOptions));

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Route definitions
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post-categories", postCategoriesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api", subscriberRoutes); // Abone routes'u

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Invalid path and error handling
app.use(invalidPathHandler);
app.use(errorResponserHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Export app for testing (optional)
module.exports = app;
