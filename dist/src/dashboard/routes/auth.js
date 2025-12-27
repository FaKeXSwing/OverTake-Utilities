import { Router } from "express";
import axios from "axios";
import config from "../../../config.json" with { type: "json" };
const { clientIds } = config;
const router = Router();
router.get("/discord", (_, res) => {
    const params = new URLSearchParams({
        client_id: clientIds.development,
        redirect_url: process.env.REDIRECT_URI,
        response_type: "code",
        scope: "identify guilds"
    });
    res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});
router.get("/discord/callback", async (req, res) => {
    const code = req.query.code;
    const tokenRes = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
        client_id: clientIds.development,
        client_secret: process.env.DEV_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_url: process.env.REDIRECT_URI
    }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    req.session.user = userRes.data;
    req.session.accessToken = accessToken;
    res.redirect("/dashboard");
});
router.get("/logout", (req, res) => {
    // req.session.destroy(() => {
    //     res.redirect("/");
    // })
    res.redirect("/");
});
export default router;
