import { Injectable } from '@nestjs/common';
import { createPublicClient, createWalletClient, formatEther, http } from 'viem';
import * as chains from "viem/chains";
import * as tokenJson from './assets/MyToken.json';


@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: chains.sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
    this.walletClient = createWalletClient({
      chain: chains.sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
      key: process.env.PRIVATE_KEY
    });
  }
  getHello(): string {
    return 'Hello World!';
  }
  getContractAddress(): string {
    return "0x93998388D33d05266f00f3B6fc579a37fBC8994b";
  }

  async getTokenName(): Promise<any> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name;
  }

  async getTotalSupply() {
    const totalSupply = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: "totalSupply"
    });
    return formatEther(totalSupply as bigint);
  }

  async getTokenBalance(address: string) {
    const tokenBalance = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: "balanceOf",
      args: [address],
    });
    return formatEther(tokenBalance as bigint)
  }

  async getTransactionReceipt(hash: string) {
    const transactionReceipt = await this.publicClient.getTransactionReceipt({hash});
    transactionReceipt.blockNumber = transactionReceipt.blockNumber.toString();
    transactionReceipt.gasUsed = transactionReceipt.gasUsed.toString();
    transactionReceipt.cumulativeGasUsed = transactionReceipt.cumulativeGasUsed.toString();
    transactionReceipt.transactionIndex = transactionReceipt.transactionIndex.toString();
    transactionReceipt.effectiveGasPrice = transactionReceipt.effectiveGasPrice.toString();
    transactionReceipt.logs = transactionReceipt.logs.toString();
    console.log({transactionReceipt})

    return transactionReceipt;
  }

  getServerWalletAddress() {
    const [address] = this.walletClient.getAddresses();
    return address;
  }
  checkMinterRole(address: string) {
    throw new Error('Method not implemented.');
  }
  mintTokens(address: any) {
    return `Minting tokens to ${address}`;
  }
}
