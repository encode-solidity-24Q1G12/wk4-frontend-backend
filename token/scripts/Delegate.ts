import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient, parseEther, formatEther, toHex, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

// Try to run delegate after sending tokens to other addresses

async function main() {
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
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
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
