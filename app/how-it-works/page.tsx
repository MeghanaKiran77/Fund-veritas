import { Card, CardContent } from "@/components/ui/card"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"
import { CheckCircle, Clock, Coins, FileCheck, Shield, Sparkles, Target, Users } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="container px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          <span className="text-gradient">How</span> It Works
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          FundVeritas uses blockchain technology to create a transparent, secure, and accountable crowdfunding platform
          that benefits both creators and backers.
        </p>
      </div>

      <div className="mb-16 grid gap-8 md:grid-cols-3">
        <AnimatedGradientBorder>
          <Card className="h-full border-0">
            <CardContent className="flex h-full flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/20">
                <Target className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Milestone-Based Funding</h3>
              <p className="text-muted-foreground">
                Funds are released in stages as project milestones are completed and verified, ensuring accountability
                and reducing risk for backers.
              </p>
            </CardContent>
          </Card>
        </AnimatedGradientBorder>

        <AnimatedGradientBorder>
          <Card className="h-full border-0">
            <CardContent className="flex h-full flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/20">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Smart Contract Security</h3>
              <p className="text-muted-foreground">
                All transactions are recorded on the blockchain, providing complete transparency, immutability, and
                automated milestone verification.
              </p>
            </CardContent>
          </Card>
        </AnimatedGradientBorder>

        <AnimatedGradientBorder>
          <Card className="h-full border-0">
            <CardContent className="flex h-full flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/20">
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold">KYC Verification</h3>
              <p className="text-muted-foreground">
                All project creators undergo a thorough verification process to ensure legitimacy and reduce the risk of
                fraudulent projects.
              </p>
            </CardContent>
          </Card>
        </AnimatedGradientBorder>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">The FundVeritas Process</h2>

        <div className="relative space-y-12 pl-8 before:absolute before:left-3 before:top-0 before:h-full before:w-[2px] before:bg-muted md:pl-0 md:before:left-1/2">
          <div className="relative md:flex md:items-center">
            <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-auto md:right-[calc(50%+1rem)] md:top-1/2 md:-translate-y-1/2">
              1
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right">
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center md:justify-end">
                      <Users className="mr-2 h-5 w-5 text-purple-400 md:ml-2 md:mr-0 md:order-2" />
                      <h3 className="text-xl font-bold md:order-1">Creator Registration</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Project creators register on the platform and complete KYC verification to establish their
                      identity and credibility.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>

          <div className="relative md:flex md:items-center">
            <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-[calc(50%+1rem)] md:top-1/2 md:-translate-y-1/2">
              2
            </div>
            <div className="md:w-1/2 md:ml-auto md:pl-12">
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center">
                      <FileCheck className="mr-2 h-5 w-5 text-purple-400" />
                      <h3 className="text-xl font-bold">Project Submission</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Creators submit their projects with detailed descriptions, funding goals, and clearly defined
                      milestones with specific deliverables and deadlines.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>

          <div className="relative md:flex md:items-center">
            <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-auto md:right-[calc(50%+1rem)] md:top-1/2 md:-translate-y-1/2">
              3
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right">
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center md:justify-end">
                      <Sparkles className="mr-2 h-5 w-5 text-purple-400 md:ml-2 md:mr-0 md:order-2" />
                      <h3 className="text-xl font-bold md:order-1">Smart Contract Deployment</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Once approved, a smart contract is deployed on the blockchain to manage the project's funding,
                      milestone verification, and fund distribution.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>

          <div className="relative md:flex md:items-center">
            <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-[calc(50%+1rem)] md:top-1/2 md:-translate-y-1/2">
              4
            </div>
            <div className="md:w-1/2 md:ml-auto md:pl-12">
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center">
                      <Coins className="mr-2 h-5 w-5 text-purple-400" />
                      <h3 className="text-xl font-bold">Backer Funding</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Backers browse projects and contribute funds, which are held in escrow by the smart contract until
                      milestone completion.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>

          <div className="relative md:flex md:items-center">
            <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-auto md:right-[calc(50%+1rem)] md:top-1/2 md:-translate-y-1/2">
              5
            </div>
            <div className="md:w-1/2 md:pr-12 md:text-right">
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center md:justify-end">
                      <Clock className="mr-2 h-5 w-5 text-purple-400 md:ml-2 md:mr-0 md:order-2" />
                      <h3 className="text-xl font-bold md:order-1">Milestone Completion</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Creators work on their projects and submit evidence of milestone completion, which is verified by
                      backers through the platform.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>

          <div className="relative md:flex md:items-center">
            <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-[calc(50%+1rem)] md:top-1/2 md:-translate-y-1/2">
              6
            </div>
            <div className="md:w-1/2 md:ml-auto md:pl-12">
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center">
                      <Coins className="mr-2 h-5 w-5 text-purple-400" />
                      <h3 className="text-xl font-bold">Fund Release</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Upon milestone verification, the smart contract automatically releases the corresponding portion
                      of funds to the creator, ensuring transparent and fair distribution.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Benefits for Creators and Backers</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <AnimatedGradientBorder>
            <Card className="h-full border-0">
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-bold">For Creators</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Access to funding without giving up equity or control</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Predictable fund releases tied to project progress</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Direct engagement with backers and potential customers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Blockchain-verified project history builds credibility</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Lower platform fees compared to traditional crowdfunding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="h-full border-0">
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-bold">For Backers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Reduced risk through milestone-based funding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Transparency in project progress and fund usage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Ability to verify creator identity through KYC</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Potential for partial refunds if projects fail to meet milestones</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                    <span>Direct communication with project creators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <AnimatedGradientBorder>
            <Card className="border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">How are funds protected?</h3>
                <p className="text-muted-foreground">
                  Funds are held in smart contracts and only released when milestones are verified by backers. If a
                  project fails to meet its milestones, remaining funds can be returned to backers.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">What fees does FundVeritas charge?</h3>
                <p className="text-muted-foreground">
                  FundVeritas charges a 5% platform fee on successfully funded projects, significantly lower than
                  traditional crowdfunding platforms. There are also small blockchain transaction fees.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">How are milestones verified?</h3>
                <p className="text-muted-foreground">
                  Creators submit evidence of milestone completion, which is reviewed by backers. A majority vote from
                  backers is required to release the funds for that milestone.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">What happens if a project fails?</h3>
                <p className="text-muted-foreground">
                  If a project fails to meet its milestones, backers can vote to either extend the deadline or request a
                  refund of the remaining funds allocated to incomplete milestones.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">Do I need cryptocurrency to use FundVeritas?</h3>
                <p className="text-muted-foreground">
                  No, you can fund projects using traditional payment methods. We handle the blockchain integration
                  behind the scenes, though you'll need to connect a wallet for receiving funds as a creator.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">How is FundVeritas different from other platforms?</h3>
                <p className="text-muted-foreground">
                  FundVeritas combines blockchain transparency with milestone-based funding to create a more secure and
                  accountable crowdfunding experience for both creators and backers.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </div>
      </div>
    </div>
  )
}
