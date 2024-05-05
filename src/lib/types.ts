export type Address = `0x${string}`

export interface ApiResponse {
  data: {
    [userAddress: Lowercase<Address>]: number
  }
  metadata: {
    lastUpdated: string
  }
}
