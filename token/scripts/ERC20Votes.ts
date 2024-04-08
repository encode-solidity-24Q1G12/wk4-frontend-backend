import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient, parseEther, formatEther, toHex, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const MINT_VALUE = parseEther("500");
const PROPOSALS = ["Dog", "Cat", "Fish"]

async function main() {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const contract = await viem.deployContract("MyToken");
  console.log(`Token contract deployed at ${contract.address}\n`);
  const mintTx = await contract.write.mint([
    deployer.account.address,
    MINT_VALUE]);
  await publicClient.waitForTransactionReceipt({ hash: mintTx });
  console.log(
    `Minted ${formatEther(MINT_VALUE)} units of MyToken to account ${
      deployer.account.address
    }\n`
  );
  const delegateTx = await contract.write.delegate([deployer.account.address], {
    account: deployer.account,
  });
  await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  const votesAfter = await contract.read.getVotes([deployer.account.address]);
  console.log(
    `Account ${
      deployer.account.address
    } has ${formatEther(votesAfter)} voting power after self delegating\n`
  );
  // DELEGATING END

  // ADDING PROPOSALS
  const lastBlockNumber = await publicClient.getBlockNumber();
  const tokenBallot = await viem.deployContract("TokenizedBallot",[PROPOSALS.map((prop) => toHex(prop, { size: 32 })),contract.address, lastBlockNumber])
  console.log(`Ballot contract deployed at ${tokenBallot.address}\n`);
  // ADDING PROPOSALS END


  // // CASTING VOTES BEGIN
  // const parameters = process.argv.slice(2);
  // if (!parameters || parameters.length < 2)
  //   throw new Error("Parameters not provided");
  // const contractAddress = parameters[0] as `0x${string}`;
  // if (!contractAddress) throw new Error("Contract address not provided");
  // if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
  //   throw new Error("Invalid contract address");
  // const proposalIndex = parameters[1];
  // if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");
  // console.log("Proposal selected: ");
  // // const publicClient = createPublicClient({
  // //   chain: sepolia,
  // //   transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  // // });
  // // const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  // const voter = createWalletClient({
  //   account,
  //   chain: sepolia,
  //   transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  // });
  // const proposal = (await publicClient.readContract({
  //   address: contractAddress,
  //   abi,
  //   functionName: "proposals",
  //   args: [BigInt(proposalIndex)],
  // })) as any[];
  // const name = hexToString(proposal[0], { size: 32 });
  // console.log("Voting to proposal", name);
  // console.log("Confirm? (Y/n)");
  // const stdin = process.openStdin();
  // stdin.addListener("data", async function (d) {
  //   if (d.toString().trim().toLowerCase() != "n") {
  //     const hash = await voter.writeContract({
  //       address: contractAddress,
  //       abi,
  //       functionName: "vote",
  //       args: [BigInt(proposalIndex)],
  //     });
  //     console.log("Transaction hash:", hash);
  //     console.log("Waiting for confirmations...");
  //     const receipt = await publicClient.waitForTransactionReceipt({ hash });
  //     console.log("Transaction confirmed");
  //   } else {
  //     console.log("Operation cancelled");
  //   }
  //   process.exit();
  // });
  // // CASTING VOTES END





  // const balanceBN = await contract.read.balanceOf([acc1.account.address]);
  // console.log(
  //   `Account ${
  //     acc1.account.address
  //   } has ${formatEther(balanceBN)} units of MyToken\n`
  // );
  // const votes = await contract.read.getVotes([acc1.account.address]);
  // console.log(
  //   `Account ${
  //     acc1.account.address
  //   } has ${votes} units of voting power before self delegating\n`
  // );
  // const delegateTx = await contract.write.delegate([acc1.account.address], {
  //   account: acc1.account,
  // });
  // await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  // const votesAfter = await contract.read.getVotes([acc1.account.address]);
  // console.log(
  //   `Account ${
  //     acc1.account.address
  //   } has ${formatEther(votesAfter)} voting power after self delegating\n`
  // );
  // const transferTx = await contract.write.transfer(
  //   [acc2.account.address, MINT_VALUE / 3n],
  //   {
  //     account: acc1.account,
  //   }
  // );
  // await publicClient.waitForTransactionReceipt({ hash: transferTx });
  // const votes1AfterTransfer = await contract.read.getVotes([
  //   acc1.account.address,
  // ]);
  // console.log(
  //   `Account ${
  //     acc1.account.address
  //   } has ${formatEther(votes1AfterTransfer)} voting power after transferring\n`
  // );

  // console.log("Proposals: ");
  // PROPOSALS.forEach((element, index) => {
  //   console.log(`Proposal N. ${index + 1}: ${element}`);
  // });

  // console.log("\nDeploying Ballot contract");
  // const ballotContract = await viem.deployContract("TokenizedBallot", [
  //   PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  // ]);

  // console.log("Ballot contract deployed to:", ballotContract.address);

  // console.log("Proposals: ");

  // for (let index = 0; index < PROPOSALS.length; index++) {
  //   const proposal = await ballotContract.read.proposals([BigInt(index)]);
  //   const name = hexToString(proposal[0], { size: 32 });
  //   console.log({ index, name, proposal })};




  // const votes2AfterTransfer = await contract.read.getVotes([
  //   acc2.account.address,
  // ]);
  // console.log(
  //   `Account ${
  //     acc2.account.address
  //   } has ${formatEther(votes2AfterTransfer)} voting power after receiving a transfer\n`
  // );
  // const lastBlockNumber = await publicClient.getBlockNumber();
  // for (let index = lastBlockNumber - 1n; index > 0n; index--) {
  //   const pastVotes = await contract.read.getPastVotes([
  //     acc1.account.address,
  //     index,
  //   ]);
  //   console.log(
  //     `Account ${
  //       acc1.account.address
  //     } had ${pastVotes.toString()} units of voting power at block ${index}\n`
  //   );
  // }
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
