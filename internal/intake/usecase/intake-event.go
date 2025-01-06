package usecase

import (
	"encoding/json"
	"log"

	"github.com/PGabriel20/heartbeat-analytics/internal/common/broker"
	"github.com/PGabriel20/heartbeat-analytics/internal/common/entity"
)

type IntakeEventInputDto struct {
	EventType      string                 `json:"event_type"`
	VisitorId      string                 `json:"visitor_id"`
	SessionId      string                 `json:"session_id"`
	Domain         string                 `json:"domain"`
	PageUrl        string                 `json:"page_url"`
	ReferrerUrl    string                 `json:"referrer_url"`
	BrowserLanguage string                `json:"browser_language"`
	Timestamp       string                `json:"timestamp"`
	Metadata       map[string]interface{} `json:"metadata"`
	IP             string                 `json:"ip"`
	UserAgent      string                 `json:"user_agent"`
}

type IntakeEventUseCase struct {
	Publisher broker.Publisher
}

func NewIntakeEventUseCase(publisher broker.Publisher) *IntakeEventUseCase {
	return &IntakeEventUseCase{
		Publisher: publisher,
	}
}

func (u *IntakeEventUseCase) Execute(input IntakeEventInputDto) error {
	event := entity.NewEvent(
		input.EventType,
		input.VisitorId,
		input.SessionId,
		input.Domain,
		input.PageUrl,
		input.ReferrerUrl,
		input.BrowserLanguage,
		input.Timestamp,
		input.IP,
		input.UserAgent,
		input.Metadata,
	)

	body, err := json.Marshal(event)
	if err != nil {
		return err
	}

	err = u.Publisher.Publish("events-exchange", "events.intake", body)
	if err != nil {
		return err
	}

	log.Printf("Event sent: %s", body)

	return nil
}