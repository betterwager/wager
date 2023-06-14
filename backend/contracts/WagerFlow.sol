pragma solidity ^0.8.0;

contract Wager {
    enum WagerState {
        Betting,
        Voting,
        Closed
    }

    struct WagerData {
        address creator;
        string name;
        WagerState state;
        uint256 minBet;
        uint256 maxBet;
        uint256 minPlayers;
        uint256 maxPlayers;
        string[] outcomes;
        uint256 bettingEndTime;
        mapping(address => Bet) bets;
        mapping(address => Vote) votes;
        address[] participants;
    }
    //Wager Identifier = Hash of Creator Address & Wager Name

    struct Vote {
        address creator;
        string option;
        bool hasVoted;
    }

    struct Bet {
        address creator;
        string option;
        uint256 betAmount;
    }

    WagerData public wagerData;

    event ParticipantJoined(address indexed wagerCreator, address participant);

    event BetPlaced(
        address indexed wagerCreator,
        address participant,
        uint256 amount
    );

    event VotesCompleted(
        address indexed wagerCreator,
        string Name,
        bool outcome
    );

    event WagerClosed(address indexed wagerCreator, uint256 winnersCount);

    //Event for Moving to Voting & Moving to Closed Stage

    constructor(
        address _creator,
        uint256 _minBet,
        uint256 _maxBet,
        uint256 _minPlayers,
        uint256 _maxPlayers,
        string memory _name,
        string[] memory _outcomes,
        uint256 _votingEndTime
    ) {
        wagerData.creator = _creator;
        wagerData.minBet = _minBet;
        wagerData.maxBet = _maxBet;
        wagerData.minPlayers = _minPlayers;
        wagerData.maxPlayers = _maxPlayers;
        wagerData.name = _name;
        wagerData.outcomes = _outcomes;
        wagerData.votingEndTime = _votingEndTime;
        wagerData.state = WagerState.Betting;
    }

    modifier onlyCreator() {
        require(
            msg.sender == wagerData.creator,
            "Only the wager creator can call this function"
        );
        _;
    }

    modifier onlyBettingPhase() {
        require(
            wagerData.state == WagerState.Betting,
            "Function can only be called during the betting phase"
        );
        _;
    }

    modifier onlyVotingPhase() {
        require(
            wagerData.state == WagerState.Voting,
            "Function can only be called during the voting phase"
        );
        _;
    }

    modifier onlyClosedPhase() {
        require(
            wagerData.state == WagerState.Closed,
            "Function can only be called during the closed phase"
        );
        _;
    }

    function getTotalPool() internal view returns (int) {
        int total = 0;
        for (int i = 0; i < wagerData.participants.length; i++) {
            total += bets[i].betAmount;
        }
        return total;
    }

    function joinWager() external {
        require(
            wagerData.state == WagerState.Betting,
            "Cannot join wager, not in the betting phase"
        );

        wagerData.participants.push(msg.sender);

        emit ParticipantJoined(wagerData.creator, msg.sender);
    }

    function placeBet() external payable onlyBettingPhase {
        require(
            isParticipant(msg.sender),
            "Participant has not joined the wager"
        );
        require(
            msg.value >= wagerData.minBet && msg.value <= wagerData.maxBet,
            "Invalid bet amount"
        );

        wagerData.bets[msg.sender].betAmount = msg.value;

        emit BetPlaced(wagerData.creator, msg.sender, msg.value);
    }

    function vote(bool _outcome) external onlyVotingPhase {
        require(
            wagerData.bets[msg.sender].betAmount > 0,
            "Participant has not placed a bet"
        );
        require(
            !wagerData.hasVoted[msg.sender],
            "Participant has already voted"
        );

        wagerData.votes[msg.sender].hasVoted = true;
        wagerData.votes[msg.sender].option = _outcome;

        if (wagerData.votes.length == wagerData.participants.length) {
            emit VoteCasted(wagerData.creator, msg.sender, _outcome);
        }
    }

    function closeWager() external onlyClosedPhase onlyCreator {
        require(
            wagerData.state != WagerState.Closed,
            "Wager is already closed"
        );

        wagerData.state = WagerState.Closed;

        uint256 winnersCount = wagerData.voteCounts[true] >=
            wagerData.voteCounts[false]
            ? wagerData.voteCounts[true]
            : wagerData.voteCounts[false];

        emit WagerClosed(wagerData.creator, winnersCount);
    }

    function isParticipant(address _participant) public view returns (bool) {
        for (uint256 i = 0; i < wagerData.participants.length; i++) {
            if (wagerData.participants[i] == _participant) {
                return true;
            }
        }
        return false;
    }
}

contract WagerFactory {
    mapping(address => Wager[]) public wagers;

    event WagerCreated(
        address indexed creator,
        address wagerAddress,
        string name,
        uint256 minBet,
        uint256 maxBet,
        uint256 minPlayers,
        uint256 maxPlayers,
        string[] outcomes,
        uint256 votingEndTime
    );

    function createWager(
        uint256 _minBet,
        uint256 _maxBet,
        uint256 _minPlayers,
        uint256 _maxPlayers,
        string memory _name,
        string[] memory _outcomes,
        uint256 _votingEndTime
    ) external {
        Wager newWager = new Wager(
            msg.sender,
            _minBet,
            _maxBet,
            _minPlayers,
            _maxPlayers,
            _name,
            _outcomes,
            _votingEndTime
        );

        wagers[msg.sender].push(newWager);

        emit WagerCreated(
            msg.sender,
            address(newWager),
            _name,
            _minBet,
            _maxBet,
            _minPlayers,
            _maxPlayers,
            _outcomes,
            _votingEndTime
        );
    }
}
