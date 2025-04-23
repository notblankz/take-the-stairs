# Take The Stairs

This project was developed for a college event aimed at encouraging students to use stairs instead of the lift. To gamify the experience, this website was created that tracked users’ stair climbs and displayed a college-wide leaderboard. Users could scan QR codes placed on each floor of the building to log their stair climbs.

---

## How It Worked
- **Google OAuth Authentication**: Users could log in using their college email ID via Google OAuth.
- **QR Codes**: Each floor had a unique QR code with a 20-character string that identified the floor. Scanning the QR code from the In-Built scanner in the website recorded the user’s stair climb.
- **Step Calculation**: Users could scan the QR on their starting floor and scan another one on their final floor, the backend then calculated the total stairs climbed and added it to the user's global steps.
- **Leaderboard**: A dynamic leaderboard displayed the rankings of the students based on the total steps.

---

## Tech Stack
[![My Skills](https://skillicons.dev/icons?i=js,html,css,express,supabase,postgres,vercel)](https://skillicons.dev)

---

## Project Status
- **Active Event**: The project was successful during the event, with over `1200` users and around `4000` API hits.
- **Current Status**: The project is no longer actively maintained. The Google OAuth token, and Supabase database API keys are no longer functional. However, a backup of the database is available in the repository.

---

## License
This project is licensed under the MIT License
