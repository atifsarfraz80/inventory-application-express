import { pool } from "./pool.js";

export async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY name ASC");
  return rows;
}

export async function getAllDevelopers() {
  const { rows } = await pool.query(
    "SELECT * FROM developers ORDER BY name ASC",
  );
  return rows;
}

export async function getAllGames() {
  const query = `
    SELECT 
      g.id, 
      g.title, 
      g.rating, 
      g.description,
      COALESCE(string_agg(DISTINCT gn.name, ', '), 'None') AS genres,
      COALESCE(string_agg(DISTINCT d.name, ', '), 'None') AS developers
    FROM games g
    LEFT JOIN game_genres gg ON g.id = gg.game_id
    LEFT JOIN genres gn ON gn.id = gg.genre_id
    LEFT JOIN game_developers gd ON g.id = gd.game_id
    LEFT JOIN developers d ON d.id = gd.developer_id
    GROUP BY g.id
    ORDER BY g.title ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

export async function getGameById(id) {
  const { rows } = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
  return rows[0];
}

export async function getGameGenreIds(gameId) {
  const { rows } = await pool.query(
    "SELECT genre_id FROM game_genres WHERE game_id = $1",
    [gameId],
  );
  return rows.map((r) => r.genre_id);
}

export async function getGameDeveloperIds(gameId) {
  const { rows } = await pool.query(
    "SELECT developer_id FROM game_developers WHERE game_id = $1",
    [gameId],
  );
  return rows.map((r) => r.developer_id);
}

export async function getGenreGames(id) {
  const { rows } = await pool.query(
    `SELECT DISTINCT g.id, g.title, g.rating, g.description 
     FROM games g
     JOIN game_genres gg ON g.id = gg.game_id
     WHERE gg.genre_id = $1
     ORDER BY g.title ASC`,
    [id],
  );
  return rows;
}

export async function getDeveloperGames(id) {
  const { rows } = await pool.query(
    `SELECT DISTINCT g.id, g.title, g.rating, g.description 
     FROM games g
     JOIN game_developers gd ON g.id = gd.game_id
     WHERE gd.developer_id = $1
     ORDER BY g.title ASC`,
    [id],
  );
  return rows;
}

export async function insertGame(
  title,
  rating,
  description,
  genres,
  developers,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const gameResult = await client.query(
      "INSERT INTO games (title, rating, description) VALUES ($1, $2, $3) RETURNING id",
      [title, rating, description],
    );
    const gameId = gameResult.rows[0].id;

    if (genres) {
      const genreArray = Array.isArray(genres) ? genres : [genres];
      for (const genreId of genreArray) {
        await client.query(
          "INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)",
          [gameId, genreId],
        );
      }
    }

    if (developers) {
      const devArray = Array.isArray(developers) ? developers : [developers];
      for (const devId of devArray) {
        await client.query(
          "INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)",
          [gameId, devId],
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

export async function insertDeveloper(name) {
  await pool.query("INSERT INTO developers (name) VALUES ($1)", [name]);
}

export async function insertGenre(name) {
  await pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
}

export async function deleteGame(id) {
  await pool.query("DELETE FROM games WHERE id = $1", [id]);
}

export async function deleteDeveloper(id) {
  await pool.query("DELETE FROM developers WHERE id = $1", [id]);
}

export async function deleteGenre(id) {
  await pool.query("DELETE FROM genres WHERE id = $1", [id]);
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
      "UPDATE games SET title = $1, rating = $2, description = $3 WHERE id = $4",
      [title, rating, description, id],
    );

    await client.query("DELETE FROM game_genres WHERE game_id = $1", [id]);
    await client.query("DELETE FROM game_developers WHERE game_id = $1", [id]);

    if (genres) {
      const genreArray = Array.isArray(genres) ? genres : [genres];
      for (const genreId of genreArray) {
        await client.query(
          "INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)",
          [id, genreId],
        );
      }
    }

    if (developers) {
      const devArray = Array.isArray(developers) ? developers : [developers];
      for (const devId of devArray) {
        await client.query(
          "INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)",
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
  await pool.query("UPDATE developers SET name = $1 WHERE id = $2", [name, id]);
}

export async function editGenre(id, name) {
  await pool.query("UPDATE genres SET name = $1 WHERE id = $2", [name, id]);
}
