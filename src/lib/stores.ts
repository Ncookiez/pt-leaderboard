import { writable } from 'svelte/store'
import { getUserOdds } from './utils'

export const userOdds = writable<Awaited<ReturnType<typeof getUserOdds>>>()
