import { Facebook, Github, Instagram, Linkedin, Sparkles, Twitter } from "lucide-react"
import Link from "next/link"
import { AnimatedGradientBorder } from "./animated-gradient-border"

export default function Footer() {
  return (
    <footer className="border-t border-purple-900/30 bg-background">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-700">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-gradient">FundVeritas</span>
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Building trust through milestones and decentralization in the crowdfunding space.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-purple-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-purple-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-purple-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-purple-400">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-purple-400">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link href="/create-project" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Create Project
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground transition-colors hover:text-purple-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-purple-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Developers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-muted-foreground transition-colors hover:text-purple-400">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <AnimatedGradientBorder className="mt-12 py-6" containerClassName="mt-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FundVeritas. All rights reserved.</p>
          </div>
        </AnimatedGradientBorder>
      </div>
    </footer>
  )
}
