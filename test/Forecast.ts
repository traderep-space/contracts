import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe.only("Forecast", function () {
  // Accounts
  let account1: Signer;
  let account2: Signer;
  // Contract
  let contract: Contract;

  before(async function () {
    // Init accounts
    [account1, account2] = await ethers.getSigners();

    // Deploy contract
    contract = await ethers
      .getContractFactory("Forecast")
      .then((factory) => factory.deploy());
  });

  it("Should mint multiple tokens to one account", async function () {
    await contract
      .connect(account1)
      .post("ipfs://...")
      .then((tx: any) => tx.wait());
    await contract
      .connect(account1)
      .post("ipfs://...")
      .then((tx: any) => tx.wait());
    let balance = await contract.balanceOf(await account1.getAddress());
    expect(balance).to.equal(2);
  });

  it("Should verify forecast and change reputation", async function () {
    await contract.verify(1);
    let reputation = await contract.getReputation(await account1.getAddress());
    expect(reputation[0]).to.equal(1);
    expect(reputation[1]).to.equal(0);
  });

  it("Should fail if forecast already verified", async function () {
    await expect(contract.verify(1)).to.be.revertedWith(
      "Forecast already verified"
    );
  });
});
