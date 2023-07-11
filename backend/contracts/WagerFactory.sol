// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Wager.sol";

//Creates Wager Objects for Users
contract WagerFactory {
    mapping (uint => Wager) allWagers;
    mapping (address => Wager[]) allUserWagers;

    event WagerCreated(
        uint indexed wagerHash,
        address wagerAddress,
        string name
    );

    function getUserWagers() view external returns (Wager[] memory){
        return allUserWagers[msg.sender];
    }

    function createWager(
        uint256 _minBet,
        uint256 _maxBet,
        uint256 _minPlayers,
        uint256 _maxPlayers,
        string memory _name,
        string[] memory _outcomes,
        uint256 _bettingEndTime
    ) external {
        //8 integer hash of creator address and wager name
        uint wagerHash = uint(keccak256(abi.encodePacked(msg.sender, _name)));

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


        allWagers[wagerHash] = newWager;
        allUserWagers[msg.sender].push(newWager);

        
        emit WagerCreated(wagerHash, address(newWager), _name);
    }

    function joinWager(uint wagerHash) external{
        Wager[] memory userWagers = allUserWagers[msg.sender];
        require( 
            allWagers[wagerHash].bettingEndTime() > 0,
            "Wager does not exist"
        );
        bool userWagerExists = false;
        for (uint i = 0; i < allUserWagers[msg.sender].length; i ++){
            uint hash = uint(keccak256(abi.encodePacked(userWagers[i].creator, userWagers[i].name)));
            if (hash == wagerHash){
                userWagerExists = true;
            }
        }
        require(
            userWagerExists == false,
            "Wager exists for user"
        );

        Wager(address(allWagers[wagerHash])).joinWager();
        allUserWagers[msg.sender].push(Wager(address(allWagers[wagerHash])));
    }



    function placeBet(uint wagerHash, uint amount, string memory option) external{
        allWagers[wagerHash].placeBet(amount, option);
    }

    function vote(uint wagerHash, string memory option) external{
        allWagers[wagerHash].vote(option);
    }

    function getTotalPool(uint wagerHash) external view returns (uint){
        return allWagers[wagerHash].getTotalPool();
    }

    function checkIfVoted(uint wagerHash) external view returns (bool){
        return allWagers[wagerHash].checkIfVoted(msg.sender);
    }

    function getWinningOption(uint wagerHash) external view returns (string memory){
        return allWagers[wagerHash].getWinningOption();
    }

}