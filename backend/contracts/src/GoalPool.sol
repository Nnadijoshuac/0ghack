// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPoolFiTypes} from "./interfaces/IPoolFiTypes.sol";

contract GoalPool is IPoolFiTypes {
    PoolConfig public config;
    PoolStatus public status;

    uint256 public totalRaised;
    uint256 public contributorsPaid;

    mapping(address => bool) public hasPaid;

    event PoolJoined(address indexed account, uint256 timestamp);
    event ContributionMade(address indexed account, uint256 amount, uint256 totalRaised);
    event PoolClosed(uint256 totalRaised, uint256 timestamp);
    event PoolCancelled(uint256 timestamp);

    error NotAdmin();
    error PoolInactive();
    error AlreadyPaid();
    error InvalidAmount();

    modifier onlyAdmin() {
        if (msg.sender != config.admin) revert NotAdmin();
        _;
    }

    modifier onlyActive() {
        if (status != PoolStatus.ACTIVE) revert PoolInactive();
        _;
    }

    constructor(PoolConfig memory cfg) {
        config = cfg;
        status = PoolStatus.ACTIVE;
    }

    function contribute() external payable onlyActive {
        if (hasPaid[msg.sender]) revert AlreadyPaid();
        if (msg.value != config.contributionPerPerson) revert InvalidAmount();

        hasPaid[msg.sender] = true;
        contributorsPaid += 1;
        totalRaised += msg.value;

        emit PoolJoined(msg.sender, block.timestamp);
        emit ContributionMade(msg.sender, msg.value, totalRaised);
    }

    function closePool() external onlyAdmin onlyActive {
        status = PoolStatus.CLOSED;
        emit PoolClosed(totalRaised, block.timestamp);
    }

    function cancelPool() external onlyAdmin onlyActive {
        status = PoolStatus.CANCELLED;
        emit PoolCancelled(block.timestamp);
    }
}
