import { Card } from "@/components/ui/card"
import { AnimatedGradientBorder } from "./animated-gradient-border"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

interface SmartContractPreviewProps {
  projectName: string
  fundingGoal: number
  milestones: { title: string; fundingPercentage: number }[]
  deadline: string
  creatorAddress?: string
}

export function SmartContractPreview({
  projectName,
  fundingGoal,
  milestones,
  deadline,
  creatorAddress = "0x0000...0000",
}: SmartContractPreviewProps) {
  return (
    <TooltipProvider>
      <AnimatedGradientBorder>
        <Card className="border-0 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Smart Contract Preview</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This is a preview of the smart contract that will be deployed on the blockchain when you create your
                  project. The contract will handle the funding, milestone releases, and refunds automatically.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="rounded-md bg-black p-4 font-mono text-xs text-purple-300">
            <div className="mb-4">
              <span className="text-purple-400">// SPDX-License-Identifier: MIT</span>
              <br />
              <span className="text-blue-400">pragma solidity</span> ^0.8.17;
              <br />
              <br />
              <span className="text-blue-400">contract</span>{" "}
              <span className="text-green-400">{projectName.replace(/[^a-zA-Z0-9]/g, "")}Funding</span> {"{"}
            </div>

            <div className="mb-2 pl-4">
              <span className="text-blue-400">address public</span> creator ={" "}
              <span className="text-orange-400">{creatorAddress}</span>;
              <br />
              <span className="text-blue-400">uint256 public</span> fundingGoal ={" "}
              <span className="text-orange-400">{fundingGoal} ether</span>;
              <br />
              <span className="text-blue-400">uint256 public</span> deadline ={" "}
              <span className="text-orange-400">
                {new Date(deadline).getTime() / 1000} <span className="text-purple-400">// {deadline}</span>
              </span>
              ;
              <br />
              <br />
              <span className="text-blue-400">struct</span> Milestone {"{"}
              <br />
              <span className="pl-4">
                <span className="text-blue-400">string</span> title;
                <br />
                <span className="text-blue-400">uint256</span> fundingPercentage;
                <br />
                <span className="text-blue-400">bool</span> isCompleted;
                <br />
              </span>
              {"}"}
              <br />
              <br />
              <span className="text-blue-400">Milestone[] public</span> milestones;
              <br />
              <br />
              <span className="text-blue-400">constructor</span>() {"{"}
              <br />
              <div className="pl-4">
                {milestones.map((milestone, index) => (
                  <div key={index}>
                    milestones.<span className="text-yellow-400">push</span>( Milestone({"{"}
                    <br />
                    <span className="pl-4">
                      title: <span className="text-orange-400">"{milestone.title}"</span>,
                      <br />
                      fundingPercentage: <span className="text-orange-400">{milestone.fundingPercentage}</span>,
                      <br />
                      isCompleted: <span className="text-orange-400">false</span>
                      <br />
                    </span>
                    {"}"}));
                  </div>
                ))}
              </div>
              {"}"}
              <br />
              <br />
              <span className="text-blue-400">function</span> <span className="text-yellow-400">contribute</span>(){" "}
              <span className="text-blue-400">public payable</span> {"{"}
              <br />
              <span className="pl-4">
                <span className="text-purple-400">// Contribution logic</span>
              </span>
              <br />
              {"}"}
              <br />
              <br />
              <span className="text-blue-400">function</span> <span className="text-yellow-400">completeMilestone</span>
              (<span className="text-blue-400">uint256</span> _index) <span className="text-blue-400">public</span>{" "}
              {"{"}
              <br />
              <span className="pl-4">
                <span className="text-purple-400">// Milestone completion logic</span>
              </span>
              <br />
              {"}"}
            </div>

            <div>{"}"}</div>
          </div>
        </Card>
      </AnimatedGradientBorder>
    </TooltipProvider>
  )
}
