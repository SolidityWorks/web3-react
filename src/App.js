import {useEffect, useState} from 'react';
import './App.css';
import {chainAdd, bsc, chainCheck, ethereum, getContract} from "./funcs";


function App() {

  const [account, setAccount] = useState(ethereum.selectedAddress/*deprecated*/);
  const [chainId, setChainId] = useState(ethereum.chainId);
  const [buttonTxt, setButtonTxt] = useState();
  const [contract, setContract] = useState();

  ethereum.on('chainChanged', (_chainId) => setChainId(_chainId));
  ethereum.on('accountsChanged', (accounts) => setAccount(accounts));

  const walletConnectHandler = async (force = true) => {
    if (ethereum) {
      /** get acc from metamask */
      const method = force ? 'eth_requestAccounts' : 'eth_accounts'
      try {
        const accounts = await ethereum.request({'method': method});
        setAccount(accounts[0]);
        console.log(accounts[0])
        setContract(await getContract())
        return Boolean(accounts)
      } catch (e) {
        console.log(e)
      }
    }
    else {
      alert('You need install MetaMask')
    }
  }

  const setChain = async () => {
    try {
      if (!await ethereum.request({method: 'wallet_switchEthereumChain', params: [{ chainId: bsc.chainId }]})) {
        setChainId(ethereum.chainId)
      }
    } catch (switchError) {
      if (switchError.code === 4902) { // This error code indicates that the chain has not been added to MetaMask.
        await chainAdd()
      }
      console.log(switchError)
    }
  }

  const payHandler = async () => {
    if (chainCheck()) {
      try {
        const result = await contract.topUp({value: 1000000000000000})
        setButtonTxt('Sending...')
        await result.wait()
        setButtonTxt(result.hash)
      } catch (err) {
        console.log(err)
      }
    } else {
      alert('Wrong chain')
    }
  }

  const chainBtn = () => {
    const cls = 'cta-button '+(chainCheck() ? 'success' : 'error')
    return (<button onClick={chainCheck() ? null : setChain} className={cls}>ChainId: {chainId || 'None'}</button>)
  }

  const walletButtonConnect = (walletTxt) => {
    return (<button onClick={account ? null : walletConnectHandler} className='cta-button connect-wallet-button'>
      {walletTxt  || 'Connect Wallet'}
    </button>)
  }

  const payButton = (payTxt) => {
    if (payTxt && payTxt.startsWith('0x')) {
      return (<button className='cta-button contract-button'>
        Thanx! 0.001 BNB <a href={'https://testnet.bscscan.com/tx/'+payTxt} target='_blank' rel="noreferrer">Sended</a> 👌🏼
      </button>)
    }
    const cls = 'cta-button ' + (chainCheck() ? 'contract-button' : 'inactive');
    return (<button onClick={payTxt ? null : payHandler} className={cls}>
      {payTxt || 'Donate 0.001 BNB'}
    </button>)
  }

  useEffect(() => {
    async function fresh() {
      if(await walletConnectHandler(false)) {
        setChainId(ethereum.chainId)
      }
    }
    fresh()
  }, [account])

  return (
    <div className='main-app'>
      <h1>Web3 React Template</h1>
      <h5>(on BSC testnet)</h5>
      <div>
        {chainBtn()}
        {walletButtonConnect(account)}
        {payButton(buttonTxt)}
      </div>
    </div>
  );
}
export default App;