import express from "express"
import supabase from "../config/supabaseConfig.js";

const router = express.Router();

router.get("/leaderboard", async (req, res) => {

    const {data, error} = await supabase.from("users").select().limit(10).order("stepCount", {ascending : false});

    res.render("leaderboard", {data : data});
})

export default router
