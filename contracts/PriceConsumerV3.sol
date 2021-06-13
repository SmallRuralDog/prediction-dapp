// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
import "./AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    constructor() public {}

    function setPriceFeed(address addr) public {
        priceFeed = AggregatorV3Interface(addr);
    }

    /**
     * Returns the latest price
     */
    function getThePrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
