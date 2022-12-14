import { ethers } from "hardhat";
import hre from "hardhat";

const deployedContracts: any = {
  mumbai: {
    forecast: "0xf4AE34F436e34e7c69440869fae22F5ec862c265",
    bio: "0x5d776915F06958434E0C05eC75194FDC5f759548",
    earlyAdopter: "0xC3Ce59992D266b0ADB985Bf6De78b2d5A3191beB",
  },
  polygon: {
    earlyAdopter: "0xd4640f498b2BB81D3a3c0c2Da0a2e46Aa3C2aA31",
  },
};

async function main() {
  // Define chain
  const chain = hre.hardhatArguments.network;
  if (!chain) {
    console.log("Chain is not defined");
    return;
  }
  console.log("Running on chain: " + chain);

  // Define deployed contracts by chain
  const chainDeployedContracts = deployedContracts[chain];

  // Deploy forecast contract
  if (chainDeployedContracts.forecast === "") {
    console.log("Start deploy forecast contract");
    const contract = await ethers
      .getContractFactory("Forecast")
      .then((factory) => factory.deploy());
    console.log("Forecast contract deployed to " + contract.address);
  }

  // Deploy bio contract
  if (chainDeployedContracts.bio === "") {
    console.log("Start deploy bio contract");
    const contract = await ethers
      .getContractFactory("Bio")
      .then((factory) => factory.deploy());
    console.log("Bio contract deployed to " + contract.address);
  }

  // Deploy early adopter contract
  if (chainDeployedContracts.earlyAdopter === "") {
    console.log("Start deploy early adopter contract");
    const contract = await ethers
      .getContractFactory("EarlyAdopter")
      .then((factory) =>
        factory.deploy(
          "ipfs://bafybeiggcvt6dnzwbhaxqy2g33mh2ms2nmo7knc3anhc24xr22qgr2bada/"
        )
      );
    console.log("Early adopter deployed to " + contract.address);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
