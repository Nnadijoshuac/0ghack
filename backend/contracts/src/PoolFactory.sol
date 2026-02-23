// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPoolFiTypes} from "./interfaces/IPoolFiTypes.sol";
import {GoalPool} from "./GoalPool.sol";

contract PoolFactory is IPoolFiTypes {
    address[] public pools;
    mapping(address => address[]) public poolsByAdmin;

    event PoolCreated(
        address indexed pool,
        address indexed admin,
        PoolType indexed poolType,
        bytes32 metadataHash
    );

    function createPool(PoolConfig calldata cfg) external returns (address pool) {
        require(cfg.admin == msg.sender, "admin must be caller");

        GoalPool goalPool = new GoalPool(cfg);
        pool = address(goalPool);

        pools.push(pool);
        poolsByAdmin[msg.sender].push(pool);

        emit PoolCreated(pool, msg.sender, cfg.poolType, cfg.metadataHash);
    }

    function allPools() external view returns (address[] memory) {
        return pools;
    }

    function adminPools(address admin) external view returns (address[] memory) {
        return poolsByAdmin[admin];
    }
}
