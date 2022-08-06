// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/*
 * Contract for storing and processing forecasts.
 */
contract Forecast is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) internal _forecastAuthors;
    mapping(uint256 => bool) internal _verifiedForecasts;
    mapping(address => uint256) internal _positiveReputations;
    mapping(address => uint256) internal _negativeReputations;

    event ReputationUpdate(
        address account,
        uint256 positiveReputation,
        uint256 negativeReputation
    );
    event URISet(uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("TradeRep Metabolism Forecast", "TRMF") {}

    /**
     * Mint forecast without token uri.
     */
    function create() public returns (uint256) {
        // Mint token
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        // Save forecast author
        _forecastAuthors[newItemId] = msg.sender;
        // Update counter
        _tokenIds.increment();
        return newItemId;
    }

    /**
     * Set URI.
     */
    function setURI(uint256 tokenId, string memory tknURI) public {
        // Check that forecast doen't have token URI
        require(
            keccak256(abi.encodePacked(tokenURI(tokenId))) ==
                keccak256(abi.encodePacked("")),
            "Forecast already has token URI"
        );
        // Set URI
        _setTokenURI(tokenId, tknURI);
        emit URISet(tokenId, tknURI);
    }

    /**
     * Verify that forecast is true or not true.
     */
    function verify(uint256 tokenId) public {
        require(!_verifiedForecasts[tokenId], "Forecast already verified");
        // TODO: Implement real verifying
        // Assume that the forecast was true
        _verifiedForecasts[tokenId] = true;
        _positiveReputations[_forecastAuthors[tokenId]] += 1;
        emit ReputationUpdate(
            _forecastAuthors[tokenId],
            _positiveReputations[msg.sender],
            _negativeReputations[msg.sender]
        );
    }

    /**
     * Get account reputation.
     */
    function getReputation(address account)
        public
        view
        returns (uint256, uint256)
    {
        return (_positiveReputations[account], _negativeReputations[account]);
    }
}
