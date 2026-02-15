# Travel Planner App

A full-stack travel planning application built with Webpack, Express, and multiple external APIs.

Users can enter a destination and travel date to receive:

- Location data  
- Weather forecast  
- Location image  
- Countdown to departure  
- Saved trip (persists after refresh)

---

## Features

- Geonames API for location coordinates  
- Weatherbit API for forecast data  
- Pixabay API for destination images  
- Service Worker for offline capability  
- LocalStorage to save and reload trip  
- Remove trip functionality  
- Jest unit tests (client + server)

---

## Stand-Out Feature

This project includes:

- **LocalStorage trip persistence**  
  Users can refresh the page and their last planned trip remains saved.

- **Remove Saved Trip button**  
  Users can clear the stored trip from the browser.

---

## Technologies Used

- JavaScript (ES6)  
- Webpack  
- Babel  
- Express.js  
- Workbox (Service Worker)  
- Jest + Supertest  
- SCSS  

---

## APIs Used

- Geonames  
- Weatherbit  
- Pixabay  

You will need API credentials for:

- `GEONAMES_USERNAME`
- `WEATHERBIT_KEY`
- `PIXABAY_KEY`

---

## Setup Instructions

### Clone the repository

```bash
git clone <your-repo-url>
cd travel-app-capstone

### Install dependencies

```bash
npm install
```

### Create .env file in project root

GEONAMES_USERNAME=your_username
WEATHERBIT_KEY=your_weatherbit_key
PIXABAY_KEY=your_pixabay_key


### Run Webpack Dev Server

```bash
npm run dev
```
App runs at:
http://localhost:3000


### Build Production Version

```bash
npm run build
```

### Start Express Server

```bash
npm start
```
App runs at:
http://localhost:8081

### Run Tests

``` bash
npm test
```

### Project Structure

travel-app-capstone
├── __tests__
├── src
│   ├── client
│   └── server
├── webpack.dev.js
├── webpack.prod.js
├── jest.config.js
└── package.json


## Offline Capability

### To Test Offline MOde

```bash
npm run build
```
```bash
npm start
```

http://localhost:8081

- Open DevTools → Network

- Set to "Offline"

- Refresh page
 


