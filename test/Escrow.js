import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs.js";
import chai from "chai";

const { expect } = chai;

describe("Escrow", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEscrowContract() {
    const Contract = await ethers.getContractFactory("Escrow");
    const contract = await Contract.deploy();

    return { contract };
  }

  describe("Deployment", function () {
    it("inital state variables empty", async function () {
      const { contract } = await loadFixture(deployEscrowContract);
      const total = await contract.escrows.length;
      expect(total).to.equal(0);
    });
  });

  describe("createEscrow", function(){
    it("should successfully create a new escrow", async function () {
      const { contract } = await loadFixture(deployEscrowContract);
      const wallet1 = ethers.Wallet.createRandom();
      const wallet2 = ethers.Wallet.createRandom();
      const tx = await contract.createEscrow(wallet1.address, wallet2.address, {value: ethers.parseEther("1.0")});
      await tx.wait();
      const escrow = await contract.escrows(0);
      expect(escrow).to.not.equal("");
    });

    it("should have multiple escrows", async function () {
      const { contract } = await loadFixture(deployEscrowContract);
      const wallet1 = ethers.Wallet.createRandom();
      const wallet2 = ethers.Wallet.createRandom();
      const tx1 = await contract.createEscrow(wallet1.address, wallet2.address, {value: ethers.parseEther("1.0")});
      await tx1.wait();
      const tx2 = await contract.createEscrow(wallet2.address, wallet1.address, {value: ethers.parseEther("1.0")});
      await tx2.wait();
      const escrow = await contract.escrows(1);
      expect(escrow).to.not.equal("");
    });

    it("should fail if not eth sent", async function () {
      const { contract } = await loadFixture(deployEscrowContract);
      const wallet1 = ethers.Wallet.createRandom();
      const wallet2 = ethers.Wallet.createRandom();
      await expect(contract.createEscrow(wallet1.address, wallet2.address)).to.be.revertedWith("Must send funds to escrow");
    });

    it("scrowToOwner should mapping stores the correct owner", async function () {
      const [signer] = await ethers.getSigners();
      const { contract } = await loadFixture(deployEscrowContract);
      const wallet1 = ethers.Wallet.createRandom();
      const wallet2 = ethers.Wallet.createRandom();
      const tx1 = await contract.createEscrow(wallet1.address, wallet2.address, {value: ethers.parseEther("1.0")});
      await tx1.wait();
      const owner = await contract.escrowToOwner(0);
      await expect(owner).to.equal(signer.address);
    });

  })
});