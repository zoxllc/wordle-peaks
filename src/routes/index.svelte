<script lang="ts">
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import Board from '$com/Board.svelte'
	import Keyboard from '$com/Keyboard.svelte'
	import Results from '$com/Results.svelte'
	import Tutorial from '$com/Tutorial.svelte'
	import Options from '$com/Options.svelte'
	import {
		getDayNumber,
		getWordByDay,
		decodeWord,
		encodeWord,
		getRandomWord,
	} from '$lib/data-model'
	import * as store from '$src/store'
	import { browser } from '$app/env'
	import { page } from '$app/stores'
	import Footer from '$com/Footer.svelte'
	import Header from '$com/Header.svelte'
	import { resetBoard } from '$lib/board'
	import { initGameState } from '$src/store'
	import { ZoxWord } from '$lib/zox-word'

	const { openScreen, gameMode } = store

	onMount(() => {
		if (!get(store.answerDaily) && !get(store.answerRandom)) {
			store.newUser.set(true)
			openScreen.set('tutorial')
		}
		startGame()
	})

	let hash = get(page).url.hash?.slice(1)
	const wordFromHash = decodeWord(hash)
	gameMode.set(wordFromHash ? 'random' : 'daily')
	initGameState()

	function startGame() {
		if (!wordFromHash) {
			playDaily()
		} else if (wordFromHash !== get(store.answerRandom)) {
			playRandom(wordFromHash)
		}
		if (get(store.gameFinished)) setTimeout(() => openScreen.set('results'), 50)
	}

	function playRandom(word?: string) {
		// const randomWord = word || getRandomWord()
		const randomWord = ZoxWord
		hash = encodeWord(randomWord)
		history.pushState(
			'',
			document.title,
			window.location.pathname + `#${hash}` + window.location.search
		)
		// window.location.hash = encodeWord(randomWord)
		resetBoard()
		store.guessesRandom.set([])
		store.answerRandom.set(randomWord)
	}

	function playDaily() {
		history.pushState('', document.title, window.location.pathname + window.location.search) // Remove # from URL
		const dayNumber = getDayNumber()
		// const dailyWord = getWordByDay(dayNumber)
		const dailyWord = ZoxWord
		if (get(store.lastPlayedDaily) === getDayNumber() && get(store.answerDaily) === dailyWord)
			return
		resetBoard()
		store.guessesDaily.set([])
		store.lastPlayedDaily.set(dayNumber)
		store.answerDaily.set(dailyWord)
	}

	let consoleMode: boolean
	if (browser)
		window.wp_start = () => {
			consoleMode = true
		}
</script>

<div>
	<div class:minimized={$openScreen !== null}>
		<section>
			<Header />
			<Board />
			<Keyboard />
			{#if consoleMode}
				{#await import('$com/Console.svelte') then c}
					<svelte:component this={c.default} />
				{/await}
			{/if}
		</section>
		<Footer />
	</div>
	{#if $openScreen === 'options'}
		<Options />
	{:else if $openScreen === 'tutorial'}
		<Tutorial />
	{:else if $openScreen === 'results'}
		<Results
			playDaily={() => {
				openScreen.set(null)
				gameMode.set('daily')
				playDaily()
			}}
			playRandom={() => {
				openScreen.set(null)
				gameMode.set('random')
				playRandom()
			}}
		/>
	{/if}
</div>

<style>
	.minimized {
		height: 0;
		overflow: clip;
	}
</style>
