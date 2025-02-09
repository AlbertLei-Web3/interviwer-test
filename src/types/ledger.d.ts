declare module '@ledgerhq/web3-subprovider' {
  class LedgerSubprovider {
    constructor(options?: any)
    init(): Promise<void>
  }
  export default LedgerSubprovider
} 