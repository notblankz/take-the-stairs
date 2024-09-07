import express from 'express'
import supabase from '../config/supabaseConfig.js'

const router = express.Router()

router.get("/srnForm", (req, res) => {
    res.render("srnForm")
})

router.post("/srnForm", async (req, res) => {
    const {data, error} = await supabase.from('users').update({
        srn: (req.body.srn).toLowerCase(),
        name: req.body.name
    }).eq('sub', req.user.sub)
    res.redirect("/")
})

export default router
