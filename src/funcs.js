import { ethers } from 'ethers';

import contractInterface from './contracts/Hello.json';

export const contractAddress = '0xfF0aa1203619EAb79bf1D44CD11aAc1CBD80CdA0';
export const abi = contractInterface.abi;
export const {ethereum} = window;

export const intToHex = (i) => '0x' + i.toString(16)

export const bsc = {
  chainId: intToHex(97),
  chainName: 'BNB Smart Chain Testnet',
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
  nativeCurrency: {symbol: 'tBNB', decimals: 18}
}

export const chainCheck = () => ethereum.chainId === bsc.chainId;

export const getContract = async () => {
  try {
    /** get contract from blockchain */
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  } catch (err) {
    console.log(err)
  }
}

export const addChain = async () => {
  try {
    await ethereum.request({method: 'wallet_addEthereumChain', params: [bsc]});
  } catch (addError) {
    console.log(addError)
  }
}
