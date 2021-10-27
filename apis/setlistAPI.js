const express = require("express");
const axios = require("axios");
const router = express.Router();

const instance = axios.create({
  baseURL: "https://api.setlist.fm/rest/1.0",
  timeout: 1000,
  headers: {
    Accept: "application/json",
    "x-api-key": process.env.SETLISTFM_API_KEY,
  },
});

router.get("/search/artist/:name", async (req, res) => {
  const params = new URLSearchParams({
    artistName: req.params["name"],
    p: "1",
    sort: "relevance",
  }).toString();

  try {
    const { data } = await instance.get(`/search/artists?${params}`);
    return res
      .status(200)
      .json({ artistId: data.artist[0].mbid, artistName: data.artist[0].name });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/artist/:id", async (req, res) => {
  const params = new URLSearchParams({
    p: "1",
  }).toString();

  try {
    const { data } = await instance.get(
      `/artist/${req.params["id"]}/setlists?${params}`
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
