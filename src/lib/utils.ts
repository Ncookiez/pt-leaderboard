import { networks, userDataApiUrl } from './config'
import type { ApiResponse } from './types'

export const getUserOdds = async () => {
  const data: { [network: number]: { current: ApiResponse; old: ApiResponse } } = {}

  await Promise.allSettled(
    networks.map((network) =>
      (async () => {
        const _current = await fetch(`${userDataApiUrl}/${network}`)
        const _old = await fetch(`${userDataApiUrl}/${network}/old`)

        const current: ApiResponse = await _current.json()
        const old: ApiResponse = await _old.json()

        data[network] = { current, old }
      })()
    )
  )

  return data
}

export const getTime = (date?: string) => {
  return !!date
    ? Math.floor(new Date(date).getTime() / 1000)
    : Math.floor(new Date().getTime() / 1000)
}
