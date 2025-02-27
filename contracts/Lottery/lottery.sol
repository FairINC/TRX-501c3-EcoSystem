// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TRXLottery {
    address public owner;
    address[] public players;
    uint256 public ticketPrice;

    constructor(uint256 _ticketPrice) {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
    }

    function enterLottery() public payable {
        require(msg.value == ticketPrice, "Incorrect TRX amount");
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, players)));
    }

    function pickWinner() public {
        require(msg.sender == owner, "Only owner can pick winner");
        require(players.length > 0, "No players in the lottery");

        uint256 index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);

        delete players; // ✅ Correctly resets the array
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
