import express from 'express'
import supabase from "../config/supabaseConfig.js"

const router = express.Router()

router.get("/profile", async (req, res) => {
    if (req.isAuthenticated()) {
        const {data, user} = await supabase.from('users').select().eq('sub', req.user.sub)
        res.render("profile", {name : data[0].name, srn: data[0].srn.toUpperCase(), email: req.user.email, steps: data[0].stepCount})
    } else {
        res.redirect("/landing")
    }
})

router.post("/profile", (req, res) => {
    res.redirect("/api/auth/google/logout")
})

export default router
