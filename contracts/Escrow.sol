// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Escrow {

   event NewEscrow(uint indexed id, address indexed creator, address indexed arbiter, address driver, uint amount);
   event PickedUp(uint indexed id);
    event Delivered(uint indexed id);
    event FundsReleased(uint indexed id);


    struct DeliveryEscrow {
    address customer;
    address driver;
    address arbiter; // recipient
    uint amount;
    bool pickedUp;
    bool delivered;
    bool released;
}
    DeliveryEscrow[] public escrows;
    mapping(uint => address) public escrowToOwner;

    function createEscrow(address _arbiter, address _driver) external payable{
        require(msg.value > 0, "Must send funds to escrow");
      escrows.push(DeliveryEscrow({
            customer: msg.sender,
            driver: _driver,
            arbiter: _arbiter,
            amount: msg.value,
            pickedUp: false,
            delivered: false,
            released: false
        }));
        uint id = escrows.length - 1;
        escrowToOwner[id] = msg.sender;
        
        emit NewEscrow(id, msg.sender, _arbiter, _driver, msg.value);
    }

    function markedPickedUp(uint _id) external {
        DeliveryEscrow storage myEscrow = escrows[_id];
        require(msg.sender == myEscrow.driver);
        require(!myEscrow.pickedUp, "Already Picked Up");
        require(!myEscrow.released, "Escrow already completed");
        myEscrow.pickedUp = true;
        emit PickedUp(_id);
    }

     function markDelivered(uint _id) external {
        DeliveryEscrow storage myEscrow = escrows[_id];
        require(msg.sender == myEscrow.driver);
        require(!myEscrow.delivered, "Already Picked Up");
        require(!myEscrow.released, "Escrow already completed");
        require(myEscrow.pickedUp, "Items should be picked up before being delivered");
        myEscrow.delivered = true;
        emit Delivered(_id);
    }

    function releaseToDriver(uint _id) external payable{
        DeliveryEscrow storage myEscrow = escrows[_id];
        require(msg.sender == myEscrow.arbiter);
        require(myEscrow.delivered, "Delivery not confirmed");
        require(!myEscrow.released, "Already released");
        (bool success,) = myEscrow.driver.call{value: myEscrow.amount}("");
        require(success, "Payment to driver failed");
        myEscrow.released = true;
        emit FundsReleased(_id);
    }


}
