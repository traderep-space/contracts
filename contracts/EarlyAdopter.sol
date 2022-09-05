// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * Contract with tokens for early adopters.
 */
contract EarlyAdopter is ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Base of token URI
    string public baseURI;

    // Base of token extension
    string public baseExtension = ".json";

    // Maximum number of tokens
    uint256 public maxSupply = 142;

    /**
     * Init contract.
     */
    constructor(string memory _initBaseURI)
        ERC721("TradeRep Early Adopter", "TREA")
    {
        setBaseURI(_initBaseURI);
    }

    /**
     * Mint tokens by owner for specified addresses.
     */
    function mint(address[] calldata _addresses) public onlyOwner {
        uint256 supply = totalSupply();
        require(
            supply + _addresses.length <= maxSupply,
            "Supply is not enough for specified number of addresses"
        );
        for (uint256 i = 0; i < _addresses.length; i++) {
            _safeMint(_addresses[i], supply + 1 + i);
        }
    }

    /**
     * Get all owner's tokens.
     */
    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    /**
     * Get token URI.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token is not exists");

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    /**
     * Set token base URI.
     */
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /**
     * Set token base extension.
     */
    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    /**
     * Get base URI.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /**
     * Checks before transfer.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
        // Allow only zero address transfer tokens
        require(from == address(0), "Token is non-transferable");
        // Allow only one token to be owned
        require(balanceOf(to) == 0, "Address already has a token");
    }
}
