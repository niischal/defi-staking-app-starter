import React from 'react'

import Web3 from 'web3'

function Account({account,setAccount}) {

    let isConnected = Boolean(account[0])

    const handleConnect = async () => {
        if(window.ethereum) {
            const web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
            const acc = await web3.eth.getAccounts()
            setAccount(acc[0])
        } else if (window.web3) {
        window.web3 = new Web3(window.ethereum.currentProvider)
        } else {
        console.log('No Ethereum Browser')
        }
    }

    const handleDisconnect = () => {
        setAccount([])
    }

    return (
        <div>
            {!isConnected
                ? <button onClick={handleConnect} className='btn btn-outline-primary'>Connect Wallet</button>
                : <div>
                    <small style={{color:'white'}}>ACCOUNT NUMBER: {account}</small>
                    &nsbp;
                    <button onClick={handleDisconnect} className='btn btn-outline-primary'>Disconnect</button>
                </div>
            }
        </div>
    )
    
}

export default Account