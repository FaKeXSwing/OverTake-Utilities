import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/auth.js";
// import dashboardRoutes from "./routes/dashboard.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1 * 60 * 1000
    }
}));
app.use(express.static(path.join(__dirname, "./public")));
app.use("/auth", authRoutes);
// app.use("/dashboard", dashboardRoutes)
app.get("/dashboard", (req, res) => {
    if (!req.session.user)
        return res.redirect("/auth/discord");
    const user = req.session.user;
    res.sendFile(path.join(__dirname, "./public/html/dashboard.html"));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/html/index.html"));
});
app.listen(3000, () => {
    console.log("Dashboard running on http://localhost:3000");
});
