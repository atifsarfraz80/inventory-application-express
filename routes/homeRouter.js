import { Router } from "express";
const homeRouter = Router();

homeRouter.get("/", (req, res) => {
  res.render("home", { title: "Welcome to Game Info Application" });
});

export default homeRouter;
