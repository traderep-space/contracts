import { ethers } from "hardhat";
import hre from "hardhat";

const deployedContracts = {
  forecast: "0xf4AE34F436e34e7c69440869fae22F5ec862c265",
  bio: "0x5d776915F06958434E0C05eC75194FDC5f759548",
};

async function main() {
  const chain = hre.hardhatArguments.network;

  console.log("Running on chain: " + chain);

  // Deploy forecast contract
  if (!deployedContracts.forecast) {
    console.log("Start deploy forecast contract");
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

  // Deploy bio contract
  if (!deployedContracts.bio) {
    console.log("Start deploy bio contract");
    const contract = await ethers
      .getContractFactory("Bio")
      .then((factory) => factory.deploy());

    console.log("Bio contract deployed to " + contract.address);
    console.log(
      "Run to verify: npx hardhat verify --network " +
        chain +
        " " +
        contract.address
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
