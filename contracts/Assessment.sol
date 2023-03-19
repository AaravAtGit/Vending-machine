// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
contract Assessment {
    uint256 public balance;
    uint256 public donutBalance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event BuyDonut(address buyer);

    constructor(uint initBalance) payable {
        balance = initBalance;
        donutBalance = 0;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function getDonutBalance() public view returns(uint256){
        return donutBalance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public payable {

        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function buyDonuts() public payable {
        uint _previousBalance = balance;
        if (balance < 1) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: 1
            });
        }

        // decrease the balance by 1
        balance -= 1;

        // increase the donut balance by 1
        donutBalance += 1;

        // assert the balance is correct
        assert(balance == (_previousBalance - 1));

        // emit the event
        emit BuyDonut(msg.sender);
    }
}
