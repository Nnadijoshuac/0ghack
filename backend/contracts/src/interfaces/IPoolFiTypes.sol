// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPoolFiTypes {
    enum PoolType {
        GOAL,
        IMPACT
    }

    enum PoolStatus {
        ACTIVE,
        CLOSED,
        CANCELLED
    }

    struct PoolConfig {
        PoolType poolType;
        string name;
        string category;
        uint256 targetAmount;
        uint256 contributionPerPerson;
        uint64 startAt;
        uint64 deadline;
        address admin;
        bytes32 metadataHash;
    }
}
