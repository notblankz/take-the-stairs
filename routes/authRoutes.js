import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import supabase from '../config/supabaseConfig.js';

function checkSRN(srn) {
    const srnRegex = /^pes[12]ug(20|21|22|23)(cs|am|ec)(00[1-9]|0[1-9][0-9]|[1-6][0-9][0-9]|700)$/i;

    return srnRegex.test(srn)
}

dotenv.config();

const router = express.Router();

router.get("/login", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/redirect", passport.authenticate('google', {failureRedirect: "/"}), (req, res) => {
    if (checkSRN(req.user.email.split("@")[0])) {
        res.redirect("/");
    } else {
        res.redirect("/srnForm")
    }
});

router.get("/logout", async (req, res) => {
    try {
        const {data, error} = await supabase.from('users').delete().eq('sub', req.user.sub);
        if (error) {
            console.error("Error deleting user: ", error)
            return res.status(500).send("Some unexpected error occured")
        }

        req.logout((err) => {
            if (err) {
                console.log(err);
                return res.send("Error Logging Out")
            }
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error destroying Session:", err)
                    return res.send("Error destroying Session");
                }
                res.clearCookie("connect.sid");
                res.redirect("/landing")
            })
        })
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).send("Unexpected error occurred");
    }
});

export default router;
