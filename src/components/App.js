import React from 'react'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main'
const App = () => {
  const contract={
    tether: {},
    rwd: {},
    decentralBank: {},
    loading: true
  }
  const initialBalance ={

    tetherBalance: '0',
    rwdBalance: '0',
    stakingBalance: '0'
  }

  const[account,setAccount]=useState([])
  const[balances,setBalances]=useState(initialBalance) 
  const[contracts,setContracts]=useState(contract)  

  useEffect(() => {
    if(Boolean(account[0])){
      loadContracts()
      }
  },[account])

  const loadContracts = async () => {
    const web3=new Web3(window.ethereum)
    const networkId= await web3.eth.net.getId();

    //Load tether contract
    const tetherData = Tether.networks[networkId]
    if(tetherData){
      const tether = new web3.eth.Contract(Tether.abi,tetherData.address) 
      setContracts({tether: tether})
      let tetherBalance = await tether.methods.balanceOf(account).call()
      setBalances({tetherBalance: tetherBalance.toString()})
    } else {
      console.log('Error! Tether contract not deployed')
    }

    //Load RWD contract
    const rwdData = RWD.networks[networkId]
    if(rwdData){
      const rwd = new web3.eth.Contract(RWD.abi,rwdData.address) 
      setContracts({rwd: rwd})
      let rwdBalance = await rwd.methods.balanceOf(account).call()
      setBalances({rwdBalance: rwdBalance.toString()})
    } else {
      console.log('Error! RWD contract not deployed')
    }

    //Load DecentralBank contract
    const decentralBankData = DecentralBank.networks[networkId]
    if(decentralBankData){
      const decentralBank = new web3.eth.Contract(DecentralBank.abi,decentralBankData.address) 
      setContracts({decentralBank: decentralBank})
      let stakingBalance = await decentralBank.methods.stakingBalance(account).call()
      setBalances({stakingBalance: stakingBalance.toString()})
    } else {
      console.log('Error! DecentralBank contract not deployed')
    }
    setContracts({loading:false})
  }
  

  return (
    <>
        <div>
            <Navbar account={account} setAccount={setAccount}/>
            <div className='container-fluid mt-5' >
              <div className='row'>
                <main role='main' class-name='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight:'100vm'}}>
                  <div>
                    <Main/>
                  </div>
                </main>
              </div>
            </div>
        </div>
        
    </>
  )
}

export default App