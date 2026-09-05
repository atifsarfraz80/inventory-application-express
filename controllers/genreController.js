import { getAllGenres } from "../db/queries.js";

export default async function genreController(req, res) {
  const genres = await getAllGenres();
  res.render("genres", { title: "All Genres", genres });
}
