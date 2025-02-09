import { hardwareWallets } from './hardware'
import { Wallet } from '../types'

export enum ConnectorNames {
  Ledger = 'ledger',
  Trezor = 'trezor'
}

export const wallets: Wallet[] = [...hardwareWallets]

export const getWallets = () => {
  return wallets
}
