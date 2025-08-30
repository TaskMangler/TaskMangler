package hash

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

const (
	memory      = 64 * 1024 // 64 MB
	iterations  = 1
	parallelism = 4
)

func hash(password string, salt []byte) string {
	hash := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, 32)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, memory, iterations, parallelism, b64Salt, b64Hash)
}

func Hash(password string) (string, error) {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	if err != nil {
		return "", err
	}

	return hash(password, salt), nil
}

func ComparePasswordAndHash(password, passHash string) (bool, error) {
	parts := strings.Split(passHash, "$")
	if len(parts) != 6 {
		return false, fmt.Errorf("invalid hash format")
	}

	b64salt := parts[4]

	salt, err := base64.RawStdEncoding.DecodeString(b64salt)
	if err != nil {
		return false, err
	}

	phash := hash(password, salt)

	return subtle.ConstantTimeCompare([]byte(phash), []byte(passHash)) == 1, nil
}
