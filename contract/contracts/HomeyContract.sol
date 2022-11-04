// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract HomeyContract {
    enum State {
        Created,
        Active,
        Pending,
        Inactive
    }

    struct Lease {
        uint256 value;
        address payable landlord;
        address payable tenant;
        uint256 claimValue;
        uint256 propertyId;
        State state;
    }

    mapping(uint256 => Lease) public leaseContracts;

    constructor() payable {
        // landlord = payable(msg.sender);
        // value = msg.value;
    }

    modifier isContract(uint256 _propertyId, address _landlordAddress) {
        require(
            leaseContracts[_propertyId].value > 0 ,
            "Property lease contract not found"
        );

        require(
            leaseContracts[_propertyId].landlord == _landlordAddress,
            "Tenant wallet address is not the same as indicated by landlord"
        );

        require(
            leaseContracts[_propertyId].value == msg.value,
            "Deposit amount is not the same as indicated by landlord"
        );

        _;
    }

    modifier isTenant(uint256 _propertyId) {
        require(
            leaseContracts[_propertyId].tenant == msg.sender,
            "Invalid property ID or you are not the tenant"
        );
        _;
    }

    modifier isLandlord(uint256 _propertyId) {
        require(
            leaseContracts[_propertyId].landlord == msg.sender,
            "Invalid property ID or you are not the landlord"
        );
        _;
    }

    modifier inState(uint256 _propertyId, State state_) {
        require(
            leaseContracts[_propertyId].state == state_,
            "This action cannot be executed at current stage"
        );
        _;
    }

    function createContract(
        uint256 _value,
        address payable _tenant,
        uint256 _propertyId
    ) external {
        // value = msg.value;

        Lease memory lease = Lease({
            value: (_value * 10**18),
            landlord: payable(msg.sender),
            tenant: _tenant,
            claimValue: 0,
            propertyId: _propertyId,
            state: State.Created
        });
        leaseContracts[_propertyId] = lease;
    }

    function tenantAccept(uint256 _propertyId, address _landlordAddress)
        external
        payable
        isContract(_propertyId, _landlordAddress)
        inState(_propertyId, State.Created)
    {
        leaseContracts[_propertyId].state = State.Active;
    }

    function tenantTerminate(uint256 _propertyId)
        external
        isTenant(_propertyId)
        inState(_propertyId, State.Active)
    {
        leaseContracts[_propertyId].landlord.transfer(
            leaseContracts[_propertyId].value
        );
        leaseContracts[_propertyId].state = State.Inactive;
    }

    function requestDeposit(uint256 _propertyId)
        external
        isTenant(_propertyId)
        inState(_propertyId, State.Active)
    {
        leaseContracts[_propertyId].state = State.Pending;
        // tenant.transfer(value);
    }

    function releaseDeposit(uint256 _propertyId)
        external
        isLandlord(_propertyId)
        inState(_propertyId, State.Pending)
    {
        leaseContracts[_propertyId].tenant.transfer(leaseContracts[_propertyId].value);
        leaseContracts[_propertyId].state = State.Inactive;
    }

    function damageClaim(uint256 _propertyId, uint256 _damageValue)
        external
        isLandlord(_propertyId)
        inState(_propertyId, State.Pending)
    {
        uint256 _claimValue = (_damageValue * 10**18);
        uint256 remainingDeposit = leaseContracts[_propertyId].value -
            (_claimValue);
        leaseContracts[_propertyId].landlord.transfer(_claimValue);
        leaseContracts[_propertyId].state = State.Inactive;
        leaseContracts[_propertyId].tenant.transfer(remainingDeposit);
    }
}

/// The function cannot be called at the current state.
error InvalidState();
///  Ony the tenant can call this function
error OnlyTenant();
///  Ony the landlord can call this function
error OnlyLandlord();