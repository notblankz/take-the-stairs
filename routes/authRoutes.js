import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

function checkSRN(srn) {
    const srnRegex = /^pes[12]ug(20|21|22|23)(cs|am|ec)(00[1-9]|0[1-9][0-9]|[1-6][0-9][0-9]|700)$/i;

    return srnRegex.test(srn)
}

dotenv.config();

const router = express.Router();

// router.use(passport.initialize());
// router.use(passport.session());

router.get("/login", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/redirect", passport.authenticate('google', {failureRedirect: "/"}), (req, res) => {
    if (checkSRN(req.user.email.split("@")[0])) {
        res.redirect("/");
    } else {
        res.redirect("/srnForm")
    }
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.send("Error");
        }
        req.session.destroy((err) => {
            if (err) {
                return res.send("Error");
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    });
});

export default router;
