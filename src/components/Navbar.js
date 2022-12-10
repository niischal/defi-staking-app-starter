import React from 'react'
import bank from '../bank.png'
import Account from './Account'

function Navbar({account,setAccount}) {
  
  return (
    <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'black', height:'50px'}}>
        <a className='navbar-brand col-sm-3 col-sm-2 mr-0' style={{color:'white'}}>
            <img src={bank} width='50' height='30' alt='logo'/>&nbsp;  
            DApp Yield Staking (Decentralized Bank) 
        </a>
        <ul className='navbar-nav px-3'>
            <li className='text-nowrap nav-item '>
              <Account account={account} setAccount={setAccount}/>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar