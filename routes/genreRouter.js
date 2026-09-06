import { Router } from "express";
const genreRouter = Router();
import genreController from "../controllers/genreController.js";
import { deleteGenre, getGenreGames } from "../db/queries.js";
import { insertGenre } from "../db/queries.js";

genreRouter.get("/genres", genreController);

genreRouter.get("/genres/new", (req, res) => {
  res.render("Forms/Genre", { errors: [], formData: {} });
});
genreRouter.post("/genres/new", async (req, res, next) => {
  try {
    await insertGenre(req.body.name);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
});

genreRouter.get("/genres/delete/:id", async (req, res) => {
  const id = req.params.id;
  await deleteGenre(id);
  res.redirect("/genres");
});

genreRouter.get("/genres/:name/:id", async (req, res) => {
  const name = req.params.name;
  const id = req.params.id;
  const games = await getGenreGames(id);
  res.render("genreGames/gamesByGenre", {
    title: `${name} Games`,
    games,
  });
});

export default genreRouter;
