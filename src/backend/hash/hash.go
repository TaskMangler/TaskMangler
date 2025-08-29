package hash

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"golang.org/x/crypto/argon2"
)

const (
	memory      = 64 * 1024 // 64 MB
	iterations  = 1
	parallelism = 4
)

func Hash(password string) (string, error) {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	if err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, 32)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, memory, iterations, parallelism, b64Salt, b64Hash), nil
}
