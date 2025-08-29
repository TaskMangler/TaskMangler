-- name: CreateUser :one
INSERT INTO users (username, password_hash)
VALUES ($1, $2)
RETURNING username, password_hash;

-- name: GetUser :one
SELECT username, password_hash
FROM users
WHERE username = $1;

-- name: UpdateUserPassword :one
UPDATE users
SET password_hash = $2
WHERE username = $1
RETURNING username, password_hash;

-- name: DeleteUser :exec
DELETE FROM users
WHERE username = $1;
