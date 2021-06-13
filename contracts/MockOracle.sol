// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./Ownable.sol";

contract MockOracle is Ownable {
    uint80 public roundId;
    int256 public price;

    constructor() public {
        roundId = 1;
    }

    function latestRoundData()
        public
        view
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        uint80 answeredInRound = roundId - 1;
        return (
            roundId,
            price,
            block.timestamp,
            block.timestamp,
            answeredInRound
        );
    }

    function updatePrice(int256 _price) public onlyOwner {
        roundId = roundId + 1;
        price = _price;
    }
}
