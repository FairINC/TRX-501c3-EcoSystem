// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Ballot {
   
    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint castVote;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    address public chairperson;
    string public question;
    mapping(address => Voter) private voters;
    Proposal[] private proposals;
    address[] private authorizedWalletList;
    mapping(address => bool) private authorizedWallets;

    constructor(string memory _question, string[] memory proposalNames, address[] memory wallets) {
        chairperson = msg.sender;
        question = _question;
        voters[chairperson].weight = 2;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: stringToBytes32(proposalNames[i]),
                voteCount: 0
            }));
        }

        for (uint j = 0; j < wallets.length; j++) {
            authorizedWallets[wallets[j]] = true;
            authorizedWalletList.push(wallets[j]);
            voters[wallets[j]].weight = 1;
        }
    }

    function getAllProposals() public view returns (string[] memory) {
        string[] memory proposalList = new string[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            proposalList[i] = bytes32ToString(proposals[i].name);
        }
        return proposalList;
    }

    function getAllAuthorizedWallets() public view returns (address[] memory) {
        return authorizedWalletList;
    }

    function delegate(address to) public {
        require(authorizedWallets[msg.sender], "Not authorized to vote.");
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];

        if (delegate_.voted) {
            proposals[delegate_.castVote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }

    function addProposal(string memory newProposal) public {
        require(authorizedWallets[msg.sender], "Not authorized to propose.");
        proposals.push(Proposal({
            name: stringToBytes32(newProposal),
            voteCount: 0
        }));
    }

    function winningProposal() public view returns (string memory) {
        uint winningVoteCount = 0;
        uint winningProposalIndex = 0;

        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposalIndex = p;
            }
        }

        return bytes32ToString(proposals[winningProposalIndex].name);
    }

    function currentVotes() public view returns (string memory result) {
        result = string(abi.encodePacked("Voting results:\n"));
        for (uint i = 0; i < proposals.length; i++) {
            result = string(abi.encodePacked(
                result, 
                bytes32ToString(proposals[i].name), ": ", 
                uintToString(proposals[i].voteCount), "\n"
            ));
        }
    }

    function castVote(uint proposalIndex) public {
        castPartialVote(proposalIndex, 1);
    }

    function castPartialVote(uint proposalIndex, uint numVotes) public {
        require(authorizedWallets[msg.sender], "Not authorized to vote.");
        Voter storage sender = voters[msg.sender];
        require(sender.weight >= numVotes, "Insufficient voting weight.");
        require(!sender.voted, "Already voted.");
        require(proposalIndex < proposals.length, "Invalid proposal index");

        sender.voted = true;
        sender.castVote = proposalIndex;
        proposals[proposalIndex].voteCount += numVotes;
        sender.weight -= numVotes;
    }

    function abstain() public {
        require(authorizedWallets[msg.sender], "Not authorized to vote.");
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "No right to vote.");
        require(!sender.voted, "Already voted.");
        
        sender.voted = true;
        sender.castVote = proposals.length;
    }

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        require(bytes(source).length <= 32, "String too long!");
        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function uintToString(uint v) internal pure returns (string memory) {
        if (v == 0) {
            return "0";
        }
        uint j = v;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        while (v != 0) {
            len -= 1;
            bstr[len] = bytes1(uint8(48 + v % 10));
            v /= 10;
        }
        return string(bstr);
    }
}
