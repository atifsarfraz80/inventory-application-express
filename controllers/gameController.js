import { getAllGames } from "../db/queries.js";


export default async function gameController(req, res) {
  const games = await getAllGames();
  res.render("games", { title: "All Games", games });
}
