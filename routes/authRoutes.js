import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import pool from '../config/sessionDB.js';  // Import the pool

dotenv.config();

const router = express.Router();

function checkSRN(srn) {
    const srnRegex = /^pes[12]ug(20|21|22|23)(cs|am|ec)(00[1-9]|0[1-9][0-9]|[1-6][0-9][0-9]|700)$/i;
    return srnRegex.test(srn);
}

router.get("/login", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/redirect", passport.authenticate('google', { failureRedirect: "/" }), (req, res) => {
    if (checkSRN(req.user.email.split("@")[0])) {
        res.redirect("/");
    } else {
        res.redirect("/srnForm");
    }
});

router.get("/logout", async (req, res) => {
    try {
        const { rowCount } = await pool.query(
            "DELETE FROM user_session WHERE sid = $1",
            [req.sessionID]
        );
        console.log(`Deleted ${rowCount} session(s)`);

        req.logout((err) => {
            if (err) {
                console.error("Error logging out", err);
                return res.send("Error Logging Out");
            }

            req.session.destroy((err) => {
                if (err) {
                    console.error("Error destroying session", err);
                    return res.send("Error destroying session");
                }
                res.clearCookie("connect.sid");
                res.redirect("/landing");
            });
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).send("Unexpected error occurred");
    }
});

export default router;
