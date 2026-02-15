export async function handleSubmit(event) {
  event.preventDefault();

  const location = document.getElementById('location').value.trim();
  const date = document.getElementById('date').value;
  const results = document.getElementById('results');

  if (!location || !date) {
    results.innerHTML = `<p>Please enter a destination and a date.</p>`;
    return;
  }

  try {
    results.innerHTML = `<p>Loading location info...</p>`;

    // 1) Geonames
    const geoRes = await fetch(`/geonames?location=${encodeURIComponent(location)}`);
    if (!geoRes.ok) throw new Error((await geoRes.json()).error || 'Geonames request failed');
    const place = await geoRes.json();

    results.innerHTML = `<p>Loading weather forecast...</p>`;

    // 2) Weatherbit
    const weatherRes = await fetch(
      `/weather?lat=${place.lat}&lng=${place.lng}&date=${encodeURIComponent(date)}`
    );
    if (!weatherRes.ok) throw new Error((await weatherRes.json()).error || 'Weather request failed');
    const weather = await weatherRes.json();

    results.innerHTML = `<p>Loading image...</p>`;

    // 3) Pixabay
    const imgRes = await fetch(
      `/image?city=${encodeURIComponent(place.name)}&country=${encodeURIComponent(place.country)}`
    );
    if (!imgRes.ok) throw new Error((await imgRes.json()).error || 'Image request failed');
    const img = await imgRes.json();

    // Build trip object
    const trip = {
      locationInput: location,
      date,
      place,
      weather,
      img,
      savedAt: new Date().toISOString(),
    };

    // Save trip
    saveTrip(trip);

    // Render trip
    renderTrip(trip);
  } catch (error) {
    results.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

export function renderTrip(trip, options = {}) {
  const results = document.getElementById('results');
  const daysAway = calcDaysAway(trip.date);

  const iconUrl = trip.weather?.icon
    ? `https://www.weatherbit.io/static/img/icons/${trip.weather.icon}.png`
    : null;

  const loadedMsg = options.loadedFromStorage
    ? `<p class="meta">✅ Loaded your saved trip from this device.</p>`
    : '';

  results.innerHTML = `
    ${loadedMsg}

    <h2>Trip Details</h2>
    <p><strong>Destination:</strong> ${trip.place.name}, ${trip.place.country}</p>
    <p><strong>Departure date:</strong> ${trip.date}</p>
    <p><strong>Countdown:</strong> ${daysAway} days away</p>

    <div class="results-grid">
      <div>
        <h3>Location Photo</h3>
        <img class="trip-photo" src="${trip.img.imageUrl}" alt="${trip.place.name}" />
        <p class="meta" style="margin-top:8px;">
          Photo by <strong>${trip.img.user}</strong> • Tags: ${trip.img.tags}
        </p>
      </div>

      <div>
        <h3>Forecast</h3>

        <div class="badge">
          ${iconUrl ? `<img src="${iconUrl}" alt="" width="28" height="28" />` : ''}
          <span><strong>${trip.weather.description}</strong></span>
        </div>

        <p style="margin-top:10px;"><strong>Temp:</strong> ${trip.weather.temp}°C</p>
        <p><strong>High / Low:</strong> ${trip.weather.app_max_temp}°C / ${trip.weather.app_min_temp}°C</p>

        <div class="actions">
          <button id="removeTripBtn" class="btn btn-danger" type="button">Remove saved trip</button>
        </div>
      </div>
    </div>
  `;

  const btn = document.getElementById('removeTripBtn');
  btn.addEventListener('click', () => {
    removeTrip();
    results.innerHTML = `<p>Saved trip removed. Plan a new trip above.</p>`;
  });
}


export function saveTrip(trip) {
  localStorage.setItem('savedTrip', JSON.stringify(trip));
}

export function loadTrip() {
  const raw = localStorage.getItem('savedTrip');
  return raw ? JSON.parse(raw) : null;
}

export function removeTrip() {
  localStorage.removeItem('savedTrip');
}

export function calcDaysAway(dateStr) {
  const today = new Date();
  const trip = new Date(dateStr + 'T00:00:00');
  const diffMs = trip - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
