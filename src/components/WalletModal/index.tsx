import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { useState, useEffect } from "react";
import { getWallets } from '@/configs/web3/wallets';
import { Wallet } from '@/configs/web3/types';
import LedgerSubprovider from '@ledgerhq/web3-subprovider';
import TrezorConnect from '@trezor/connect-web';

interface IWalletModal {
  isOpen?: boolean;
  onDismiss?: () => void;
}

const WalletModal: React.FC<IWalletModal> = ({
  isOpen = true,
  onDismiss = () => null,
}) => {
  const { chainId } = useWeb3React();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSmallThan480] = useMediaQuery("(max-width: 480px)", { ssr: true });
  const toast = useToast();

  useEffect(() => {
    setWallets(getWallets());
  }, []);

  //check hardware wallet connection
  const checkHardwareWalletConnection = async (walletId: string): Promise<boolean> => {
    try {
      if (walletId === 'ledger') {
        const devices = await navigator.usb?.getDevices();
        return devices && devices.length > 0;
      } else if (walletId === 'trezor') {
        try {
          await TrezorConnect.init({
            connectSrc: 'https://connect.trezor.io/9/',
            lazyLoad: true,
            manifest: {
              email: 'developer@example.com',
              appUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
            }
          });
          
          const result = await TrezorConnect.getFeatures({
            device: {
              path: '1'
            }
          });
          
          return !result.error && !!result.payload;
        } catch (err) {
          console.error('Trezor check failed:', err);
          return false;
        } finally {
          await TrezorConnect.dispose();
        }
      }
      return false;
    } catch (err) {
      console.error('Failed to check wallet connection:', err);
      return false;
    }
  };

  //connect hardware wallet
  const connectHardwareWallet = async (wallet: Wallet) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const isConnected = await checkHardwareWalletConnection(wallet.id);
      
      if (!isConnected) {
        toast({
          title: "Hardware wallet not detected",
          description: `Please make sure your ${wallet.title} is connected and unlocked.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top"
        });
        return;
      }

      if (wallet.id === 'ledger') {
        const ledger = new LedgerSubprovider({
          networkId: chainId || 1,
          accountsLength: 5
        });
        await ledger.init();
        toast({
          title: "Success",
          description: "Ledger wallet connected successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        onDismiss();
      } else if (wallet.id === 'trezor') {
        try {
          await TrezorConnect.init({
            connectSrc: 'https://connect.trezor.io/9/',
            lazyLoad: true,
            manifest: {
              email: 'developer@example.com',
              appUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
            }
          });

          const response = await TrezorConnect.ethereumGetAddress({
            path: "m/44'/60'/0'/0/0",
            showOnTrezor: true
          });

          if (response.success) {
            toast({
              title: "Success",
              description: "Trezor wallet connected successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top"
            });
            onDismiss();
          } else {
            throw new Error(response.payload.error);
          }
        } catch (err: any) {
          throw new Error(`Failed to connect Trezor: ${err.message}`);
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      setError(errorMessage);
      toast({
        title: "Connection Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onDismiss} isCentered={!isSmallThan480}>
      <ModalOverlay />
      <ModalContent className="p-4">
        <ModalHeader className="mt-2 text-center">Connect Hardware Wallet</ModalHeader>
        <ModalCloseButton onClick={onDismiss} />
        <ModalBody
          px={{
            base: 0,
            lg: 6,
          }}
        >
          {error && (
            <div className="error-message mb-4 text-red-500 text-center">
              {error}
            </div>
          )}
          
          <div className="wallet-list space-y-4">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                className="wallet-button w-full p-4 flex items-center justify-center border rounded-lg hover:bg-gray-50 relative"
                onClick={() => connectHardwareWallet(wallet)}
                disabled={isConnecting}
              >
                <span className="text-center">{wallet.title}</span>
                {isConnecting && (
                  <span className="loading-spinner absolute right-4">
                    Loading...
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Make sure your hardware wallet is:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Connected to your computer</li>
              <li>Unlocked</li>
              <li>Running the latest firmware</li>
            </ul>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
