// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

IERC20 public usdcToken;
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
        Vote[] votes;
        address[] participants;
    }
    //Wager Identifier = Hash of Creator Address & Wager Name

    struct Vote {
        address creator;
        string option;
    }

    struct Bet {
        address creator;
        string option;
        uint256 betAmount;
    }

    WagerData public wagerData;

    //Events
    event ParticipantJoined(address indexed wagerCreator, address participant);

    event BetPlaced(
        uint indexed wagerHash,
        address participant,
        uint256 amount
    );

    event VotesCompleted(uint indexed wagerHash, string Name, string outcome);

    event WagerClosed(address indexed wagerCreator, string _outcome);

    //Event for Moving to Voting & Moving to Closed Stage

    constructor(
        address _creator,
        uint256 _minBet,
        uint256 _maxBet,
        uint256 _minPlayers,
        uint256 _maxPlayers,
        string memory _name,
        string[] memory _outcomes,
        uint256 _bettingEndTime
				address _usdcToken
    ) {
        wagerData.creator = _creator;
        wagerData.minBet = _minBet;
        wagerData.maxBet = _maxBet;
        wagerData.minPlayers = _minPlayers;
        wagerData.maxPlayers = _maxPlayers;
        wagerData.name = _name;
        wagerData.outcomes = _outcomes;
        wagerData.bettingEndTime = _bettingEndTime;
        wagerData.state = WagerState.Betting;
				usdcToken = IERC20(_usdcToken);
    }

    //Modifiers
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

    //Internal Functions
    function getTotalPool() internal view returns (uint) {
        uint total = 0;
        for (uint i = 0; i < wagerData.participants.length; i++) {
            total += wagerData.bets[wagerData.participants[i]].betAmount;
        }
        return total;
    }

    function totalVotes() private view returns (string memory) {}
    function checkIfVoted(address voter) private view returns (bool) {
        for (uint i = 0; i < wagerData.votes.length; i++) {
            if (wagerData.votes[i].creator == voter) {
                return true;
            }
        }
        return false;
    }

    //Functions



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

		require(usdcToken.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");
        wagerData.bets[msg.sender].betAmount = msg.value;

        uint wagerHash = uint(
            keccak256(abi.encodePacked(wagerData.creator, wagerData.name))
        );
        emit BetPlaced(wagerHash, msg.sender, msg.value);
    }



    function vote(string memory _outcome) external onlyVotingPhase {
        require(
            wagerData.bets[msg.sender].betAmount > 0,
            "Participant has not placed a bet"
        );
        require(checkIfVoted(msg.sender), "Participant has already voted");

        wagerData.votes.push(Vote(msg.sender, _outcome));

        if (wagerData.votes.length == wagerData.participants.length) {
            uint wagerHash = uint(
                keccak256(abi.encodePacked(wagerData.creator, wagerData.name))
            );
            string memory result = totalVotes();

            emit VotesCompleted(wagerHash, wagerData.name, result);
        }
    }

    function closeWager() external onlyClosedPhase onlyCreator {
        require(
            wagerData.state != WagerState.Closed,
            "Wager is already closed"
        );

        string memory result = totalVotes();

				

        wagerData.state = WagerState.Closed;

        emit WagerClosed(wagerData.creator, result);
    }

function closeWager() external onlyClosedPhase onlyCreator {
        require(
            wagerData.state != WagerState.Closed,
            "Wager is already closed"
        );

        string memory result = totalVotes();


        Bet[] winningParticipants;
        uint winningParticipantsTotal = 0;
        for (uint i = 0; i < wagerData.participants.length; i ++){
            address participant = wagerData.participants[i];
            Bet memory bet = wagerData.bets[participant];
            if (bet.option == result){
                winningParticipants.push(bet);
                winningParticipantsTotal += bet.betAmount;
            }
        }

        for (uint i = 0; i < winningParticipants.length; i ++){
            uint256 payout = (winningParticipants[i].betAmount / winningParticipantsTotal) * getTotalPool();
            usdcToken.transfer(address(this), winningParticipants[i].creator, payout);
        }   

        wagerData.state = WagerState.Closed;

        emit WagerClosed(wagerData.creator, result);
    }


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


//Creates Wager Objects for Users
contract WagerFactory {
    mapping(uint => Wager[]) public wagers;

    event WagerCreated(
        address indexed creator,
        address wagerAddress,
        string name,
        uint256 minBet,
        uint256 maxBet,
        uint256 minPlayers,
        uint256 maxPlayers,
        string[] outcomes,
        uint256 bettingEndTime
    );

    function createWager(
        uint256 _minBet,
        uint256 _maxBet,
        uint256 _minPlayers,
        uint256 _maxPlayers,
        string memory _name,
        string[] memory _outcomes,
        uint256 _bettingEndTime
    ) external {
        Wager newWager = new Wager(
            msg.sender,
            _minBet,
            _maxBet,
            _minPlayers,
            _maxPlayers,
            _name,
            _outcomes,
            _bettingEndTime
        );
        //8 integer hash of creator address and wager name
        uint wagerHash = uint(keccak256(abi.encodePacked(msg.sender, _name)));

        wagers[wagerHash].push(newWager);

        emit WagerCreated(
            msg.sender,
            address(newWager),
            _name,
            _minBet,
            _maxBet,
            _minPlayers,
            _maxPlayers,
            _outcomes,
            _bettingEndTime
        );
    }
}