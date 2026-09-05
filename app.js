import "dotenv/config";
import express from "express";
import path from "node:path";
import homeRouter from "./routes/homeRouter.js";
import genreRouter from "./routes/genreRouter.js";
import developerRouter from "./routes/developerRouter.js";
import gameRouter from "./routes/gameRouter.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.links = [
    { href: "/", text: "Home" },
    { href: "/genres", text: "All Genres" },
    { href: "/developers", text: "All Developers" },
    { href: "/games", text: "All Games" },
  ];
  next();
});

app.use("/", homeRouter);
app.use("/", genreRouter);
app.use("/", developerRouter);
app.use("/", gameRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`App running on port ${PORT}`);
});
