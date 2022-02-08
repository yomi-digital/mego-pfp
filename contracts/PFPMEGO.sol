// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IMEGO.sol";
import "../interfaces/IERC721.sol";

/**
 * @title PFPMEGO
 * PFPMEGO - Extending MEGO with PFP
 */
contract PFPMEGO is Ownable {
    IERC721 private _pfp;
    IMEGO private _mego;
    string private gate = "ape";
    mapping(uint256 => uint256) public _pfpToName;
    mapping(uint256 => uint256) public _nameToPfp;
    mapping(uint256 => string) public _idToName;

    constructor(
        address MEGO,
        address PFP,
        string memory _gate
    ) {
        _mego = IMEGO(MEGO);
        _pfp = IERC721(PFP);
        gate = _gate;
    }

    /**
     * Admin functions to fix base addresses or gate if needed
     */
    function fixMEGO(address MEGO) public onlyOwner {
        _mego = IMEGO(MEGO);
    }

    function fixPFP(address PFP) public onlyOwner {
        _pfp = IERC721(PFP);
    }

    function fixGate(string memory _gate) public onlyOwner {
        gate = _gate;
    }

    /**
     * Internal function to return the tokenId for a specific name
     */
    function returnNameId(string memory _name) internal view returns (uint256) {
        uint256 tknId = _mego._nameToTokenId(
            string(abi.encodePacked(_name, ".", gate))
        );
        require(tknId > 0, "This name doesn't exists.");
        return tknId;
    }

    /**
     * Check if sender can add or not a PGP key
     */
    function canAdd(string memory _name, uint256 pfpId)
        public
        view
        returns (bool)
    {
        uint256 megobal = _mego.balanceOf(msg.sender);
        uint256 pfpbal = _pfp.balanceOf(msg.sender);
        require(
            megobal > 0 && pfpbal > 0,
            "Must own at least one name and one pfp."
        );
        uint256 nameId = returnNameId(_name);
        require(
            _mego.ownerOf(nameId) == msg.sender &&
                _pfp.ownerOf(pfpId) == msg.sender,
            "You must own that name and that pfp."
        );
        return true;
    }

    /**
     * Add name to profile picture
     */
    function linkName(string memory _name, uint256 pfpId) public {
        require(canAdd(_name, pfpId), "Can't link.");
        uint256 nameId = returnNameId(_name);
        require(_nameToPfp[nameId] == 0 && _pfpToName[pfpId] == 0, "Try to link again nfts.");
        _pfpToName[pfpId] = nameId;
        _nameToPfp[nameId] = pfpId;
        _idToName[nameId] = string(abi.encodePacked(_name, ".", gate));
    }

    /**
     * Remove name to profile picture
     */
    function unlinkName(string memory _name) public {
        uint256 nameId = returnNameId(_name);
        uint256 pfpId = _nameToPfp[nameId];
        require(canAdd(_name, pfpId), "Can't unlink.");
        _pfpToName[pfpId] = 0;
        _nameToPfp[nameId] = 0;
        _idToName[nameId] = "";
    }

    /**
     * Get name for profile picture
     */
    function returnName(uint256 pfpId) public view returns (string memory) {
        uint256 nameId = _pfpToName[pfpId];
        require(
            _mego.ownerOf(nameId) == _pfp.ownerOf(pfpId),
            "Owner is not the same."
        );
        return _idToName[nameId];
    }

    /**
     * Get pfp for given name
     */
    function returnPfpId(string memory _name) public view returns (uint256) {
        uint256 nameId = returnNameId(_name);
        uint256 pfpId = _nameToPfp[nameId];
        require(
            _mego.ownerOf(nameId) == _pfp.ownerOf(pfpId),
            "Owner is not the same."
        );
        return pfpId;
    }
    
    /**
     * Get pfp for given name
     */
    function returnPfpURI(string memory _name) public view returns (string memory) {
        uint256 nameId = returnNameId(_name);
        uint256 pfpId = _nameToPfp[nameId];
        require(
            _mego.ownerOf(nameId) == _pfp.ownerOf(pfpId),
            "Owner is not the same."
        );
        return _pfp.tokenURI(pfpId);
    }
}
