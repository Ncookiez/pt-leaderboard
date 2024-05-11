import { getUserOdds } from '$lib/utils'
import { writable } from 'svelte/store'

export const userOdds = writable<Awaited<ReturnType<typeof getUserOdds>>>()

export const searchInput = writable<string>('')
