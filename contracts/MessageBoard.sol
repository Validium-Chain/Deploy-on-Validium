// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MessageBoard {
    string private message;
    address public owner;

    event MessageUpdated(string newMessage, address updatedBy);

    constructor(string memory initialMessage) {
        owner = msg.sender;
        message = initialMessage;
    }

    // Update the stored message
    function updateMessage(string calldata newMessage) external {
        require(msg.sender == owner, "Only owner can update");
        message = newMessage;
        emit MessageUpdated(newMessage, msg.sender);
    }

    // Read the stored message
    function getMessage() external view returns (string memory) {
        return message;
    }
}
