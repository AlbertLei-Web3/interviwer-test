import type { Ethereum } from "@wagmi/core";

declare global {
  // 扩展 Ethereum 类型
  interface CustomEthereum extends Ethereum {
    isLedger?: boolean;
    isTrezor?: boolean;
  }

  interface Window {
    // 移除不需要的软件钱包定义
    // BinanceChain?: {
    //   bnbSign?: (
    //     address: string,
    //     message: string
    //   ) => Promise<{ publicKey: string; signature: string }>;
    //   switchNetwork?: (networkId: string) => Promise<string>;
    // } & Ethereum;
    // trustwallet?: Ethereum;
    // coin98?: boolean;

    // 只保留 ethereum 并添加硬件钱包支持
    ethereum?: CustomEthereum;
  }
}

export {};