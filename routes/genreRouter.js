import { Router } from "express";
import { body, validationResult } from "express-validator";
import genreController from "../controllers/genreController.js";
import {
  deleteGenre,
  editGenre,
  getGenreGames,
  insertGenre,
} from "../db/queries.js";
import { pool } from "../db/pool.js";

const genreRouter = Router();

const validateGenre = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Genre name must be between 2 and 100 characters."),
];

genreRouter.get("/genres", genreController);

genreRouter.get("/genres/new", (req, res) => {
  res.render("Forms/Genre", { errors: [], formData: {}, isEditing: false });
});

genreRouter.post("/genres/new", validateGenre, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("Forms/Genre", {
      errors: errors.array(),
      formData: req.body,
      isEditing: false,
    });
  }
  try {
    await insertGenre(req.body.name);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
});

genreRouter.get("/genres/delete/:id", async (req, res, next) => {
  try {
    await deleteGenre(req.params.id);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
});

genreRouter.get("/genres/edit/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT name FROM genres WHERE id = $1", [
      id,
    ]);
    if (!rows.length) return res.status(404).send("Genre not found");
    res.render("Forms/Genre", {
      errors: [],
      formData: { name: rows[0].name },
      isEditing: true,
      id,
    });
  } catch (err) {
    next(err);
  }
});

genreRouter.post("/genres/edit/:id", validateGenre, async (req, res, next) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("Forms/Genre", {
      errors: errors.array(),
      formData: req.body,
      isEditing: true,
      id,
    });
  }
  try {
    await editGenre(id, req.body.name);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
});

genreRouter.get("/genres/:name/:id", async (req, res, next) => {
  try {
    const { name, id } = req.params;
    const games = await getGenreGames(id);
    res.render("genreGames/gamesByGenre", {
      title: `${name} Games`,
      games,
    });
  } catch (err) {
    next(err);
  }
});

export default genreRouter;
