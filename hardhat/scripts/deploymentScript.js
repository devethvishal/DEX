const { ethers } = require("hardhat");
const { cryptoDevTokenContractAddress } = require("../constants");

async function main() {
  const exchangeContract = await ethers.getContractFactory("Exchange");
  const deployedExchangeContract = await exchangeContract.deploy(
    cryptoDevTokenContractAddress
  );

  await deployedExchangeContract.deployed();

  console.log(
    "Exchange Contract Successfully deployed to:",
    deployedExchangeContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  //Exchange Contract deployed to the address : 0x86571D485f06F3e27769a3bDBEe979740af352C5