import { getUserOdds, getUserPrizes } from '$lib/utils'
import { writable } from 'svelte/store'

export const userOdds = writable<Awaited<ReturnType<typeof getUserOdds>>>()
export const userPrizes = writable<Awaited<ReturnType<typeof getUserPrizes>>>()

export const searchInput = writable<string>('')
