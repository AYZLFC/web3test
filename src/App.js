import './App.css';
import './App.css';
import Web3 from 'web3';
import {useState, useEffect} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';

function App() {

  const [web3Api, setWeb3Api] = useState({
    provider:null,
    web3:null,
    contract:null
  })


  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)
  const [deposit, setDeposit] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  useEffect(()=>{
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Simplebank", provider)
      if(provider){
        setWeb3Api(
          {
            provider:provider,
            web3: new Web3(provider),
            contract:contract

          }
        )
      } else{
        console.log("Please install MetaMask")
      }
    }
    loadProvider()
  },[])

  useEffect(
    () =>{
      const loadBalance = async () => {
        const {contract, web3} = web3Api
        const balance = await web3.eth.getBalance(contract.address)
        setBalance(web3.utils.fromWei(balance),"ether")
      }
      web3Api.contract && loadBalance()
    },[web3Api])

    useEffect(() => {
      const getAccount = async () => {
        const accounts = await web3Api.web3.eth.getAccounts()
        setAccount(accounts[0])
      }  
      web3Api.web3 && getAccount()
    },[web3Api.web3])

    const addFunds = async () => {
      const {contract,web3} = web3Api
      await contract.addFunds({
        from:account,
        value:web3.utils.toWei(deposit,"ether")
      })
    }

    const withdraw = async () => {
      const {contract,web3} = web3Api
      const withDrawAmount = web3.utils.toWei(withdrawAmount,"ether")
      await contract.withdraw(withDrawAmount, {from:account})
    }

    function handleDeposit(e){
      setDeposit(e.target.value)
    }

    function handleWithdrawAmount(e){
      setWithdrawAmount(e.target.value)
    }

  return (
    <div className="App">
      <div>Current Balance is {balance} Ether</div>     
      <div>Check that your account is {account}</div>
      <div>
        <input onChange={handleDeposit}/>
        <button onClick={addFunds}>Add funds</button>
      </div>
      <div>
        <input onChange={handleWithdrawAmount}/>
        <button onClick={withdraw}>Withdraw funds</button>
      </div>
    </div>
  );
}

export default App;
