import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import pool from '../config/sessionDB.js';
import supabase from '../config/supabaseConfig.js';

dotenv.config();

const router = express.Router();

function checkSRN(srn) {
    const srnRegex = /(^PES2UG[20|21|22|23|24]{2}(?:(CS)|(EC)|(AM))(?!000)(?=\d{3})\d{3}(?!000)$)|(PES220[20|21|22|23|24]{2}(?!00000)(?=\d{5})\d{5}(?!00000))/gmi;
    return srnRegex.test(srn);
}

router.get("/login", passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get("/redirect", passport.authenticate('google', {
    failureRedirect: "/landing?error=Account%20already%20exists%2C%20login%20from%20that%20account"
}), async (req, res) => {
    const srn = req.user.email.includes("@pesu.pes.edu") ? req.user.email.split('@')[0] : null; // Extract SRN if it's a college email

    const { data: existingUser, error: checkError } = await supabase.from("users").select("*").eq("sub", req.user.sub).single();

    if (existingUser) {
        return res.redirect("/");
    } else if (srn) {
        await supabase.from('users').insert({
            sub: req.user.sub,
            srn: srn,
            name: req.user.displayName,
            email: req.user.email,
        });
        return res.redirect("/");
    } else {
        return res.redirect("/srnForm");
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
