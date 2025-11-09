declare global {
  interface Window {
    ethereum?: any;  // MetaMask 등 지갑 주입 속성
  }
}
