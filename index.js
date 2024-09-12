// import supabase from './config/supabaseConfig.js';
import express, { urlencoded } from 'express';
import passport from './controllers/authController.js';
import session from 'express-session';
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import pg from "pg"
import path from 'path';
import cors from 'cors'

dotenv.config()

// Import Routes
import authRouter from './routes/authRoutes.js';
import landingRouter from './routes/landing.js';
import srnRouter from './routes/srnForm.js'
import profileRouter from './routes/profile.js'
import eventsRouter from './routes/events.js'
import addStepsRouter from './routes/addSteps.js'

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'))

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))

// PgPool Implementation with supabase
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    // ssl: {
    //     rejectUnauthorized: (process.env.NODE_ENV === "development") ? false : true
    // }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Error connecting to db", err);
    } else {
        console.log("Successfully connected")
    }
})

const pgSession = (await import("connect-pg-simple")).default(session)

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: "user_session"
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
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
}))

app.use(passport.initialize())
app.use(passport.session());

app.use('/api/auth/google', authRouter);
app.use('/api/addSteps', addStepsRouter)
app.use('/', landingRouter);
app.use('/', srnRouter);
app.use('/', profileRouter);
app.use('/', eventsRouter)

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index")
    } else {
        res.redirect('/landing');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running');
});
