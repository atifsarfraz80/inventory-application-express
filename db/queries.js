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

export async function insertGame(
  title,
  rating,
  description,
  genres,
  developers,
) {
  const gameResult = await pool.query(
    "INSERT INTO games (title, rating,description) VALUES ($1, $2,$3) RETURNING id",
    [title, rating, description],
  );
  const gameId = gameResult.rows[0].id;

  if (genres) {
    const genreArray = Array.isArray(genres) ? genres : [genres];
    for (let genreId of genreArray) {
      await pool.query(
        "INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)",
        [gameId, genreId],
      );
    }
  }

  if (developers) {
    const devArray = Array.isArray(developers) ? developers : [developers];
    for (let devId of devArray) {
      await pool.query(
        "INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)",
        [gameId, devId],
      );
    }
  }
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

export async function editGame(
  id,
  title,
  rating,
  description,
  genres,
  developers,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE games SET title = $1, rating = $2, description = $3 WHERE id = $4`,
      [title, rating, description, id],
    );

    await client.query(`DELETE FROM game_genres WHERE game_id = $1`, [id]);
    await client.query(`DELETE FROM game_developers WHERE game_id = $1`, [id]);

    if (genres) {
      const genreArray = Array.isArray(genres) ? genres : [genres];
      for (const genreId of genreArray) {
        await client.query(
          `INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)`,
          [id, genreId],
        );
      }
    }

    if (developers) {
      const devArray = Array.isArray(developers) ? developers : [developers];
      for (const devId of devArray) {
        await client.query(
          `INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)`,
          [id, devId],
        );
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function editDeveloper(id, name) {
  await pool.query(`UPDATE developers SET name = $1 WHERE id = $2`, [name, id]);
}

export async function editGenre(id, name) {
  await pool.query(`UPDATE genres SET name = $1 WHERE id = $2`, [name, id]);
}
