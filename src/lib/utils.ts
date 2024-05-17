import { networks, userDataApiUrl } from '$lib/config'
import type { Address, ApiResponse } from '$lib/types'

export const getUserOdds = async () => {
  const data: { [network: number]: { current: ApiResponse; old: ApiResponse } } = {}

  await Promise.allSettled(
    networks.map((network) =>
      (async () => {
        const _current = await fetch(`${userDataApiUrl}/${network}`)
        const _old = await fetch(`${userDataApiUrl}/${network}/old`)

        const current: ApiResponse = await _current.json()
        const old: ApiResponse = await _old.json()

        if (!!current.data && !!old.data) {
          data[network] = { current, old }
        }
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

        if (!!current.data && !!old.data) {
          data[network] = { current, old }
        }
      })()
    )
  )

  return data
}

export const getAggregatedNetworkData = (data: {
  [network: number]: { current: ApiResponse; old: ApiResponse }
}) => {
  if (!data || Object.keys(data).length === 0) return undefined

  const currentLastUpdated = Object.values(data).reduce((a, b) =>
    getTime(b.current.metadata.lastUpdated) > getTime(a.current.metadata.lastUpdated) ? b : a
  ).current.metadata.lastUpdated
  const oldLastUpdated = Object.values(data).reduce((a, b) =>
    getTime(b.old.metadata.lastUpdated) > getTime(a.old.metadata.lastUpdated) ? b : a
  ).old.metadata.lastUpdated

  const aggregatedNetworkData: { current: ApiResponse; old: ApiResponse } = {
    current: { data: {}, metadata: { lastUpdated: currentLastUpdated } },
    old: { data: {}, metadata: { lastUpdated: oldLastUpdated } }
  }

  const allUserData: {
    current: { [userAddress: Lowercase<Address>]: number[] }
    old: { [userAddress: Lowercase<Address>]: number[] }
  } = { current: {}, old: {} }

  Object.values(data).forEach((networkData) => {
    Object.entries(networkData.current.data).forEach(([_userAddress, userData]) => {
      const userAddress = _userAddress as Lowercase<Address>

      if (allUserData.current[userAddress] === undefined) {
        allUserData.current[userAddress] = [userData]
      } else {
        allUserData.current[userAddress].push(userData)
      }
    })

    Object.entries(networkData.old.data).forEach(([_userAddress, userData]) => {
      const userAddress = _userAddress as Lowercase<Address>

      if (allUserData.old[userAddress] === undefined) {
        allUserData.old[userAddress] = [userData]
      } else {
        allUserData.old[userAddress].push(userData)
      }
    })
  })

  Object.entries(allUserData.current).forEach(([_userAddress, userDataArray]) => {
    const userAddress = _userAddress as Lowercase<Address>
    const userData = userDataArray.reduce((a, b) => a + b, 0)

    aggregatedNetworkData.current.data[userAddress] = userData
  })

  Object.entries(allUserData.old).forEach(([_userAddress, userDataArray]) => {
    const userAddress = _userAddress as Lowercase<Address>
    const userData = userDataArray.reduce((a, b) => a + b, 0)

    aggregatedNetworkData.old.data[userAddress] = userData
  })

  return aggregatedNetworkData
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
