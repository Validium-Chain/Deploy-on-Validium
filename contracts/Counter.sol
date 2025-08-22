// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public count = 0;

    // Events
    event Greet(string);
    event CountUpdated(uint256);

    constructor() {
        // initializes the contract with a welcome message
        emit Greet("Welcome to Validium Network!");
    }

    function increment() public {
        count += 1;
        emit CountUpdated(count);
    }

    function decrement() public {
        require(count > 0, " UNDERFLOW: CANNOT DECREASE ANYMORE!");
        count -= 1;
        emit CountUpdated(count);
    }

    function addToCount(uint256 _value) public {
        count += _value;
        emit CountUpdated(count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}