const hre = require("hardhat");

async function main() {
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();

  console.log("Escrow deployed to:", escrow.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 