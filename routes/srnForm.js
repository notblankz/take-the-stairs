import express from 'express'
import supabase from '../config/supabaseConfig.js'

const router = express.Router()

router.get("/srnForm", (req, res) => {
    res.render("srnForm")
})

router.post("/srnForm", async (req, res) => {
    const srn = (req.body.srn).toLowerCase();
    const name = req.body.name;

    const { data: existingUser, error: checkError } = await supabase.from("users").select().eq("srn", srn).single();

    console.log("existing user from srnFrom: ", existingUser)

    if (existingUser) {
        return res.redirect("/landing?error=Account%20already%20exists%2C%20login%20from%20that%20account");
    } else {
        await supabase.from('users').insert({
            sub: req.user.sub,
            srn,
            name,
            email: req.user.email,
        });
        return res.redirect("/");
    }

});

export default router
