import { ethers } from "hardhat";

// The address of the default Sablier admin
export const DEFAULT_SABLIER_ADMIN = "0xb1bEF51ebCA01EB12001a639bDBbFF6eEcA12B9F";

/**
 * Get the current chain ID from the network
 * @returns The current chain ID
 */
export async function getCurrentChainId(): Promise<number> {
  const network = await ethers.provider.getNetwork();
  return Number(network.chainId);
}

/**
 * Get the admin address for the current network
 * @returns The admin address for the current chain
 */
export async function getCurrentAdmin(): Promise<string> {
  return DEFAULT_SABLIER_ADMIN;
}

/**
 * Deploy a contract and wait for confirmation
 * @param contractName The name of the contract to deploy
 * @param args Constructor arguments
 * @returns The deployed contract instance
 */
export async function deployContract(contractName: string, args: any[] = []): Promise<any> {
  console.log(`📦 Deploying ${contractName}...`);
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(...args);
  console.log(`📍 ${contractName} deployed at: ${await contract.getAddress()}`);
  return contract;
}
