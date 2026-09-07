import { Router } from "express";
import { body, validationResult } from "express-validator";
import gameController from "../controllers/gameController.js";
import {
  insertGame,
  deleteGame,
  getAllDevelopers,
  getAllGenres,
  editGame,
  getGameById,
  getGameGenreIds,
  getGameDeveloperIds,
} from "../db/queries.js";

const gameRouter = Router();

const validateGame = [
  body("title").trim().notEmpty().withMessage("Game title cannot be empty."),
  body("rating")
    .isFloat({ min: 0.0, max: 10.0 })
    .withMessage("Rating must be a valid number between 0.0 and 10.0."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),
];

gameRouter.get("/games", gameController);

gameRouter.get("/games/new", async (req, res, next) => {
  try {
    const [developers, genres] = await Promise.all([
      getAllDevelopers(),
      getAllGenres(),
    ]);
    res.render("Forms/Game", {
      errors: [],
      formData: {},
      selectedGenres: [],
      selectedDevelopers: [],
      developers,
      genres,
      isEditing: false,
    });
  } catch (err) {
    next(err);
  }
});

gameRouter.post("/games/new", validateGame, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [developers, genres] = await Promise.all([
      getAllDevelopers(),
      getAllGenres(),
    ]);
    const selectedGenres = req.body.genres
      ? Array.isArray(req.body.genres)
        ? req.body.genres.map(Number)
        : [Number(req.body.genres)]
      : [];
    const selectedDevelopers = req.body.developers
      ? Array.isArray(req.body.developers)
        ? req.body.developers.map(Number)
        : [Number(req.body.developers)]
      : [];

    return res.render("Forms/Game", {
      errors: errors.array(),
      formData: req.body,
      selectedGenres,
      selectedDevelopers,
      developers,
      genres,
      isEditing: false,
    });
  }

  try {
    await insertGame(
      req.body.title,
      req.body.rating,
      req.body.description,
      req.body.genres,
      req.body.developers,
    );
    res.redirect("/games");
  } catch (err) {
    next(err);
  }
});

gameRouter.get("/games/delete/:id", async (req, res, next) => {
  try {
    await deleteGame(req.params.id);
    res.redirect("/games");
  } catch (err) {
    next(err);
  }
});

gameRouter.get("/games/edit/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [game, developers, genres, selectedGenres, selectedDevelopers] =
      await Promise.all([
        getGameById(id),
        getAllDevelopers(),
        getAllGenres(),
        getGameGenreIds(id),
        getGameDeveloperIds(id),
      ]);

    if (!game) return res.status(404).send("Game not found");

    res.render("Forms/Game", {
      errors: [],
      formData: {
        title: game.title,
        rating: game.rating,
        description: game.description,
      },
      selectedGenres,
      selectedDevelopers,
      developers,
      genres,
      isEditing: true,
      id,
    });
  } catch (err) {
    next(err);
  }
});

gameRouter.post("/games/edit/:id", validateGame, async (req, res, next) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const [developers, genres] = await Promise.all([
      getAllDevelopers(),
      getAllGenres(),
    ]);
    const selectedGenres = req.body.genres
      ? Array.isArray(req.body.genres)
        ? req.body.genres.map(Number)
        : [Number(req.body.genres)]
      : [];
    const selectedDevelopers = req.body.developers
      ? Array.isArray(req.body.developers)
        ? req.body.developers.map(Number)
        : [Number(req.body.developers)]
      : [];

    return res.render("Forms/Game", {
      errors: errors.array(),
      formData: req.body,
      selectedGenres,
      selectedDevelopers,
      developers,
      genres,
      isEditing: true,
      id,
    });
  }

  try {
    await editGame(
      id,
      req.body.title,
      req.body.rating,
      req.body.description,
      req.body.genres,
      req.body.developers,
    );
    res.redirect("/games");
  } catch (err) {
    next(err);
  }
});

export default gameRouter;
