import passport from "passport";
import supabase from "../config/supabaseConfig.js";
import dotenv from "dotenv";
import { Strategy } from "passport-google-oauth2";

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

export default passport.use(
    new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        }, async (accessToken, refreshToken, profile, done) => {

            const {data, error} = await supabase.from("users").upsert({
                sub: profile.sub,
                srn: profile.email.split('@')[0],
                name: profile.displayName,
                email: profile.email,
            })
            done(null, profile);

        }
    )
);
