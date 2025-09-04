package auth

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/taskmangler/taskmangler/src/backend/db"
	"github.com/taskmangler/taskmangler/src/backend/hash"
)

var inc uint16

type AuthManager struct {
	database *db.Queries

	sessions   map[int]string
	sessionsMx *sync.RWMutex
}

func New(database *db.Queries) (*AuthManager, error) {
	am := &AuthManager{
		database:   database,
		sessions:   map[int]string{},
		sessionsMx: &sync.RWMutex{},
	}

	sessions, err := database.GetSessions(context.Background())
	if err != nil {
		return nil, err
	}

	for _, session := range sessions {
		am.sessions[int(session.ID)] = session.Username
	}

	return am, nil
}

func (am *AuthManager) Login(username, password, identifier string) (string, error) {
	user, err := am.database.GetUser(context.Background(), username)
	if err != nil {
		return "", err
	}

	ok, err := hash.ComparePasswordAndHash(password, user.PasswordHash)
	if err != nil {
		return "", err
	}

	if !ok {
		return "", errors.New("invalid username or password")
	}

	sessionId := time.Now().UnixMilli()<<16 | int64(inc)
	inc++

	token, err := createRefreshToken(&Session{
		Id:       sessionId,
		Username: username,
		Admin:    user.Admin,
	})
	if err != nil {
		return "", err
	}

	_, err = am.database.CreateSession(context.Background(), db.CreateSessionParams{
		ID:         int64(sessionId),
		Username:   username,
		Identifier: identifier,
	})
	if err != nil {
		return "", err
	}

	am.sessionsMx.Lock()
	am.sessions[int(sessionId)] = username
	am.sessionsMx.Unlock()

	return token, nil
}

func (am *AuthManager) GetAccessToken(session *Session) (string, error) {
	am.sessionsMx.RLock()
	_, ok := am.sessions[int(session.Id)]
	am.sessionsMx.RUnlock()
	if !ok {
		return "", errors.New("invalid session")
	}

	return createAccessToken(session)
}
