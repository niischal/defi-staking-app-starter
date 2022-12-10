
const  RWD =artifacts.require('RWD')
const  Tether =artifacts.require('Tether')
const  DecentralBank =artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract ('DecentralBank', ([owner,customer]) => {
    let tether, rwd, decentralBank

    tokens = (number) => web3.utils.toWei(number,'ether')

    before(async () => {
        //Load Contracts
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        //Transfer all token 
        await rwd.transfer(decentralBank.address,tokens('1000000'))

        await tether.transfer(customer,tokens('100',{from: owner}))
    })

    //All testing codes
    describe('Mock Tether Deployement', async() => {
        it('matches name successfully',async() => {
            const name= await tether.name()
            assert.equal(name, 'Mock Tether Token')
        })
    })
    describe('Reward Token ', async() => {
        it('matches name successfully',async() => {
            const name= await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployement', async() => {
        it('matches name successfully',async() => {
            const name= await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async() => {
        it('rewards token for staking', async () => {
            let result

            //Ceck investor Balsnce

            result= await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'),'customer mock wallet balance')


            //Check staking for customer
            await tether.approve(decentralBank.address,tokens('100'),{from: customer})
            await decentralBank.depositTokens(tokens('100'),{from:customer})

            //check updated balance of customer
            result= await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('0'),'customer mock wallet balance after')

            
            //check updated balance of decentral Bank
            result= await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(),tokens('100'),'decentral bank mock wallet balance')

            //is staking balance
            result=await  decentralBank.isStaking(customer)
            assert.equal(result.toString(),'true', 'customer is staking')
            
            //issue tokens
            await decentralBank.issueTokens({from:owner})

            //Only owner
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            //unstaking tokens
            await decentralBank.unstakeTokens({from:customer})

            //Check unstakin balance
            //check updated balance of customer
            result= await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'),'customer mock wallet balance after')

            
            //check updated balance of decentral Bank
            result= await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(),tokens('0'),'decentral bank mock wallet balance')

            //is staking balance
            result=await  decentralBank.isStaking(customer)
            assert.equal(result.toString(),'false', 'customer is staking')
        })
    })
})