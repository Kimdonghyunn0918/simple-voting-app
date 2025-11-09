import { ethers } from 'ethers';

// 컨트랙트 주소와 ABI 업데이트
const CONTRACT_ADDRESS = 'YOUR_SEPOLIA_CONTRACT_ADDRESS_HERE';
const ABI = [
  "function vote(string option)",
  "function getVotes(string option) view returns (uint256)",
  "function resetVotes()",
  "function owner() view returns (address)",
  "function hasVoted(address) view returns (bool)",
  "function options(uint256) view returns (string)"
];

let provider: ethers.BrowserProvider | undefined;
let signer: ethers.Signer | undefined;
let contract: ethers.Contract | undefined;

async function getProvider() {
  if (!provider) {
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    } else {
      throw new Error('No Ethereum wallet detected');
    }
  }
  return { provider, signer, contract };
}

export async function connectWallet(): Promise<string> {
  await getProvider();
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  return await signer!.getAddress();
}

export async function getAccountAndNetwork() {
  await getProvider();
  const account = await signer?.getAddress();
  const network = await provider?.getNetwork();
  return {
    account: account || undefined,
    chainId: Number(network?.chainId),
    chainName: network?.name || undefined,
  };
}

export async function readVotes(option: string): Promise<string> {
  await getProvider();
  const votes = await contract?.getVotes(option);
  return votes.toString();
}

export async function readOwner(): Promise<string> {
  await getProvider();
  return await contract?.owner() || '';
}

export async function hasVoted(address: string): Promise<boolean> {
  await getProvider();
  return await contract?.hasVoted(address) || false;
}

export async function getOptions(): Promise<string[]> {
  await getProvider();
  const options: string[] = [];
  for (let i = 0; ; i++) {
    try {
      const opt = await contract?.options(i);
      options.push(opt);
    } catch {
      break;
    }
  }
  return options;
}

export async function vote(option: string): Promise<string> {
  await getProvider();
  const tx = await contract?.vote(option);
  await tx.wait();
  return tx.hash;
}

export async function resetVotes(): Promise<string> {
  await getProvider();
  const tx = await contract?.resetVotes();
  await tx.wait();
  return tx.hash;
}
