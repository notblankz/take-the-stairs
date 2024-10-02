import express from "express";
import supabase from "../config/supabaseConfig.js";
import Cryptr from "cryptr";
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router();
const cryptr = new Cryptr(process.env.DECRYPT_SALT)

router.get("/saveFloor/:encryptedFloor", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect(`/`);
    } else {
        return res.redirect("/landing?error=Please%20Sign%20In%20to%20enter%20the%20challenge");
    }
});

router.post("/saveFloor/:encryptedFloor", async (req, res) => {
    if (req.isAuthenticated()) {
        const scannedFloor = cryptr.decrypt(req.params.encryptedFloor);
        const { data, error } = await supabase.from("users").select().eq('sub', req.user.sub);

        if (!data || error) {
            return res.status(500).send("Error fetching user data");
        }

        if (scannedFloor == parseInt(data[0].floorState.initial)) {
            return res.status(406).send("Floor already scanned");
        }

        if (data[0].floorState.initial == null) {
            if (!isNaN(parseInt(scannedFloor))) {
                try {
                    const { error } = await supabase.from("users").update({ floorState: { initial: scannedFloor, final: null } }).eq('sub', req.user.sub);
                    if (error) {
                        return res.status(500).send("Error updating initial floor");
                    }
                    return res.status(200).send(`Initial floor: ${scannedFloor}`);
                } catch (err) {
                    return res.status(500).send("Server error");
                }
            } else {
                return res.status(500).send("Invalid floor data");
            }
        } else {
            const initialFloor = data[0].floorState.initial;
            const climbedFloors = Math.abs(initialFloor - scannedFloor);
            const steps = parseInt(data[0].stepCount) + (climbedFloors * 75);
            const { error } = await supabase.from('users').update({ stepCount: steps, floorState: { initial: null, final: null } }).eq('sub', req.user.sub);
            if (error) {
                console.log(error)
                return res.status(500).send("Error updating steps");
            }
            return res.status(200).send(`Floors Climbed: ${climbedFloors}, Steps: ${steps}`);
        }
    } else {
        console.log("Get Authenticated first");
        return res.redirect("/landing?error=Please%20Sign%20In%20to%20enter%20the%20challenge");
    }
});

export default router;
