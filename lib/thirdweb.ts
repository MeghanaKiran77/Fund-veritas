import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import { Sepolia } from "@thirdweb-dev/chains"

// Initialize the SDK with the private key
export const initializeThirdwebSDK = () => {
  const privateKey = process.env.THIRDWEB_PRIVATE_KEY

  if (!privateKey) {
    throw new Error("Missing THIRDWEB_PRIVATE_KEY environment variable")
  }

  // Initialize the SDK with the private key on the Sepolia testnet
  const sdk = ThirdwebSDK.fromPrivateKey(privateKey, Sepolia)
  return sdk
}

// Deploy a new crowdfunding contract
export const deployFundingContract = async (
  projectName: string,
  creatorAddress: string,
  fundingGoal: number,
  deadline: number,
  milestones: { title: string; description: string; amount: number; deadline: number }[],
) => {
  try {
    const sdk = initializeThirdwebSDK()

    // Deploy the contract from the factory
    const contractAddress = await sdk.deployer.deployContractFromUri(
      "ipfs://QmXLJAJg4JzfqUQKNjd9xGYrS1UPNpGUQrNPGZjKVQgvjY", // Replace with your actual contract URI
      [
        projectName,
        creatorAddress,
        fundingGoal,
        deadline,
        milestones.map((m) => ({
          title: m.title,
          description: m.description,
          amount: m.amount,
          deadline: m.deadline,
          completed: false,
        })),
      ],
    )

    return contractAddress
  } catch (error) {
    console.error("Error deploying contract:", error)
    throw error
  }
}

// Contribute to a project
export const contributeToProject = async (contractAddress: string, amount: number) => {
  try {
    const sdk = initializeThirdwebSDK()
    const contract = await sdk.getContract(contractAddress)

    // Call the contribute function
    const tx = await contract.call("contribute", [], { value: amount })
    return tx
  } catch (error) {
    console.error("Error contributing to project:", error)
    throw error
  }
}

// Complete a milestone
export const completeMilestone = async (contractAddress: string, milestoneIndex: number) => {
  try {
    const sdk = initializeThirdwebSDK()
    const contract = await sdk.getContract(contractAddress)

    // Call the completeMilestone function
    const tx = await contract.call("completeMilestone", [milestoneIndex])
    return tx
  } catch (error) {
    console.error("Error completing milestone:", error)
    throw error
  }
}

// Get project details
export const getProjectDetails = async (contractAddress: string) => {
  try {
    const sdk = initializeThirdwebSDK()
    const contract = await sdk.getContract(contractAddress)

    // Call various view functions to get project details
    const creator = await contract.call("creator")
    const fundingGoal = await contract.call("fundingGoal")
    const deadline = await contract.call("deadline")
    const totalFunds = await contract.call("totalFunds")
    const milestoneCount = await contract.call("getMilestoneCount")

    // Get all milestones
    const milestones = []
    for (let i = 0; i < milestoneCount; i++) {
      const milestone = await contract.call("milestones", [i])
      milestones.push(milestone)
    }

    return {
      creator,
      fundingGoal,
      deadline,
      totalFunds,
      milestones,
    }
  } catch (error) {
    console.error("Error getting project details:", error)
    throw error
  }
}
