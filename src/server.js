// server.js

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const axios = require("axios");
const { AuthorizationCode } = require("simple-oauth2");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

const app = express();

// SSL options
const sslOptions = {
  key: fs.readFileSync("ssl/server.key"),
  cert: fs.readFileSync("ssl/server.cert"),
};

// Middleware
app.use(cors());
app.use(
  session({
    secret: "your_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// OAuth2 Client
const client = new AuthorizationCode({
  client: {
    id: "dj0yJmk9dVlMdG9wWnN5amFIJmQ9WVdrOWFFSmtaVk56WVZvbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWNk", // Replace with your Client ID
    secret: "72f815ba486404b9836c095bebccae3040825ade", // Replace with your Client Secret
  },
  auth: {
    tokenHost: "https://api.login.yahoo.com",
    authorizePath: "/oauth2/request_auth",
    tokenPath: "/oauth2/get_token",
  },
});

// Redirect URI
const redirectUri = "https://localhost:5000/callback";

// Authorization endpoint
app.get("/auth", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state;

  const authorizationUri = client.authorizeURL({
    redirect_uri: redirectUri,
    scope: "fspt-r", // Adjust scopes as needed
    state: state,
  });

  res.redirect(authorizationUri);
});

// Callback endpoint
app.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (state !== req.session.oauthState) {
    return res.status(401).send("Invalid state parameter");
  }

  const options = {
    code,
    redirect_uri: redirectUri,
  };

  try {
    const accessToken = await client.getToken(options);
    // Store accessToken.token securely (e.g., in session or database)
    // For simplicity, we'll pass it back to the frontend
    res.redirect(
      `http://localhost:3000?access_token=${accessToken.token.access_token}`
    );
  } catch (error) {
    console.error("Access Token Error", error.message);
    res.status(500).json("Authentication failed");
  }
});

// API endpoint to fetch data
app.get("/api/data", async (req, res) => {
  const accessToken = req.query.access_token; // In production, retrieve this securely

  try {
    const response = await axios.get(
      "https://fantasysports.yahooapis.com/fantasy/v2/league/1311969/scoreboard",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          format: "json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("API Request Error", error.message);
    res.status(500).json("Failed to fetch data");
  }
});

// Start HTTPS server
https.createServer(sslOptions, app).listen(5000, () => {
  console.log("HTTPS Server started on https://localhost:5000");
});
