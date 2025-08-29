-- name: CreateTask :one
INSERT INTO tasks (title, column_id, position)
VALUES ($1, $2, $3)
RETURNING id, title, column_id, position;

-- name: GetTasksByColumnId :many
SELECT id, title, column_id, position
FROM tasks
WHERE column_id = $1
ORDER BY position;

-- name: UpdateTask :one
UPDATE tasks
SET title = $2, position = $3
WHERE id = $1
RETURNING id, title, column_id, position;

-- name: DeleteTask :exec
DELETE FROM tasks
WHERE id = $1;
