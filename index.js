import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from './controllers/authController.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import pool from './config/sessionDB.js';
import { checkUserExists } from "./middleware/checkUserExists.js";  // Test code

dotenv.config();

import authRouter from './routes/authRoutes.js';
import landingRouter from './routes/landing.js';
import srnRouter from './routes/srnForm.js';
import profileRouter from './routes/profile.js';
import eventsRouter from './routes/events.js';
import addStepsRouter from './routes/addSteps.js';
import leaderboardRouter from './routes/leaderboard.js'

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const pgSession = (await import("connect-pg-simple")).default(session);

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: "user_session"
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 48 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(cors({
    origin: "https://take-the-stairs.vercel.app",
    methods: ["POST", "GET"]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth/google', authRouter);
app.use('/api/addSteps', addStepsRouter);
app.use('/', landingRouter);
app.use('/', srnRouter);
app.use('/', profileRouter);
app.use('/', eventsRouter);
app.use('/', leaderboardRouter);

app.get('/', checkUserExists, (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index");
    } else {
        res.redirect('/landing');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running');
});
