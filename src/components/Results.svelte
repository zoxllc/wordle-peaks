<script lang="ts">
	import { getDayEnd, getDayNumber } from '$lib/data-model'
	import * as store from '$src/store'
	import { get } from 'svelte/store'
	import Stats from '$com/Stats.svelte'
	import { t } from '$lib/translations'
	import Screen from '$com/Screen.svelte'
	import LastGameDetail from '$com/LastGameDetail.svelte'
	import Time from '$com/Time.svelte'
	import Tabs from '$com/Tabs.svelte'

	export let playDaily: () => {}
	export let playRandom: () => {}

	// Get store data once before mounting, we don't want it to be dynamic
	const lastAnswer = get(store.answer)
	const lastGameMode = get(store.gameMode)
	const lastGameFinished = get(store.gameFinished)
	const lastGameWon = get(store.gameWon)
	const lastGameDetail = get(store.lastGameDetail)
	const guessesDaily = get(store.guessesDaily)
	const lastPlayedDaily = get(store.lastPlayedDaily)
	const dailyFinished =
		lastPlayedDaily === getDayNumber() &&
		(guessesDaily.length === 6 || guessesDaily[guessesDaily.length - 1] === get(store.answerDaily))

	const nextDailyTime = getDayEnd(lastPlayedDaily)
	let nextWordReady = nextDailyTime < new Date()
	setInterval(() => (nextWordReady = nextDailyTime < new Date()), 1000)
</script>

<Screen title={lastGameFinished ? (lastGameWon ? `` : ``) : ''}>
	{#if lastGameFinished && !lastGameWon}
		<h3 class="answer">{@html $t('main.results.answer', { answer: lastAnswer.toUpperCase() })}</h3>
	{/if}
	{#if lastGameFinished && lastGameWon}
		<div style="text-align: center;">
			<p>
				Congratulations, you ﬁgured it out! 🎉 Click the conﬁrm button below to recieve your secret
				link to this week's ZOTD drop:
			</p>
			<a href="https://m.me/ZoxStraps?ref=w18013635">
				<button class="zox-button">CONFIRM</button>
			</a>
			<p>
				We'll send the link via Facebook Messenger at 4pm CT. Be sure to set your alarm, these are
				going to go fast!
			</p>
		</div>
	{/if}
	{#if lastGameFinished && !lastGameWon}
		<div style="text-align: center;">
			<p>
				Nice try, you almost got it! Don't worry, you can still click the confirm button below and
				we'll send you a secret link to this week's ZOTD drop:
			</p>
			<a href="https://m.me/ZoxStraps?ref=w18013643">
				<button class="zox-button">CONFIRM</button>
			</a>
			<p>
				We'll send the link via Facebook Messenger at 5pm CT. Be sure to set your alarm, these are
				going to go fast!
			</p>
		</div>
	{/if}
	<div class="tabs-container">
		{#if lastGameMode === lastGameDetail?.mode && lastAnswer === lastGameDetail?.answer}
			<Tabs tab1Title={$t('main.summary.title')} tab2Title={$t('main.stats.title')}>
				<LastGameDetail {lastGameDetail} slot="tab-1" />
				<!-- <Stats slot="tab-2" gameMode={lastGameMode} /> -->
			</Tabs>
		{:else}
			<Stats gameMode={lastGameMode} />
		{/if}
	</div>
	<div class="next-up">
		<!-- <div class="column">
			<div class="countdown">
				<Time alwaysShowHours countdown={nextDailyTime} class="time">
					<div slot="after-countdown" class="daily-text">{$t('main.results.try_today')}</div>
					<h3 slot="title">{$t('main.results.next_word')}</h3>
				</Time>
			</div>
		</div>
		<div class="column">
			{#if lastGameMode === 'random' || nextWordReady || !dailyFinished}
				<button on:click={playDaily}>{$t('main.results.play_daily')}</button>
			{/if}
			<button on:click={playRandom}>{$t('main.results.play_random')}</button>
		</div> -->
	</div>
</Screen>

<style>
	.zox-button,
	.zox-button:visited {
		background: black;
		color: white;
		border-radius: 0;
		text-transform: uppercase;
		margin: 1rem;
		padding: 1rem 2rem;
		height: auto;
		font-size: 1rem;
		border: 2px solid black;
	}
	.zox-button:hover {
		background: white;
		color: black;
		text-decoration: none;
	}
	h3 {
		font-size: 1.2em;
		margin: 0 0 0.3rem;
		width: 100%;
	}

	h3.answer {
		text-align: center;
		margin: 1.2rem 0;
	}

	a {
		font-size: 1.4rem;
		text-align: center;
		display: flex;
		flex-direction: center;
		justify-content: center;
		align-items: center;
	}

	.next-up {
		margin-top: 1.4rem;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		gap: 1rem;
		color: var(--text-color);
	}

	.column {
		width: 50%;
		display: flex;
		flex: 1 1 0;
		justify-content: space-around;
		flex-direction: column;
		align-items: stretch;
		gap: 1rem;
	}

	button {
		border: 0;
		padding: 0;
		height: 3rem;
		font-size: 1.2em;
		font-weight: 700;
		min-width: 10rem;
		background: #04883b;
	}

	button:hover {
		background: var(--correct-color);
	}

	button:focus {
		outline: 1px solid #fff;
		outline-offset: 2px;
	}

	.daily-text {
		height: 3rem;
		font-size: 1.2em;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.countdown {
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 1.2em;
	}

	.countdown :global(.time) {
		font-weight: 700;
		font-size: 1.6em;
		padding: 0 0.6rem;
	}

	.tabs-container {
		background: var(--primary-color);
		border-radius: 1rem;
		position: relative;
		margin-top: 2rem;
	}

	@media (max-width: 400px) {
		.next-up {
			flex-direction: column;
		}
		.column {
			width: 100%;
		}
		h3 {
			width: auto;
		}
		.countdown :global(.time) {
			font-size: 1.6em;
		}
	}
</style>
