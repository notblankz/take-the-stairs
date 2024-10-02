import express from 'express'
import supabase from '../config/supabaseConfig.js'

const router = express.Router()

router.get("/srnForm", (req, res) => {
    res.render("srnForm")
})

router.post("/srnForm", async (req, res) => {
    const srn = (req.body.srn).toLowerCase()

    const {data: existingUser, error: checkError} = await supabase.from("users").select().eq("srn", srn).single();

    if (existingUser) {
        const {data: deleteUser, error: deleteError} = await supabase.from("users").delete().eq("sub", req.user.sub)
        console.log(existingUser)
        return res.redirect("/landing?error=Account%20already%20exists%2C%20login%20from%20that%20account");
    } else {
        const {data, error} = await supabase.from('users').update({
            srn: (req.body.srn).toLowerCase(),
            name: req.body.name
        }).eq('sub', req.user.sub)
    }
    return res.redirect("/")
})

export default router
