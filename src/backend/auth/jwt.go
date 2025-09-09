package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Session struct {
	Id       int64
	Username string
	Admin    bool
}

func createRefreshToken(session *Session) (string, error) {
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sid": session.Id,
		"usr": session.Username,
		"adm": session.Admin,
		"typ": "refresh",
	})

	return tok.SignedString([]byte(os.Getenv("TM_JWT_SECRET")))
}

func parseRefreshToken(token string) (*Session, error) {
	tok, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrTokenMalformed
		}
		return []byte(os.Getenv("TM_JWT_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := tok.Claims.(jwt.MapClaims); ok && tok.Valid {
		if claims["typ"] != "refresh" {
			return nil, errors.New("invalid token type")
		}

		sid := int64(claims["sid"].(float64))
		usr := claims["usr"].(string)
		admin := claims["adm"].(bool)
		return &Session{
			Id:       sid,
			Username: usr,
			Admin:    admin,
		}, nil
	}

	return nil, jwt.ErrTokenMalformed
}

func createAccessToken(session *Session) (string, error) {
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sid": session.Id,
		"usr": session.Username,
		"adm": session.Admin,
		"exp": time.Now().Add(15 * time.Minute).Unix(),
		"typ": "access",
	})

	signed, err := tok.SignedString([]byte(os.Getenv("TM_JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return signed, nil
}

func parseAccessToken(token string) (*Session, error) {
	tok, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrTokenMalformed
		}
		return []byte(os.Getenv("TM_JWT_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := tok.Claims.(jwt.MapClaims); ok && tok.Valid {
		if claims["typ"] != "access" {
			return nil, errors.New("invalid token type")
		}

		sid := int64(claims["sid"].(float64))
		usr := claims["usr"].(string)
		admin := claims["adm"].(bool)
		return &Session{
			Id:       sid,
			Username: usr,
			Admin:    admin,
		}, nil
	}

	return nil, jwt.ErrTokenMalformed
}
