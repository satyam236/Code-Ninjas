import express from "express";
import { signup, login, logout, check } from "../controllers/authController.js";

// const router = express.Router();

// router.post('/signup', signup);
// router.post('/login', login);
// router.post('/logout', logout);

// export default router;

const userrouter = express.Router();

userrouter.post("/signup", signup);
userrouter.post("/login", login);
userrouter.post("/logout", logout);
userrouter.post("/check", check);
userrouter.post("/game", check);
// userrouter.post("/aut", check);
userrouter.post("/check", check);
userrouter.post("/check", check);
// app.use('/game', gameRoutes);
// app.use('/auth', authRoutes);
// app.use('/battle', battleRoutes);
// app.use('/leaderboard', leaderboardRoutes);

export default userrouter;
