import supabase from '../config/supabaseConfig.js';

export const checkUserExists = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const { data: user, error } = await supabase.from("users").select("*").eq("sub", req.user.sub).single();

        if (user && user.srn && user.name) {
            return next(); // Proceed to the next middleware/route
        } else {
            return res.redirect("/srnForm");
        }
    }
    next();
};
