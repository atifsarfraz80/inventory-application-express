import { Router } from "express";
const developerRouter = Router();
import developerController from "../controllers/developerController.js";
import { getDeveloperGames } from "../db/queries.js";
import { insertDeveloper } from "../db/queries.js";
import { deleteDeveloper } from "../db/queries.js";
import { editDeveloper } from "../db/queries.js";
import { editGame } from "../db/queries.js";
import { editGenre } from "../db/queries.js";
import { pool } from "../db/pool.js";

developerRouter.get("/developers", developerController);

developerRouter.get("/developers/new", (req, res) => {
  res.render("Forms/Developer", { errors: [], formData: {}, isEditing: false });
});
developerRouter.post("/developers/new", async (req, res, next) => {
  try {
    await insertDeveloper(req.body.name);
    res.redirect("/developers");
  } catch (err) {
    next(err);
  }
});

developerRouter.get("/developers/delete/:id", async (req, res) => {
  const id = req.params.id;
  await deleteDeveloper(id);
  res.redirect("/developers");
});

developerRouter.get("/developers/edit/:id", async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT name FROM developers where id=$1`, [
    id,
  ]);
  const developerName = result.rows.length > 0 ? result.rows[0].name : "";
  res.render("Forms/Developer", {
    errors: [],
    formData: {},
    isEditing: true,
    id,
    name: developerName,
  });
});

developerRouter.post("/developers/edit/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await editDeveloper(id, req.body.name);
    res.redirect("/developers");
  } catch (err) {
    next(err);
  }
});

developerRouter.get("/developers/:name/:id", async (req, res) => {
  const name = req.params.name;
  const id = req.params.id;
  const games = await getDeveloperGames(id);
  res.render("developerGames/gamesByDeveloper", {
    title: `Games By ${name}`,
    games,
  });
});

export default developerRouter;
