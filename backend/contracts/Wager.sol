// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Wager {
    IERC20 public usdcToken;
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
        mapping(address => Bet[]) bets;
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
        string option, 
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
		usdcToken = IERC20(0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d);
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
            total += wagerData.bets[wagerData.participants[i]][0].betAmount;
        }
        return total;
    }

    function contains(string[] memory array, string memory element) internal pure returns (bool) {
        for (uint i = 0; i < array.length; i++) {
            if (keccak256(bytes(array[i])) == keccak256(bytes(element))) {
                return true;
            }
        }
        return false;
    }

    function searchValue(string[] memory array, string memory element) internal pure returns (uint) {
        for (uint i = 0; i < array.length; i++) {
            if (keccak256(bytes(array[i])) == keccak256(bytes(element))) {
                return i;
            }
        }
        return 0;
    }

    function totalVotes() private view returns (string memory) {
        uint count = 0;
        string[] memory temp = new string[](wagerData.votes.length);
        for (uint i = 0; i < wagerData.votes.length; i ++){
            if (!contains(temp, wagerData.votes[i].option)){
                temp[i] = wagerData.votes[i].option;
                count ++;
            }
        }
        string[] memory voteUnique = new string[](count);
        uint increment = 0;
        for (uint i = 0; i < wagerData.votes.length; i ++){
            if (!contains(voteUnique, wagerData.votes[i].option)){
                voteUnique[increment] = wagerData.votes[i].option;
                increment ++;
            }
        }

        uint[] memory voteCount = new uint[](voteUnique.length);
        if (voteUnique.length == 1){
            return voteUnique[0];
        }
        for (uint i = 0; i < wagerData.votes.length; i ++){
            uint index = searchValue(voteUnique, wagerData.votes[i].option);
            voteCount[index] += 1;
        }
        uint max = 0;
        for (uint i = 0; i < voteCount.length; i ++){
            if (voteCount[i] > max){
                max = voteCount[i];
            }
        }

        return voteUnique[max];
    }

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

    function placeBet(uint _amount, string memory option) external payable onlyBettingPhase {
        require(
            isParticipant(msg.sender),
            "Participant has not joined the wager"
        );
        require(
            msg.value >= wagerData.minBet && msg.value <= wagerData.maxBet,
            "Invalid bet amount"
        );

		require(usdcToken.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");
        
        Bet memory userBet;

        userBet.creator = msg.sender;
        userBet.betAmount = msg.value;
        userBet.option = option;


        wagerData.bets[msg.sender].push(userBet);

        uint wagerHash = uint(
            keccak256(abi.encodePacked(wagerData.creator, wagerData.name))
        );
        emit BetPlaced(wagerHash, msg.sender, option, msg.value);
    }



    function vote(string memory _outcome) external {
        require(
            wagerData.bets[msg.sender][0].betAmount > 0,
            "Participant has not placed a bet"
        );
        require(checkIfVoted(msg.sender), "Participant has already voted");
        require(block.timestamp < wagerData.bettingEndTime, "Betting Time is still active");


        wagerData.votes.push(Vote(msg.sender, _outcome));

        if (wagerData.votes.length == wagerData.participants.length) {
            uint wagerHash = uint(
                keccak256(abi.encodePacked(wagerData.creator, wagerData.name))
            );
            string memory result = totalVotes();
            emit VotesCompleted(wagerHash, wagerData.name, result);
            closeWager();
        }
    }

    function closeWager() public onlyClosedPhase onlyCreator {
            require(
                wagerData.state != WagerState.Closed,
                "Wager is already closed"
            );

            string memory result = totalVotes();

            //need figure out how to be able to add to this array of Bets 
            uint len = wagerData.participants.length;
            Bet[] memory winningParticipants = new Bet[](len); 
            
            uint winningParticipantsTotal = 0;
            for (uint i = 0; i < wagerData.participants.length; i ++){
                address participant = wagerData.participants[i];
                Bet memory bet = wagerData.bets[participant][0];
                if (keccak256(abi.encodePacked(bet.option)) == keccak256(abi.encodePacked(result))){
                    winningParticipants[i] = bet;
                    winningParticipantsTotal += bet.betAmount;
                }
            }

            for (uint i = 0; i < winningParticipants.length; i ++){
                uint256 payout = (winningParticipants[i].betAmount / winningParticipantsTotal) * getTotalPool();
                usdcToken.transferFrom(address(this), winningParticipants[i].creator, payout);
            }   

            wagerData.state = WagerState.Closed;

            emit WagerClosed(wagerData.creator, result);
        }

    function isParticipant(address _participant) public view returns (bool) {
        for (uint256 i = 0; i < wagerData.participants.length; i++) {
            if (wagerData.participants[i] == _participant) {
                return true;
            }
        }
        return false;
    }
    
    //getter for external wagerData members
    function bettingEndTime() external view returns (uint256) {
        return wagerData.bettingEndTime;
    }

    function creator() external view returns (address) {
        return wagerData.creator;
    }

    function name() external view returns (string memory) {
        return wagerData.name;
    }
}



