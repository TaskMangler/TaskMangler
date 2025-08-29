-- name: CreateColumn :one
INSERT INTO columns (name, board_id, position)
VALUES ($1, $2, $3)
RETURNING id, name, board_id, position;

-- name: GetColumnsByBoardId :many
SELECT id, name, board_id, position
FROM columns
WHERE board_id = $1
ORDER BY position;

-- name: UpdateColumn :one
UPDATE columns
SET name = $2, position = $3
WHERE id = $1
RETURNING id, name, board_id, position;

-- name: DeleteColumn :exec
DELETE FROM columns
WHERE id = $1;
