// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Ballot
 * @dev Implements a basic voting system with delegation.
 */
contract Ballot {

    /// @notice Struct to define a Voter
    struct Voter {
        uint weight; // Weight of vote (1 for regular voters, 2 for chairperson)
        bool voted; // If true, the voter has already cast their vote
        address delegate; // Address to which the voter delegated their vote
        uint castVote; // The proposal index they voted for
    }

    /// @notice Struct to define a Proposal
    struct Proposal {
        bytes32 name; // Name of the proposal (should be customized)
        uint voteCount; // Number of votes received
    }

    address public chairperson; // Address of the chairperson who manages voting rights

    mapping(address => Voter) public voters; // Mapping of addresses to voter details

    Proposal[] public proposals; // Array of proposals to be voted on

    /**
     * @dev Contract constructor that initializes the ballot with proposal names
     * @param proposalNames Array of proposal names (should be customized when deploying)
     */
    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender; // Assign the deployer as the chairperson
        voters[chairperson].weight = 2; // Chairperson gets double voting power

        // Initialize proposals with provided names
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    /**
     * @notice Gives the right to vote to a specific address
     * @dev Only the chairperson can grant voting rights
     * @param voter Address of the voter to be given rights
     */
    function giveRightToVote(address voter) public {
        require(msg.sender == chairperson, "Only chairperson can give right to vote.");
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0, "Voter already has the right.");
        
        voters[voter].weight = 1; // Assign a voting weight of 1
    }

    /**
     * @notice Delegate your vote to another voter
     * @param to Address of the voter to whom the vote is delegated
     */
    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        // Prevent circular delegation loops
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];

        if (delegate_.voted) {
            // If delegate already voted, add weight to their chosen proposal
            proposals[delegate_.castVote].voteCount += sender.weight;
        } else {
            // Otherwise, add weight to delegate's account
            delegate_.weight += sender.weight;
        }
    }

    /**
     * @notice Cast a vote for a proposal
     * @param proposal Index of the proposal being voted for
     */
    function castVote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote.");
        require(!sender.voted, "Already voted.");
        require(proposal < proposals.length, "Invalid proposal index.");

        sender.voted = true;
        sender.castVote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    /**
     * @notice Computes the winning proposal based on vote count
     * @return winningProposal_ Index of the winning proposal
     */
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;

        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /**
     * @notice Returns the name of the winning proposal
     * @return winnerName_ Name of the winning proposal
     */
    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
