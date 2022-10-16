// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract RentalDeposit {
    uint256 public value;
    address payable public landlord;
    address payable public tenant;
    uint256 public _claimValue;
    uint256 public remainingDeposit;

    enum State {
        Created,
        TenantOffered,
        LandlordAccepted,
        Inactive
    }
    State public state;

    constructor() payable {
        landlord = payable(msg.sender);
        // value = msg.value;
    }

    modifier onlyTenant() {
        if (msg.sender != tenant) {
            revert OnlyTenant();
        }
        _;
    }
    modifier onlyLandlord() {
        if (msg.sender != landlord) {
            revert OnlyLandlord();
        }
        _;
    }
    modifier inState(State state_) {
        if (state != state_) {
            revert InvalidState();
        }
        _;
    }
    
    function tenantOffer() external payable inState(State.Created) {
        value = msg.value;
        tenant = payable(msg.sender);
        state = State.TenantOffered;
    }
    function landlordAccept() external onlyLandlord inState(State.TenantOffered) {
        state = State.LandlordAccepted;
    }
    function tenantTerminate() external onlyTenant inState(State.LandlordAccepted) {
        landlord.transfer(value);
        state = State.Inactive;
    }
    // function landlordTerminate() external onlyLandlord inState(State.LandlordAccepted) {
    //     tenant.transfer(value);
    //     state = State.Inactive;
    // }
    function releaseDepositToTenant() external onlyLandlord inState(State.LandlordAccepted) {
        state = State.Inactive;
        tenant.transfer(value);
    }
    function damageClaim(uint256 _damageValue) external onlyLandlord inState(State.LandlordAccepted) {
        _claimValue = (_damageValue * 10**18);
        remainingDeposit = value - (_claimValue);
        landlord.transfer(_claimValue);
        tenant.transfer(remainingDeposit);
    }
}

/// The function cannot be called at the current state.
error InvalidState();
///  Ony the tenant can call this function
error OnlyTenant();
///  Ony the landlord can call this function
error OnlyLandlord();
