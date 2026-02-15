const path = require('path');
const express = require('express');

require('dotenv').config();

const app = express();
app.use(express.json());

// Serve the built app (dist)
app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/geonames', async (req, res) => {
  try {
    const location = req.query.location;

    const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(location)}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`;


    const response = await fetch(url);
    const data = await response.json();

    if (!data.geonames.length) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const place = data.geonames[0];

    res.json({
      name: place.name,
      country: place.countryName,
      lat: place.lat,
      lng: place.lng
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/weather', async (req, res) => {
  try {
    const { lat, lng, date } = req.query;

    if (!lat || !lng || !date) {
      return res.status(400).json({ error: 'lat, lng, and date are required' });
    }

    // 16-day daily forecast (free tier commonly supports this)
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error || 'Weatherbit request failed' });
    }

    const day = data?.data?.find(d => d.datetime === date);

    if (!day) {
      return res.status(404).json({
        error: 'No forecast found for that exact date (may be outside 16-day range).',
      });
    }

    return res.json({
      datetime: day.datetime,
      temp: day.temp,
      app_max_temp: day.max_temp,
      app_min_temp: day.min_temp,
      description: day.weather?.description,
      icon: day.weather?.icon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/image', async (req, res) => {
  try {
    const { city, country } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'city is required' });
    }

    const key = process.env.PIXABAY_KEY;

    // helper to try a query and return first image
    const fetchPixabay = async (q) => {
      const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q)}&image_type=photo&category=places&safesearch=true&per_page=3`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) return { ok: false, data };
      return { ok: true, data };
    };

    // 1) Try city first
    let result = await fetchPixabay(city);

    if (!result.ok) {
      return res.status(500).json({ error: result.data?.error || 'Pixabay request failed' });
    }

    // If no city hits, try country (fallback)
    if (!result.data?.hits?.length && country) {
      result = await fetchPixabay(country);
    }

    const hit = result.data?.hits?.[0];

    if (!hit) {
      return res.status(404).json({ error: 'No image found for that location' });
    }

    return res.json({
      imageUrl: hit.largeImageURL || hit.webformatURL,
      pageUrl: hit.pageURL,
      tags: hit.tags,
      user: hit.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// When you refresh a route, return index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});


const port = process.env.PORT || 8081;

// Only start the server if this file is run directly (not during tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;

