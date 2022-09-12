import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

describe("EarlyAdopter", function () {
  // Accounts
  let account1: Signer;
  let account2: Signer;
  let account3: Signer;
  // Contract
  let contract: Contract;

  before(async function () {
    // Init accounts
    [account1, account2, account3] = await ethers.getSigners();

    // Deploy contract
    contract = await ethers
      .getContractFactory("EarlyAdopter")
      .then((factory) =>
        factory.deploy(
          "ipfs://bafybeiazag7zrndyjnhl4e7vml2lhxl26eexfwq44m4ottpihlb3mb5e5m"
        )
      );
  });

  it("Should mint tokens by owner for several accounts", async function () {
    // Check balances before mint
    expect(await contract.balanceOf(await account2.getAddress())).to.equal(0);
    expect(await contract.balanceOf(await account3.getAddress())).to.equal(0);
    // Mint
    await contract
      .connect(account1)
      .mint([await account2.getAddress(), await account3.getAddress()])
      .then((tx: any) => tx.wait());
    // Check balances after mint
    expect(await contract.balanceOf(await account2.getAddress())).to.equal(1);
    expect(await contract.balanceOf(await account3.getAddress())).to.equal(1);
  });

  it("Should fail if trying mint tokens by not owner", async function () {
    await expect(
      contract
        .connect(account2)
        .mint([await account2.getAddress(), await account3.getAddress()])
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should fail if trying transfer token", async function () {
    await expect(
      contract
        .connect(account2)
        .transferFrom(
          await account2.getAddress(),
          await account3.getAddress(),
          1
        )
    ).to.be.revertedWith("Token is non-transferable");
  });

  it("Should fail if trying to mint second token to one account", async function () {
    await expect(
      contract.connect(account1).mint([await account2.getAddress()])
    ).to.be.revertedWith("Address already has a token");
  });
});
