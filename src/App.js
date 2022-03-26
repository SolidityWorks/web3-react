import { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';

import contractInterface from './contracts/Hello.json';

const contractAddress = "0xfF0aa1203619EAb79bf1D44CD11aAc1CBD80CdA0";
const abi = contractInterface.abi;

function App() {

  const [account, setAccount] = useState('Connect Wallet');
  const [buttonTxt, setButtonTxt] = useState('Donate 0.001 BNB');
  const [contract, setContract] = useState(null);
  const {ethereum} = window;

  const checkWalletIsConnected = () => {
    if (!ethereum) {
      alert('You need install MetaMask')
    }
  }

  const connectWalletHandler = async () => {
    try {
      /** get acc from metamask */
      const accounts = await ethereum.request({'method': 'eth_requestAccounts'});
      setAccount(accounts[0]);

      /** get contract from blockchain */
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const ctr = new ethers.Contract(contractAddress, abi, signer);
      setContract(ctr)
    } catch (err) {
      console.log(err)
    }
  }

  const payHandler = async () => {
    try {
      const result = await contract.topUp({value: 1000000000000000})
      setButtonTxt('Sending...')
      await result.wait()
      console.log(result)
      setButtonTxt('Thanx! 0.001 BNB Sended 👌🏼')
    } catch (err) {
      console.log(err)
    }
  }

  const connectWalletButton = (walletTxt) => {
    return (<button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>{walletTxt}</button>)
  }

  const payButton = (payTxt, hash = null) => {
    return (<button onClick={payHandler} className='cta-button contract-button'>{payTxt}</button>)
  }

  useEffect(() => {
    checkWalletIsConnected();
  })

  return (
    <div className='main-app'>
      <h1>Web3 React Template</h1>
      <div>
        {connectWalletButton(account)}
        {payButton(buttonTxt)}
      </div>
    </div>
  );
}
export default App;