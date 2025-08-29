-- name: CreateBoard :one
INSERT INTO boards (name, owner)
VALUES ($1, $2)
RETURNING id, name, owner;

-- name: GetBoard :one
SELECT id, name, owner
FROM boards
WHERE id = $1;

-- name: UpdateBoardName :one
UPDATE boards
SET name = $2
WHERE id = $1
RETURNING id, name, owner;

-- name: DeleteBoard :exec
DELETE FROM boards
WHERE id = $1;

-- name: ListBoardsByOwner :many
SELECT id, name, owner
FROM boards
WHERE owner = $1
ORDER BY id;
