import { ethers } from "hardhat";
import { getCurrentAdmin, deployContract } from "./helpers";

async function main() {
  console.log("🚀 Starting Sablier Flow deployment...");

  // Get the current network info
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const networkName = network.name;

  console.log(`🌐 Network: ${networkName} (Chain ID: ${chainId})`);

  // Get the admin address for this chain
  const adminAddress = await getCurrentAdmin();
  console.log(`👤 Admin address: ${adminAddress}`);

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`🔑 Deployer address: ${deployer.address}`);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    throw new Error("Deployer has no ETH balance");
  }

  try {
    // Deploy FlowNFTDescriptor
    console.log("\n📦 Deploying FlowNFTDescriptor...");
    const nftDescriptor = await deployContract("FlowNFTDescriptor");
    const nftDescriptorAddress = await nftDescriptor.getAddress();

    // Deploy SablierFlow
    console.log("\n📦 Deploying SablierFlow...");
    const sablierFlow = await deployContract("SablierFlow", [adminAddress, nftDescriptorAddress]);
    const sablierFlowAddress = await sablierFlow.getAddress();

    // Save deployment info
    const deploymentInfo = {
      network: networkName,
      chainId: chainId,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      admin: adminAddress,
      contracts: {
        FlowNFTDescriptor: {
          address: nftDescriptorAddress,
          constructorArgs: [],
        },
        SablierFlow: {
          address: sablierFlowAddress,
          constructorArgs: [adminAddress, nftDescriptorAddress],
        },
      },
    };

    // Write deployment info to file
    const fs = require("fs");
    const deploymentsDir = "./deployments";
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = `${deploymentsDir}/${networkName}-${chainId}.json`;
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n✅ Deployment completed successfully!");
    console.log("📋 Deployment Summary:");
    console.log(`   Network: ${networkName} (${chainId})`);
    console.log(`   FlowNFTDescriptor: ${nftDescriptorAddress}`);
    console.log(`   SablierFlow: ${sablierFlowAddress}`);
    console.log(`   Admin: ${adminAddress}`);
    console.log(`   Deployment info saved to: ${deploymentFile}`);

    // Verify contracts if on a supported network
    const supportedVerificationNetworks = [
      "mainnet",
      "sepolia",
      "arbitrum",
      "arbitrum_sepolia",
      "base",
      "base_sepolia",
      "polygon",
      "optimism",
      "optimism_sepolia",
    ];

    if (
      supportedVerificationNetworks.includes(networkName) &&
      (process.env.ETHERSCAN_API_KEY || process.env.ARBISCAN_API_KEY || process.env.BASESCAN_API_KEY)
    ) {
      console.log("\n🔍 Starting contract verification...");

      try {
        console.log("Verifying FlowNFTDescriptor...");
        await nftDescriptor.waitForDeployment();
        console.log("✅ FlowNFTDescriptor verification completed!");

        console.log("Verifying SablierFlow...");
        await sablierFlow.waitForDeployment();
        console.log("✅ SablierFlow verification completed!");

        console.log("✅ Contract verification completed!");
      } catch (error) {
        console.log("⚠️ Contract verification failed:", error);
      }
    } else {
      console.log(`\n⚠️ Skipping contract verification (network ${networkName} not supported or no API key provided)`);
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
