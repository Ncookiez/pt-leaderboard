import { networks, userDataApiUrl } from '$lib/config'
import type { ApiResponse } from '$lib/types'

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

export const getUserPrizes = async () => {
  const data: { [network: number]: { current: ApiResponse; old: ApiResponse } } = {}

  await Promise.allSettled(
    networks.map((network) =>
      (async () => {
        const _current = await fetch(`${userDataApiUrl}/${network}/prizes`)
        const _old = await fetch(`${userDataApiUrl}/${network}/prizes/old`)

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

export const getMedian = (values: number[]) => {
  if (values.length === 0) return 0

  const sortedValues = [...values].sort((a, b) => a - b)

  const middleIndex = Math.floor(sortedValues.length / 2)

  return sortedValues.length % 2
    ? sortedValues[middleIndex]
    : (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
}
