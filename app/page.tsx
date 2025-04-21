import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Shield, Sparkles, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"
import { GlowEffect } from "@/components/glow-effect"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0 bg-[url('/mesh-bg.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 z-0 bg-gradient-radial from-purple-900/20 via-background to-background"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col space-y-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                <span className="text-gradient glow-text">Launch or Fund</span> Verified Projects
              </h1>
              <p className="text-xl text-gray-300">Build trust through milestones and decentralization.</p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild size="lg" variant="glow" className="font-semibold">
                  <Link href="/projects">
                    Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-semibold">
                  <Link href="/create-project">Create your Project</Link>
                </Button>
              </div>
            </div>
            <GlowEffect className="hidden md:block" size="lg">
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Transparent+Crowdfunding"
                  alt="Crowdfunding Platform"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </GlowEffect>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-10 left-[10%] h-20 w-20 animate-float rounded-full bg-purple-600/20 backdrop-blur-xl"></div>
        <div
          className="absolute right-[15%] top-20 h-16 w-16 animate-float rounded-full bg-purple-600/20 backdrop-blur-xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-[20%] right-[5%] h-24 w-24 animate-float rounded-full bg-purple-600/20 backdrop-blur-xl"
          style={{ animationDelay: "2s" }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="text-gradient">Why Choose</span> FundVeritas?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              Our platform leverages blockchain technology to ensure transparency, security, and trust in the
              crowdfunding process.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <AnimatedGradientBorder hoverEffect>
              <Card className="h-full border-0">
                <CardContent className="p-6">
                  <Target className="mb-4 h-12 w-12 text-purple-400" />
                  <h3 className="mb-2 text-xl font-bold">Milestone-based Funding</h3>
                  <p className="text-muted-foreground">
                    Funds are released in stages as project milestones are completed and verified, ensuring
                    accountability.
                  </p>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>

            <AnimatedGradientBorder hoverEffect>
              <Card className="h-full border-0">
                <CardContent className="p-6">
                  <Shield className="mb-4 h-12 w-12 text-purple-400" />
                  <h3 className="mb-2 text-xl font-bold">Smart Contract Transparency</h3>
                  <p className="text-muted-foreground">
                    All transactions are recorded on the blockchain, providing complete transparency and immutability.
                  </p>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>

            <AnimatedGradientBorder hoverEffect>
              <Card className="h-full border-0">
                <CardContent className="p-6">
                  <CheckCircle className="mb-4 h-12 w-12 text-purple-400" />
                  <h3 className="mb-2 text-xl font-bold">KYC-Verified Projects</h3>
                  <p className="text-muted-foreground">
                    All project creators undergo a thorough verification process to ensure legitimacy and reduce fraud.
                  </p>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0 bg-[url('/mesh-bg.png')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-purple-950/20 to-background"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="text-gradient">How It</span> Works
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              FundVeritas makes crowdfunding transparent and secure in three simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="absolute -right-4 top-8 hidden h-1 w-full bg-gradient-to-r from-purple-600 to-transparent md:block"></div>
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/50">
                      <span className="text-2xl font-bold">1</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">Create Project</h3>
                    <p className="text-muted-foreground">
                      Define your project, set funding goals, and create transparent milestones for backers to track.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -right-4 top-8 hidden h-1 w-[calc(100%+2rem)] bg-gradient-to-r from-transparent via-purple-600 to-transparent md:block"></div>
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/50">
                      <span className="text-2xl font-bold">2</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">Get Funded</h3>
                    <p className="text-muted-foreground">
                      Receive funds through secure smart contracts that automatically manage milestone-based releases.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-8 hidden h-1 w-full bg-gradient-to-l from-purple-600 to-transparent md:block"></div>
              <AnimatedGradientBorder>
                <Card className="border-0">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/50">
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">Deliver Results</h3>
                    <p className="text-muted-foreground">
                      Complete milestones to unlock funding and keep backers updated with transparent progress tracking.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="text-gradient">Trusted</span> Platform
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              Join thousands of creators and backers on our secure, transparent crowdfunding platform.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatedGradientBorder>
              <Card className="border-0 text-center">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-4xl font-bold text-gradient">$2.5M+</h3>
                  <p className="text-muted-foreground">Total Funds Raised</p>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>

            <AnimatedGradientBorder>
              <Card className="border-0 text-center">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-4xl font-bold text-gradient">150+</h3>
                  <p className="text-muted-foreground">Successful Projects</p>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>

            <AnimatedGradientBorder>
              <Card className="border-0 text-center">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-4xl font-bold text-gradient">5,000+</h3>
                  <p className="text-muted-foreground">Active Backers</p>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>

            <AnimatedGradientBorder>
              <Card className="border-0 text-center">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-4xl font-bold text-gradient">100%</h3>
                  <p className="text-muted-foreground">Secure Transactions</p>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0 bg-purple-gradient opacity-90"></div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <Sparkles className="mx-auto mb-6 h-12 w-12 text-white" />
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to Start Your Project?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-white/90">
              Join our community of innovative creators and supportive backers to bring your ideas to life with
              transparency and trust.
            </p>
            <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent font-semibold text-white hover:bg-white/10"
              >
                <Link href="/projects">Explore Projects</Link>
              </Button>
              <Button asChild size="lg" className="bg-white font-semibold text-purple-700 hover:bg-white/90">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
