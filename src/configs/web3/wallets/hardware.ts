import { Wallet } from '../types'

const isLedgerProvider = (ethereum: any): ethereum is CustomEthereum => {
  return ethereum && typeof ethereum.isLedger === 'boolean';
}

const isTrezorProvider = (ethereum: any): ethereum is CustomEthereum => {
  return ethereum && typeof ethereum.isTrezor === 'boolean';
}

//create hardware wallets config file

export const hardwareWallets: Wallet[] = [
  {
    id: 'ledger',
    title: 'Ledger',
    icon: '/images/wallets/ledger.svg',
    installed: typeof window !== 'undefined' && 
      window.ethereum && 
      isLedgerProvider(window.ethereum) && 
      window.ethereum.isLedger,
    downloadLink: {
      desktop: 'https://www.ledger.com/'
    }
  },
  {
    id: 'trezor',  
    title: 'Trezor',
    icon: '/images/wallets/trezor.svg', 
    installed: typeof window !== 'undefined' && 
      window.ethereum && 
      isTrezorProvider(window.ethereum) && 
      window.ethereum.isTrezor,
    downloadLink: {
      desktop: 'https://trezor.io/'
    }
  }
]  