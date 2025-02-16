import Plausible from 'plausible-tracker'
import { browser, dev } from '$app/env'

type EventName =
	| 'gameWon'
	| 'firstFinish'
	| 'submitGuess'
	| 'resultShare'
	| 'gameLost'
	| 'idleOnFinish'
	| 'idleBeforeFinish'
	| 'dailyFinish'

const plausible = browser
	? Plausible({
			domain: 'vegeta897.github.io/wordle-peaks',
			apiHost: 'https://plausible.pixelatomy.com',
	  })
	: { trackPageview() {}, trackEvent() {} }

export const trackPageview = () => track('pageview')
export const trackEvent = (eventName: EventName) => track(eventName)

function track(type: 'pageview' | EventName) {
	if (dev) return
	try {
		if (type === 'pageview') plausible.trackPageview()
		else plausible.trackEvent(type)
	} catch (e) {
		console.warn(`Failed to track ${type}`, e)
	}
}
