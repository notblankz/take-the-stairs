// import express from "express"
// import supabase from "../config/supabaseConfig.js"

// const router = express.Router()

// router.post("/saveFloor/:floor", async (req, res) => {
//     if (req.isAuthenticated()) {
//         console.log("Request Received")
//         const scannedFloor = req.params.floor
//         const {data, error} = await supabase.from("users").select().eq('sub', req.user.sub);

//         if (scannedFloor == parseInt(data[0].floorState.initial)) {
//             console.log("Initial = Scanned")
//             res.status(406);
//         }

//         if (data[0].floorState.initial == null) {
//             console.log("Add Initial")
//             if (parseInt(scannedFloor) != NaN) {
//                 try {
//                     const {data, error} = await supabase.from("users").update({floorState: {initial: scannedFloor, final: null }}).eq('sub', req.user.sub)
//                     res.status(200);
//                 } catch (err) {
//                     res.status(404)
//                 }
//             } else {
//                 res.status(500);
//             }
//         } else {
//             console.log("Add Steps")
//             const {data, error} = await supabase.from("users").select().eq('sub', req.user.sub)
//             const initialFloor = data[0].floorState.initial
//             const climbedFloors = Math.abs(initialFloor - scannedFloor)
//             const steps = climbedFloors * 75;
//             const {updateData, err} = await supabase.from('users').update({stepCount: steps, floorState: {initial: null, final: null}}).eq('sub', req.user.sub);
//             // res.send(`Floors Climbed: ${climbedFloors}, Steps Calculated: ${steps}, DB Update: <>`)
//             res.status(200);
//         }
//     } else {
//         console.log("Get Authenticated first")
//         res.send(401)
//     }
// })

// export default router

import express from "express";
import supabase from "../config/supabaseConfig.js";

const router = express.Router();

router.post("/saveFloor/:floor", async (req, res) => {
    if (req.isAuthenticated()) {
        const scannedFloor = req.params.floor;
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
                    return res.status(200).send("Initial floor updated successfully");
                } catch (err) {
                    return res.status(500).send("Server error");
                }
            } else {
                return res.status(500).send("Invalid floor data");
            }
        } else {
            console.log("Adding Steps");
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
        return res.status(401).send("Unauthorized");
    }
});

export default router;
