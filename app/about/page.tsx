import { Card, CardContent } from "@/components/ui/card"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"
import { GlowEffect } from "@/components/glow-effect"
import { CheckCircle, Heart, Shield, Sparkles, Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          <span className="text-gradient">About</span> FundVeritas
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Building trust through transparency and accountability in the crowdfunding space.
        </p>
      </div>

      <div className="mb-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="mb-6 text-muted-foreground">
            FundVeritas was founded with a simple yet powerful mission: to create a crowdfunding platform where trust,
            transparency, and accountability are built into the very foundation of the system.
          </p>
          <p className="mb-6 text-muted-foreground">
            We believe that by leveraging blockchain technology and implementing milestone-based funding, we can
            revolutionize the way creators and backers interact, reducing risk and increasing success rates for
            innovative projects across all categories.
          </p>
          <p className="text-muted-foreground">
            Our name, FundVeritas, combines "Fund" with "Veritas" (Latin for truth), reflecting our commitment to
            truthful, transparent funding that benefits both creators and backers.
          </p>
        </div>
        <GlowEffect>
          <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-xl">
            <Image
              src="/placeholder.svg?height=400&width=600&text=Our+Mission"
              alt="Our Mission"
              fill
              className="object-cover"
            />
          </div>
        </GlowEffect>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <AnimatedGradientBorder>
            <Card className="h-full border-0">
              <CardContent className="flex h-full flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/20">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Trust & Security</h3>
                <p className="text-muted-foreground">
                  We prioritize the security of funds and data, using blockchain technology to create immutable records
                  of all transactions and project milestones.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="h-full border-0">
              <CardContent className="flex h-full flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/20">
                  <Sparkles className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously explore new technologies and methodologies to improve the crowdfunding experience and
                  support groundbreaking projects across all industries.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="h-full border-0">
              <CardContent className="flex h-full flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/20">
                  <Heart className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Community</h3>
                <p className="text-muted-foreground">
                  We foster a supportive community where creators and backers can collaborate, share ideas, and help
                  each other succeed in bringing innovative projects to life.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Team</h2>

        <div className="grid gap-6 md:grid-cols-4">
          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128&text=JS"
                    alt="Jane Smith"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">Jane Smith</h3>
                <p className="mb-3 text-sm text-purple-400">CEO & Founder</p>
                <p className="text-sm text-muted-foreground">
                  Former fintech executive with 15+ years of experience in blockchain and financial technologies.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128&text=JD"
                    alt="John Doe"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">John Doe</h3>
                <p className="mb-3 text-sm text-purple-400">CTO</p>
                <p className="text-sm text-muted-foreground">
                  Blockchain architect and full-stack developer with experience building decentralized applications.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128&text=AJ"
                    alt="Alice Johnson"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">Alice Johnson</h3>
                <p className="mb-3 text-sm text-purple-400">Head of Operations</p>
                <p className="text-sm text-muted-foreground">
                  Operations expert with a background in project management and crowdfunding platforms.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128&text=MB"
                    alt="Michael Brown"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">Michael Brown</h3>
                <p className="mb-3 text-sm text-purple-400">Head of Security</p>
                <p className="text-sm text-muted-foreground">
                  Cybersecurity expert specializing in blockchain security and smart contract auditing.
                </p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Story</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <GlowEffect>
            <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-xl">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Our+Story"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </GlowEffect>
          <div>
            <p className="mb-4 text-muted-foreground">
              FundVeritas was born out of frustration with traditional crowdfunding platforms, where creators often
              disappeared after receiving funds and backers had little recourse when projects failed to deliver.
            </p>
            <p className="mb-4 text-muted-foreground">
              Our founders, having experienced both sides of the crowdfunding equation, saw an opportunity to use
              blockchain technology to create a more transparent and accountable system.
            </p>
            <p className="mb-4 text-muted-foreground">
              Launched in 2023, FundVeritas quickly gained traction among creators and backers who valued our
              milestone-based approach and commitment to transparency. Today, we're proud to have helped fund hundreds
              of innovative projects across technology, art, community initiatives, and more.
            </p>
            <p className="text-muted-foreground">
              As we continue to grow, our focus remains on creating the most trusted platform for bringing creative and
              innovative ideas to life through the power of community funding.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Impact</h2>

        <div className="grid gap-6 md:grid-cols-4">
          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mb-2 text-4xl font-bold text-gradient">$2.5M+</div>
                <p className="text-muted-foreground">Total Funds Raised</p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mb-2 text-4xl font-bold text-gradient">150+</div>
                <p className="text-muted-foreground">Successful Projects</p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mb-2 text-4xl font-bold text-gradient">5,000+</div>
                <p className="text-muted-foreground">Active Backers</p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>

          <AnimatedGradientBorder>
            <Card className="border-0 text-center">
              <CardContent className="p-6">
                <div className="mb-2 text-4xl font-bold text-gradient">92%</div>
                <p className="text-muted-foreground">Project Success Rate</p>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Join Our Community</h2>

        <AnimatedGradientBorder>
          <Card className="border-0">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <Users className="h-16 w-16 text-purple-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Become Part of the FundVeritas Family</h3>
              <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
                Whether you're a creator with a groundbreaking idea or a backer looking to support innovation, join our
                community today and experience the future of crowdfunding.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <AnimatedGradientBorder>
                  <Card className="border-0">
                    <CardContent className="flex items-center gap-3 p-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Create an account</span>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>

                <AnimatedGradientBorder>
                  <Card className="border-0">
                    <CardContent className="flex items-center gap-3 p-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Explore projects</span>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>

                <AnimatedGradientBorder>
                  <Card className="border-0">
                    <CardContent className="flex items-center gap-3 p-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Connect your wallet</span>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>

                <AnimatedGradientBorder>
                  <Card className="border-0">
                    <CardContent className="flex items-center gap-3 p-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Start funding or creating</span>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
              </div>
            </CardContent>
          </Card>
        </AnimatedGradientBorder>
      </div>
    </div>
  )
}
