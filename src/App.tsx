import { useEffect, useState } from 'react';
import './App.css';
import Form from './components/Form/Form';
import Header from './components/Header/Header';
import Transactions from './components/Transactions/Transaction';
import { MetaMaskInpageProvider } from "@metamask/providers";
import axios from 'axios';
import { ethers, providers, Wallet } from "ethers";
import { CONTRACT_ADDRESS, DEPOSIT_CONTRACT_ABI } from './const-data';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

function App() {

  const [user, setUser] = useState<any>({});
  const [transactions, setTransactions] = useState([]);


  let provider = new providers.WebSocketProvider("wss://eth-mainnet.g.alchemy.com/v2/ScK1WWZHRPgt8xtmGzmaPlCGLjX7VQPp");

  let mnemonicWallet = ethers.Wallet.createRandom();
  const signer = new Wallet(mnemonicWallet.privateKey, provider);

  const getDepositContractInstance = (contractAddress: string) => {
    let DepositContractABI = JSON.parse(DEPOSIT_CONTRACT_ABI);
    const contractInstance = new ethers.Contract(contractAddress, DepositContractABI, signer);
    return contractInstance;
  }



  async function withdrawTokens(data: any) {
    const contractInstance = getDepositContractInstance(CONTRACT_ADDRESS);
    const tx = await contractInstance.populateTransaction.withdraw(data?.amount, data.timeBet, data.nonce, data.signature);



    if (window.ethereum) {
      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: user.address,
              to: tx.to,
              data: tx.data,
              value: "0x0"
            },
          ],
        })
        .then((txHash) => {
          console.log("txHash", txHash)
        });
    }
  }

  async function depositTokens(amount: number) {

    const contractInstance = getDepositContractInstance(CONTRACT_ADDRESS);

    const tx = await contractInstance.populateTransaction.deposit();

    // if (window.ethereum) {
    //   window.ethereum
    //     .request({
    //       method: 'eth_sendTransaction',
    //       params: [
    //         {
    //           from: user.address,
    //           to: tx.to,
    //           data: tx.data,
    //           value: "0x0"
    //         },
    //       ],
    //     })
    //     .then((txHash) => {
    //       console.log("txHash", txHash)
    //     });
    // }
  }

  async function getData(address: string) {
    let resp = await axios.post('http://localhost:5000/users', { address });
    let respTrans = await axios.get('http://localhost:5000/transactions?address=' + resp.data.address)
    setUser(resp.data);
    setTransactions(respTrans.data)

  }


  const connect = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((account: any) => {
        getData(account[0])
      })
    } else {
      alert('install metamask')
    }
  }



  const handleCreate = (obj: any) => {
    try {
      let data = { ...obj };
      data.address = user.address;
      data.coin = 'eth';
      data.hash = 'hashhere'
      if (!user.address) {
        alert('not auth');
        return false;
      }
      if (obj.type === 'deposit') {
        //depositTokens(data.amount)
        axios.post('http://localhost:5000/transactions/deposit', data).catch(e => alert(e.response.data.message));
      } else {
        axios.post('http://localhost:5000/transactions/withdraw', data).then(resp => {
          withdrawTokens(resp.data);
        }).catch(e => alert(e.response.data.message));
      }
      setTimeout(() => getData(user.address), 100)
    } catch (e) {
      console.log('error request', e);

    }
  }



  return (
    <div className="App">
      <Header connect={connect} adress={user.address} balance={user.balance} />
      <div className='content'>
        <Form handleCreate={handleCreate} />
        <Transactions transactions={transactions} />
      </div>
    </div>
  );
}

export default App;
