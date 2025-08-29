-- name: CreateSession :one
INSERT INTO sessions (id, username, identifier)
VALUES ($1, $2, $3)
RETURNING id, username, identifier;

-- name: GetSessionByID :one
SELECT id, username, identifier
FROM sessions
WHERE id = $1;

-- name: GetSessionsByUsername :many
SELECT id, username, identifier
FROM sessions
WHERE username = $1
ORDER BY id;

-- name: DeleteSessionByID :exec
DELETE FROM sessions
WHERE id = $1;

-- name: DeleteSessionsByUsername :exec
DELETE FROM sessions
WHERE username = $1;
