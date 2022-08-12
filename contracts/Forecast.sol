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

    event URISet(uint256 indexed tokenId, string tokenURI);

    event Verify(uint256 indexed tokenId, bool isTrue);

    event ReputationUpdate(
        address account,
        uint256 positiveReputation,
        uint256 negativeReputation
    );

    constructor() ERC721("TradeRep Forecast", "TRF") {}

    /**
     * Mint forecast with token uri.
     */
    function createWithURI(string memory tknURI) public returns (uint256) {
        uint256 tokenId = create();
        setURI(tokenId, tknURI);
        return tokenId;
    }

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
     * Set uri.
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
     * Save verification results.
     */
    function saveVerificationResults(
        uint256[] memory tokenIds,
        bool[] memory tokenVerificationResults
    ) public {
        // Check lengths
        require(
            tokenIds.length == tokenVerificationResults.length,
            "Arrays have different lengths"
        );
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            // Check forecast verification
            require(
                !_verifiedForecasts[tokenIds[i]],
                "One of the forecast already verified"
            );
            // Save verification result
            _verifiedForecasts[tokenIds[i]] = true;
            emit Verify(tokenIds[i], tokenVerificationResults[i]);
            // Update author reputation
            if (tokenVerificationResults[i]) {
                _positiveReputations[_forecastAuthors[tokenIds[i]]] += 1;
            } else {
                _negativeReputations[_forecastAuthors[tokenIds[i]]] += 1;
            }
            emit ReputationUpdate(
                _forecastAuthors[tokenIds[i]],
                _positiveReputations[msg.sender],
                _negativeReputations[msg.sender]
            );
        }
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
