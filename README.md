# anasa

# Anasa

Anasa is a cosmic journey app that reveals **your cosmic path** for a specific date that was significant in your life. Using [NASA's API](https://api.nasa.gov/), it showcases amazing happenings in the universe on that date — including the Astronomy Picture of the Day, Mars Rover photos, Asteroid data, and even tarot readings to add a mystical touch. Explore how the cosmos was aligned at your special moment!

---

## Features

- View NASA's Astronomy Picture of the Day for your chosen date
- Browse Mars rover photos from Curiosity, Spirit, Opportunity, or Perseverance
- Discover asteroids close to Earth on that date
- Get tarot readings inspired by cosmic events

---

## Live Demo

- FE deployment: [https://anasa-cosmos.vercel.app](https://anasa-cosmos.vercel.app)

- BE deployment: [https://anasa.vercel.app](https://anasa.vercel.app) e.g. GET https://anasa.vercel.app/api/rover?date=2025-07-06

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm

---

### Running Locally

You need to run the backend and frontend separately.

#### Backend (API)

1. Navigate to the backend folder:

```bash
cd server
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file with your NASA API key

```bash
NASA_API_KEY=DEMO_KEY
```

4. Start the server

```bash
npm start
```

Backend will run on http://localhost:5001

#### Frontend (Client)

1. Navigate to the frontend folder:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

Frontend will run on http://localhost:3000

Make sure to run the server first before running the client

### Running tests

_Backend Tests_

From the `server` folder, run:

```bash
npm test
```

_Frontend Tests_

From the `client` folder, run:

```bash
npm test
```
