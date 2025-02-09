export interface Wallet {
  id: string
  title: string
  icon: string
  installed?: boolean
  downloadLink?: {
    desktop?: string
    mobile?: string
  }
}

export interface WalletConfig {
  title: string
  icon: string
  connectorId: string
  installed?: boolean
  downloadLink?: {
    desktop?: string
    mobile?: string
  }
  priority: number
}

export enum ConnectorNames {
  Ledger = 'ledger',
  Trezor = 'trezor'
} 