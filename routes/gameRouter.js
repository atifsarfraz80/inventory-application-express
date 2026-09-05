import { Router } from "express";
const gameRouter = Router();
import gameController from "../controllers/gameController.js";
import { insertGame } from "../db/queries.js";
import { deleteGame } from "../db/queries.js";

gameRouter.get("/games", gameController);
gameRouter.get("/games/new", (req, res) => {
  res.render("addForms/addGame", { errors: [], formData: {} });
});

gameRouter.get("/games/delete/:id", async (req, res) => {
  const id = req.params.id;
  await deleteGame(id);
  res.redirect("/games");
});

gameRouter.post("/games/new", async (req, res, next) => {
  try {
    await insertGame(req.body.title, req.body.rating, req.body.description);
    res.redirect("/games");
  } catch (err) {
    next(err);
  }
});

export default gameRouter;
