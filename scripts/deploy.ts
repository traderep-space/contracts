import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const chain = hre.hardhatArguments.network;

  console.log("Running on chain: " + chain);

  const contract = await ethers
    .getContractFactory("Forecast")
    .then((factory) => factory.deploy());

  console.log("Forecast contract deployed to " + contract.address);
  console.log(
    "Run to verify: npx hardhat verify --network " +
      chain +
      " " +
      contract.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
