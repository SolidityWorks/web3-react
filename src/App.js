import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [account, setAccount] = useState('Connect Wallet');
  const {ethereum} = window;

  const checkWalletIsConnected = () => {
    if (!ethereum) {
      alert('You need install MetaMask')
    }
  }

  const connectWalletHandler = async () => {
    try {
      const accounts = await ethereum.request({'method': 'eth_requestAccounts'});
      setAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const connectWalletButton = (txt) => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>{txt}</button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  })

  return (
    <div className='main-app'>
      <h1>Web3 React Template</h1>
      <div>
        {connectWalletButton(account)}
      </div>
    </div>
  );
}
export default App;