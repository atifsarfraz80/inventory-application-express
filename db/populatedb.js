#! /usr/bin/env node

import { pool } from "./pool.js";

const SQL = `

INSERT INTO genres (name) VALUES
    ('Action'),
    ('RPG'),
    ('Open World'),
    ('Shooter'),
    ('Sci-Fi');

INSERT INTO developers (name) VALUES
    ('CD Projekt Red'),
    ('FromSoftware'),
    ('Bandai Namco'),
    ('Valve');

INSERT INTO games (title, description, rating) VALUES
    (
        'The Witcher 3: Wild Hunt',
        'A story-driven open world RPG set in a visually stunning fantasy universe.',
        9.8
    ),
    (
        'Cyberpunk 2077',
        'An open-world, action-adventure story set in the megalopolis of Night City.',
        8.6
    ),
    (
        'Elden Ring',
        'An action RPG fantasy game featuring a vast world designed by Hidetaka Miyazaki and George R.R. Martin.',
        9.6
    ),
    (
        'Half-Life 2',
        'A seminal first-person shooter combining action, physics puzzles, and storytelling.',
        9.7
    );

INSERT INTO game_genres (game_id, genre_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 2),
    (2, 3),
    (2, 5),
    (3, 1),
    (3, 2),
    (3, 3),
    (4, 1),
    (4, 4),
    (4, 5);

INSERT INTO game_developers (game_id, developer_id) VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (3, 3),
    (4, 4);
`;

async function main() {
  console.log("Seeding database...");
  try {
    await pool.query(SQL);
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

main();
