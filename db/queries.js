import { pool } from "./pool.js";

export async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

export async function getAllDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers");
  return rows;
}

export async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}

export async function getGenreGames(id) {
  const { rows } =
    await pool.query(`SELECT distinct g.title ,g.rating,g.description from games g
join game_genres gg on g.id = gg.game_id
join genres gn on gn.id=gg.genre_id
where gn.id = ${id}`);
  return rows;
}

export async function getDeveloperGames(id) {
  const { rows } =
    await pool.query(`SELECT distinct g.title ,g.rating,g.description from games g
join game_developers gd on g.id = gd.game_id
join developers d on d.id=gd.developer_id
where gd.developer_id = ${id}`);
  return rows;
}

export async function insertGame(title, rating, description) {
  await pool.query(
    "INSERT INTO games (title, rating,description) VALUES ($1, $2,$3)",
    [title, rating, description],
  );
}

export async function insertDeveloper(name) {
  await pool.query("INSERT INTO developers (name) VALUES ($1)", [name]);
}

export async function insertGenre(name) {
  await pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
}

export async function deleteGame(id) {
  await pool.query(`DELETE FROM games WHERE games.id = ${id}`);
}

export async function deleteDeveloper(id) {
  await pool.query(`DELETE FROM developers WHERE developers.id = ${id}`);
}

export async function deleteGenre(id) {
  await pool.query(`DELETE FROM genres WHERE genres.id = ${id}`);
}
