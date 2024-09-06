import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/login", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/redirect", passport.authenticate('google', {failureRedirect: "/"}), (req, res) => {
    res.redirect("/");
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
