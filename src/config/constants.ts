export const VERIFICATION_RESEND_COOLDOWN_SECONDS = 60
export const APP_NAME = 'SDMastery'
export const DEFAULT_API_BASE_URL = 'http://localhost:8000/api/v1'
export const ROADMAP_CORE_TOPICS_TOTAL = 26
export const ROADMAP_ADVANCED_TOPICS_TOTAL = 27
export const ROADMAP_TOTAL_TOPICS = ROADMAP_CORE_TOPICS_TOTAL + ROADMAP_ADVANCED_TOPICS_TOTAL
export const TOPICS_QUERY_STALE_TIME_MS = 5 * 60 * 1000
export const ANSWER_MIN_CHARS = 50
export const ANSWER_MAX_CHARS = 5000
export const ATTEMPT_STATUS_POLL_INTERVAL_MS = 2000
export const ATTEMPT_STATUS_MESSAGE_CYCLE_MS = 3000
export const ATTEMPT_STATUS_MESSAGES = [
	'Analyzing your answer...',
	'Consulting the reference material...',
	'Synthesizing evaluation...',
	'Almost there...',
]
export const CHAT_MESSAGE_MAX_CHARS = 2000
export const CHAT_COUNTER_VISIBLE_AT = 1500
export const CHAT_CONTEXT_GUARD_PHRASE = "I'm here to help you master"
