declare module '@trezor/connect-web' {
  interface TrezorConnect {
    init(config: {
      connectSrc: string
      lazyLoad: boolean
      manifest: {
        email: string
        appUrl: string
      }
    }): Promise<void>
  }
  
  const connect: TrezorConnect
  export default connect
} 