// SPDX-License-Identifier: MIT
import "../../models/Schema.sol";

pragma experimental ABIEncoderV2;
pragma solidity 0.7.0;

interface IRoundStore {
    function getRound(uint256 roundId) external view returns (Round memory);

    function getCompanyRounds(uint256 companyId) external view returns (Round[] memory);

    function updateRound(uint256 id, Round memory round) external;

    function createRound(Round memory round) external returns (uint256);

    function createRoundPaymentOptions(uint256 roundId, address[] memory paymentCurrencies) external;

    function getRoundPaymentOptions(uint256 id) external view returns (address[] memory);

    function createRoundNft(RoundNft memory roundNft) external returns (uint256);

    function updateRoundNft(uint256 id, RoundNft memory roundNft) external;

    function getRoundNft(uint256 id) external view returns (RoundNft memory);

    function getCompanyRoundsNft(uint256 companyId) external view returns (RoundNft[] memory);

    function getRoundsNft(uint256 roundId) external view returns (RoundNft[] memory);
}