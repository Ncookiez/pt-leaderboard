import { ignoredAddresses, networks, userDataApiUrls } from '$lib/config'
import type { Address, ApiResponse } from '$lib/types'

export const getUserOdds = async () => {
  const data: { [network: number]: { current: ApiResponse; old: ApiResponse } } = {}

  await Promise.allSettled(
    networks.map((network) =>
      (async () => {
        const _current = await fetch(`${userDataApiUrls[network]}/odds`)
        const _old = await fetch(`${userDataApiUrls[network]}/odds/old`)

        const current: ApiResponse = await _current.json()
        const old: ApiResponse = await _old.json()

        if (!!current.data && !!old.data) {
          data[network] = {
            current: { data: getFilteredData(current.data), metadata: current.metadata },
            old: { data: getFilteredData(old.data), metadata: old.metadata }
          }
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
        const _current = await fetch(`${userDataApiUrls[network]}/prizes`)
        const _old = await fetch(`${userDataApiUrls[network]}/prizes/old`)

        const current: ApiResponse = await _current.json()
        const old: ApiResponse = await _old.json()

        if (!!current.data && !!old.data) {
          data[network] = {
            current: { data: getFilteredData(current.data), metadata: current.metadata },
            old: { data: getFilteredData(old.data), metadata: old.metadata }
          }
        }
      })()
    )
  )

  return data
}

export const getPrizeTokenInfo = async () => {
  const data: { [network: number]: { amount: number; price: number } } = {}

  await Promise.allSettled(
    networks.map((network) =>
      (async () => {
        const apiResponse = await fetch(`https://app.cabana.fi/api/prizes/${network}`)
        const parsedApiResponse: { prizeAsset: { amount: number; price: number } } = await apiResponse.json()

        if (!!parsedApiResponse.prizeAsset.amount && !!parsedApiResponse.prizeAsset.price) {
          data[network] = parsedApiResponse.prizeAsset
        }
      })()
    )
  )

  return data
}

export const getAggregatedNetworkData = (
  data: { [network: number]: { current: ApiResponse; old: ApiResponse } },
  options?: { networkMultipliers?: { [network: number]: number } }
) => {
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

  Object.keys(data).forEach((strNetwork) => {
    const network = parseInt(strNetwork)
    const networkData = data[network]

    Object.entries(networkData.current.data).forEach(([_userAddress, userData]) => {
      const userAddress = _userAddress as Lowercase<Address>

      if (allUserData.current[userAddress] === undefined) {
        allUserData.current[userAddress] = [userData * (options?.networkMultipliers?.[network] ?? 1)]
      } else {
        allUserData.current[userAddress].push(userData * (options?.networkMultipliers?.[network] ?? 1))
      }
    })

    Object.entries(networkData.old.data).forEach(([_userAddress, userData]) => {
      const userAddress = _userAddress as Lowercase<Address>

      if (allUserData.old[userAddress] === undefined) {
        allUserData.old[userAddress] = [userData * (options?.networkMultipliers?.[network] ?? 1)]
      } else {
        allUserData.old[userAddress].push(userData * (options?.networkMultipliers?.[network] ?? 1))
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

export const calculatePointMultipliers = (info: Awaited<ReturnType<typeof getPrizeTokenInfo>>) => {
  const multipliers: { [network: number]: number } = {}

  if (!!Object.keys(info).length) {
    const sumValues = Object.values(info).reduce((a, b) => a + b.amount * b.price, 0)
    const avgValue = sumValues / Object.keys(info).length

    Object.keys(info).forEach((strNetwork) => {
      const network = parseInt(strNetwork)
      multipliers[network] = (info[network].amount * info[network].price) / avgValue
    })
  }

  return multipliers
}

export const calculatePrizeMultipliers = (info: Awaited<ReturnType<typeof getPrizeTokenInfo>>) => {
  const multipliers: { [network: number]: number } = {}

  if (!!Object.keys(info).length) {
    Object.keys(info).forEach((strNetwork) => {
      const network = parseInt(strNetwork)
      multipliers[network] = info[network].price
    })
  }

  return multipliers
}

export const calculateLuckData = (odds?: ApiResponse, prizes?: ApiResponse) => {
  if (!odds || !Object.keys(odds.data).length || !prizes || !Object.keys(prizes.data).length) {
    return undefined
  }

  const lastUpdated = new Date(Math.max(getTime(odds.metadata.lastUpdated), getTime(prizes.metadata.lastUpdated)) * 1_000).toUTCString()

  const luck: ApiResponse = { data: {}, metadata: { lastUpdated } }

  const prizesWon = Object.values(prizes.data)
  const relevantPoints = Object.values(odds.data)
    .sort((a, b) => b - a)
    .slice(0, prizesWon.length)

  const medianPoints = getMedian(relevantPoints)
  const medianPrizesWon = getMedian(prizesWon)

  Object.entries(odds.data).forEach(([_userAddress, points]) => {
    const userAddress = _userAddress as Lowercase<Address>
    const prizesWon = prizes.data[userAddress] ?? 0

    if (!!points || !!prizesWon) {
      const prizesWonRatio = prizesWon / medianPrizesWon
      const pointsRatio = points / medianPoints

      luck.data[userAddress] = (prizesWonRatio / pointsRatio) * 100
    }
  })

  return luck
}

export const getTime = (date?: string) => {
  return !!date ? Math.floor(new Date(date).getTime() / 1000) : Math.floor(new Date().getTime() / 1000)
}

const getMedian = (values: number[]) => {
  if (values.length === 0) return 0

  const sortedValues = [...values].sort((a, b) => a - b)

  const middleIndex = Math.floor(sortedValues.length / 2)

  return sortedValues.length % 2 ? sortedValues[middleIndex] : (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
}

const getFilteredData = (data: ApiResponse['data']) => {
  const filteredData: ApiResponse['data'] = {}

  Object.entries(data).forEach(([k, v]) => {
    const address = k as Lowercase<Address>
    if (!ignoredAddresses.includes(address)) filteredData[address] = v
  })

  return filteredData
}
