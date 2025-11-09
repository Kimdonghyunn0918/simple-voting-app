// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;
    address public owner;
    string[] public options = ["Apple", "Banana", "Cherry"];

    constructor() {
        owner = msg.sender;
    }

    function vote(string memory option) public {
        require(!hasVoted[msg.sender], "Already voted");
        bool valid = false;
        for (uint i = 0; i < options.length; i++) {
            if (keccak256(abi.encodePacked(options[i])) == keccak256(abi.encodePacked(option))) {
                valid = true;
                break;
            }
        }
        require(valid, "Invalid option");
        votes[option] += 1;
        hasVoted[msg.sender] = true;
    }

    function getVotes(string memory option) public view returns (uint256) {
        return votes[option];
    }

    function resetVotes() public {
        require(msg.sender == owner, "Only owner can reset");
        for (uint i = 0; i < options.length; i++) {
            votes[options[i]] = 0;
        }
        // hasVoted는 초기화하지 않음 (선택적)
    }
}
