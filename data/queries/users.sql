-- name: CreateUser :one
INSERT INTO users (username, password_hash, admin)
VALUES ($1, $2, $3)
RETURNING username, password_hash, admin;

-- name: GetUser :one
SELECT username, password_hash, admin
FROM users
WHERE username = $1;

-- name: UpdateUserPassword :one
UPDATE users
SET password_hash = $2
WHERE username = $1
RETURNING username, password_hash, admin;

-- name: ListUsers :many
SELECT username, password_hash, admin
FROM users
ORDER BY username;

-- name: MakeUserAdmin :one
UPDATE users
SET admin = TRUE
WHERE username = $1
RETURNING username, admin;

-- name: RevokeUserAdmin :one
UPDATE users
SET admin = FALSE
WHERE username = $1
RETURNING username, admin;

-- name: DeleteUser :exec
DELETE FROM users
WHERE username = $1;
