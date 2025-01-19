const express = require("express");
const path = require("path");
const uploadRoutes = require("./api/upload");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", uploadRoutes);

module.exports = app;