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

// check if a user exists first, if that is the case then just send an error message and then dont do anything
// otherwise just add it to the db

export default passport.use(
    new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        }, async (accessToken, refreshToken, profile, done) => {

            const srn = profile.email.includes("@pesu.pes.edu") ? profile.email.split('@')[0] : null;

            if (srn) {
                const { data: existingUser, error: checkError } = await supabase.from("users").select("*").eq("srn", srn);
                if (existingUser) {
                    console.log("User exists, give error");
                    return done(null, false, { message: "Account already exists, login from that account" })
                }
            }

            console.log("User does not exist, adding user to db")
            const { data, error } = await supabase.from("users").upsert({
                sub: profile.sub,
                srn: profile.email.split('@')[0],
                name: profile.displayName,
                email: profile.email,
            })
            return done(null, profile);

            // const { data, error } = await supabase.from("users").upsert({
            //     sub: profile.sub,
            //     srn: profile.email.split('@')[0],
            //     name: profile.displayName,
            //     email: profile.email,
            // })
            // done(null, profile);

        }
    )
);
