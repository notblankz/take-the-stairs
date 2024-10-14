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

            const srn = profile.email.includes("@pesu.pes.edu") ? profile.email.split('@')[0] : null;

            if (srn) {
                const { data: existingUser, error: checkError } = await supabase.from("users").select("*").eq("srn", srn);
                console.log("existing user from google: ", existingUser);

                if (existingUser.length != 0) {
                    if (existingUser[0].sub == profile.sub) {
                        return done(null, profile);
                    }
                    console.log("User exists, give error");
                    return done(null, false, { message: "Account already exists, login from that account" })
                }

                await supabase.from('users').insert({
                    sub: profile.sub,
                    srn: srn,
                    name: profile.displayName,
                    email: profile.email,
                });
            }

            done(null, {...profile, srn});

        }
    )
);
