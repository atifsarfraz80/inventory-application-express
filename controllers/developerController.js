import { getAllDevelopers } from "../db/queries.js";

export default async function developerController(req, res) {
  const developers = await getAllDevelopers();
  res.render("developers", { title: "All Developers", developers });
}
