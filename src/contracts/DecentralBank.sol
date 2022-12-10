pragma solidity ^0.5.0;
import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    //Staking Function
    function depositTokens(uint256 _amount) public {
        require(_amount > 0, "amount can not be less than zero");
        //Tranfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        //Update Staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //updating staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner, "not owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "stakin balance less than 0");

        //tranfer the tokens to the specifid addess from our bank
        tether.transfer(msg.sender, balance);

        //reset stakin balance
        stakingBalance[msg.sender] = 0;

        //update staking status
        isStaking[msg.sender] = false;
    }
}
