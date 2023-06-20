const hre = require("hardhat");

async function main() {
  //Hello World Contrac Deployment
  const HelloWorldFactory = await hre.ethers.getContractFactory("HelloWorld");
  const helloWorld = await HelloWorldFactory.deploy("test");
  await helloWorld.deployed();
  console.log(`Cupcake vending machine deployed to ${helloWorld.address}`);
  //Wager Contract Deployment
  //test arguments to deploy with
  const creatorAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const minBet = 100; // Minimum bet amount in wei
  const maxBet = 1000; // Maximum bet amount in wei
  const minPlayers = 2; // Minimum number of players
  const maxPlayers = 10; // Maximum number of players
  const wagerName = "My Wager"; // Name of the wager
  const outcomes = ["Option A", "Option B", "Option C"]; // Array of outcome options
  const bettingEndTime = Math.floor(Date.now() / 1000) + 3600; // Betting end time in UNIX timestamp format (1 hour from now)

  const Wager = await hre.ethers.getContractFactory("Wager");
  const wager = await Wager.deploy(
    creatorAddress,
    minBet,
    maxBet,
    minPlayers,
    maxPlayers,
    wagerName,
    outcomes,
    bettingEndTime
  );
  await wager.deployed();
  console.log(`Wager Contract Deployed to Address:", ${await wager.address}`);
  //WagerFactory Contract Deployment
  const WagerFactory = await hre.ethers.getContractFactory("WagerFactory");
  const wagerFactory = await WagerFactory.deploy();
  await wagerFactory.deployed();
  console.log(
    `Wager Factory Contract Deployed to Address:", ${await wagerFactory.address}`
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
