import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe.only("Forecast", function () {
  // Accounts
  let account1: Signer;
  let account2: Signer;
  // Contract
  let contract: Contract;
  // Helpful variables
  let forecastCounter = 0;

  before(async function () {
    // Init accounts
    [account1, account2] = await ethers.getSigners();

    // Deploy contract
    contract = await ethers
      .getContractFactory("Forecast")
      .then((factory) => factory.deploy());
  });

  it("Should mint two tokens to one account", async function () {
    await contract
      .connect(account1)
      .create()
      .then((tx: any) => tx.wait());
    await contract
      .connect(account1)
      .create()
      .then((tx: any) => tx.wait());
    let balance = await contract.balanceOf(await account1.getAddress());
    expect(balance).to.equal(2);
    forecastCounter += 2;
  });

  it("Should mint token with uri", async function () {
    let balanceBefore: BigNumber = await contract.balanceOf(
      await account1.getAddress()
    );
    await contract
      .connect(account1)
      .createWithURI("ipfs://")
      .then((tx: any) => tx.wait());
    let balanceAfter: BigNumber = await contract.balanceOf(
      await account1.getAddress()
    );
    expect(balanceBefore.add(BigNumber.from(1))).to.equal(balanceAfter);
    forecastCounter += 1;
  });

  it("Should fail if forecast already has token URI", async function () {
    await contract
      .connect(account1)
      .setURI("0", "ipfs://")
      .then((tx: any) => tx.wait());
    await expect(
      contract.connect(account1).setURI("0", "ipfs://")
    ).to.be.revertedWith("Forecast already has token URI");
  });

  it("Should save verification results and change reputation", async function () {
    await contract.saveVerificationResults(["0", "1"], [true, false]);
    let reputation = await contract.getReputation(await account1.getAddress());
    expect(reputation[0]).to.equal(1);
    expect(reputation[1]).to.equal(1);
  });

  it("Should fail if forecast already verified", async function () {
    await expect(
      contract.saveVerificationResults(["0"], [true])
    ).to.be.revertedWith("One of the forecast already verified");
  });
});
