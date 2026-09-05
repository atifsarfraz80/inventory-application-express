import { Router } from "express";
const developerRouter = Router();
import developerController from "../controllers/developerController.js";
import { getDeveloperGames } from "../db/queries.js";
import { insertDeveloper } from "../db/queries.js";
import { deleteDeveloper } from "../db/queries.js";

developerRouter.get("/developers", developerController);

developerRouter.get("/developers/new", (req, res) => {
  res.render("addForms/addDeveloper", { errors: [], formData: {} });
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
