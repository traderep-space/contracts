import { Signer } from "ethers";
import { ethers } from "hardhat";
import { Forecast } from "../typechain-types";
import { expect } from "chai";

describe.only("Forecast", function () {
  // Accounts
  let account1: Signer;
  let account2: Signer;
  // Contract
  let contract: Forecast;

  before(async function () {
    // Init accounts
    [account1, account2] = await ethers.getSigners();

    // Deploy contract
    contract = await ethers
      .getContractFactory("Forecast")
      .then((factory) => factory.deploy());
  });

  it("Should allow to mint multiple tokens", async function () {
    await contract
      .connect(account1)
      .post("ipfs://...")
      .then((tx) => tx.wait());
    await contract
      .connect(account1)
      .post("ipfs://...")
      .then((tx) => tx.wait());
    let balance = await contract.balanceOf(await account1.getAddress());
    expect(balance).to.equal(2);
  });
});
