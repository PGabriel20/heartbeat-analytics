package entity

type Event struct {
	EventType       string                 `json:"event_type"`
	VisitorId       string                 `json:"visitor_id"`
	SessionId       string                 `json:"session_id"`
	Domain          string                 `json:"domain"`
	PageUrl         string                 `json:"page_url"`
	ReferrerUrl     string                 `json:"referrer_url"`
	BrowserLanguage string                 `json:"browser_language"`
	Metadata        map[string]interface{} `json:"metadata"`
	Timestamp       string                 `json:"timestamp"`
	IP              string                 `json:"ip"`
	UserAgent       string                 `json:"user_agent"`
}

func NewEvent(eventType, visitorId, sessionId, domain, pageUrl, referrerUrl, browserLanguage, timestamp, ip, userAgent string, metadata map[string]interface{}) *Event {
	return &Event{
		EventType:       eventType,
		VisitorId:       visitorId,
		SessionId:       sessionId,
		Domain:          domain,
		PageUrl:         pageUrl,
		ReferrerUrl:     referrerUrl,
		BrowserLanguage: browserLanguage,
		Metadata:        metadata,
		Timestamp:       timestamp,
		IP:              ip,
		UserAgent:       userAgent,
	}
}


//@TODO - Add validation
func (e *Event) Validate() error {
	return nil
}
