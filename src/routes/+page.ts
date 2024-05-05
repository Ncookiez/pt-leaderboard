import { USER_DATA_API_URL, networks } from '$lib/config'
import type { ApiResponse } from '$lib/types'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
  const data: { [network: number]: { current: ApiResponse; old: ApiResponse } } = {}

  await Promise.allSettled(
    networks.map((network) =>
      (async () => {
        const _current = await fetch(`${USER_DATA_API_URL}/${network}`)
        const _old = await fetch(`${USER_DATA_API_URL}/${network}/old`)

        const current: ApiResponse = await _current.json()
        const old: ApiResponse = await _old.json()

        data[network] = { current, old }
      })()
    )
  )

  return data
}
