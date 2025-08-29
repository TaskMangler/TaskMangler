CREATE TABLE users (
    username        TEXT PRIMARY KEY,
    password_hash   TEXT NOT NULL
);

CREATE TABLE boards (
    id      SERIAL PRIMARY KEY,
    name    TEXT NOT NULL,
    owner   TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE columns (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    board_id    INT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    position    INT NOT NULL
);

ALTER TABLE columns ADD CONSTRAINT unique_column_position_per_board
    UNIQUE (board_id, position);

CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    column_id   INT NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    position    INT NOT NULL
);

ALTER TABLE tasks ADD CONSTRAINT unique_task_position_per_column
    UNIQUE (column_id, position);

CREATE TABLE task_dependencies (
    task_id         INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_id   INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, depends_on_id)
);
