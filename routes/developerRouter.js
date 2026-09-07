import { Router } from "express";
import { body, validationResult } from "express-validator";
import developerController from "../controllers/developerController.js";
import {
  getDeveloperGames,
  insertDeveloper,
  deleteDeveloper,
  editDeveloper,
} from "../db/queries.js";
import { pool } from "../db/pool.js";

const developerRouter = Router();

const validateDeveloper = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Developer name must be between 2 and 150 characters."),
];

developerRouter.get("/developers", developerController);

developerRouter.get("/developers/new", (req, res) => {
  res.render("Forms/Developer", { errors: [], formData: {}, isEditing: false });
});

developerRouter.post(
  "/developers/new",
  validateDeveloper,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("Forms/Developer", {
        errors: errors.array(),
        formData: req.body,
        isEditing: false,
      });
    }
    try {
      await insertDeveloper(req.body.name);
      res.redirect("/developers");
    } catch (err) {
      next(err);
    }
  },
);

developerRouter.get("/developers/delete/:id", async (req, res, next) => {
  try {
    await deleteDeveloper(req.params.id);
    res.redirect("/developers");
  } catch (err) {
    next(err);
  }
});

developerRouter.get("/developers/edit/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT name FROM developers WHERE id = $1",
      [id],
    );
    if (!rows.length) return res.status(404).send("Developer not found");
    res.render("Forms/Developer", {
      errors: [],
      formData: { name: rows[0].name },
      isEditing: true,
      id,
    });
  } catch (err) {
    next(err);
  }
});

developerRouter.post(
  "/developers/edit/:id",
  validateDeveloper,
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("Forms/Developer", {
        errors: errors.array(),
        formData: req.body,
        isEditing: true,
        id,
      });
    }
    try {
      await editDeveloper(id, req.body.name);
      res.redirect("/developers");
    } catch (err) {
      next(err);
    }
  },
);

developerRouter.get("/developers/:name/:id", async (req, res, next) => {
  try {
    const { name, id } = req.params;
    const games = await getDeveloperGames(id);
    res.render("developerGames/gamesByDeveloper", {
      title: `Games By ${name}`,
      games,
    });
  } catch (err) {
    next(err);
  }
});

export default developerRouter;
