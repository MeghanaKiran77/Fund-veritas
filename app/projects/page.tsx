"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search, SlidersHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { ProjectCard } from "@/components/project-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import { OnboardingTooltip } from "@/components/onboarding-tooltip"

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    title: "EcoFarm: Sustainable Agriculture",
    creator: "Green Innovations",
    description: "A blockchain-based platform for sustainable farming practices and supply chain transparency.",
    category: "Agriculture",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 128,
    daysRemaining: 15,
    status: "verified",
    image: "/placeholder.svg?height=200&width=400&text=EcoFarm",
    tags: ["Sustainability", "Blockchain", "Agriculture"],
    creatorVerified: true,
    trending: true,
  },
  {
    id: "2",
    title: "Tech Innovate: AI Assistant",
    creator: "Future Tech Labs",
    description: "An AI-powered personal assistant that helps with daily tasks and productivity.",
    category: "Technology",
    fundingGoal: 75000,
    currentFunding: 68000,
    backers: 245,
    daysRemaining: 8,
    status: "funded",
    image: "/placeholder.svg?height=200&width=400&text=TechInnovate",
    tags: ["AI", "Productivity", "Technology"],
    creatorVerified: true,
  },
  {
    id: "3",
    title: "Community Garden Initiative",
    creator: "Urban Green Spaces",
    description: "Creating community gardens in urban areas to promote sustainability and community bonding.",
    category: "Community",
    fundingGoal: 25000,
    currentFunding: 12000,
    backers: 87,
    daysRemaining: 21,
    status: "milestone-pending",
    image: "/placeholder.svg?height=200&width=400&text=CommunityGarden",
    tags: ["Community", "Sustainability", "Urban"],
  },
  {
    id: "4",
    title: "Clean Water Project",
    creator: "Water Solutions",
    description: "Providing clean water solutions to communities in need through innovative filtration technology.",
    category: "Environment",
    fundingGoal: 60000,
    currentFunding: 15000,
    backers: 112,
    daysRemaining: 30,
    status: "unverified",
    image: "/placeholder.svg?height=200&width=400&text=CleanWater",
    tags: ["Water", "Environment", "Social Impact"],
  },
  {
    id: "5",
    title: "Educational VR Platform",
    creator: "Learn Immersive",
    description: "A virtual reality platform for immersive educational experiences across various subjects.",
    category: "Education",
    fundingGoal: 80000,
    currentFunding: 45000,
    backers: 178,
    daysRemaining: 18,
    status: "verified",
    image: "/placeholder.svg?height=200&width=400&text=EducationalVR",
    tags: ["Education", "VR", "Technology"],
    creatorVerified: true,
  },
  {
    id: "6",
    title: "Renewable Energy Storage",
    creator: "Green Power Solutions",
    description: "Developing efficient energy storage solutions for renewable energy sources.",
    category: "Energy",
    fundingGoal: 100000,
    currentFunding: 82000,
    backers: 310,
    daysRemaining: 5,
    status: "verified",
    image: "/placeholder.svg?height=200&width=400&text=RenewableEnergy",
    tags: ["Energy", "Sustainability", "Technology"],
    creatorVerified: true,
    trending: true,
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [showOnboarding, setShowOnboarding] = useState(true)

  // Get max price for slider
  const maxPrice = Math.max(...mockProjects.map((project) => project.fundingGoal))

  // Get unique categories with counts
  const categories = Array.from(new Set(mockProjects.map((project) => project.category))).map((category) => ({
    value: category.toLowerCase(),
    label: category,
    count: mockProjects.filter((project) => project.category === category).length,
  }))

  // Filter projects based on search, categories, and price range
  const filteredProjects = mockProjects.filter((project) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(project.category.toLowerCase())

    // Price range filter
    const matchesPriceRange = project.fundingGoal >= priceRange[0] && project.fundingGoal <= priceRange[1]

    // Tab filter
    let matchesTab = true
    if (activeTab === "trending") {
      matchesTab = project.trending === true
    } else if (activeTab === "newest") {
      // In a real app, you would check the creation date
      matchesTab = project.daysRemaining > 20
    } else if (activeTab === "ending-soon") {
      matchesTab = project.daysRemaining <= 10
    }

    return matchesSearch && matchesCategory && matchesPriceRange && matchesTab
  })

  // Close sidebar on window resize (for mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="container px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
          <span className="text-gradient">Explore</span> Projects
        </h1>
        <p className="text-muted-foreground">Discover innovative projects and support creators you believe in</p>
      </div>

      <div className="relative flex flex-col gap-8 md:flex-row">
        {/* Filter sidebar for desktop */}
        <div className="hidden md:block md:w-64">
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            maxPrice={maxPrice}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Mobile filter sidebar */}
        <div className="md:hidden">
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            maxPrice={maxPrice}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <OnboardingTooltip
                id="filter-button"
                title="Advanced Filtering"
                description="Click here to open the filter panel and refine your search with multiple categories and price ranges."
                position="bottom"
              >
                <Button variant="outline" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </OnboardingTooltip>
              <OnboardingTooltip
                id="sort-button"
                title="Sort Projects"
                description="Click here to sort projects by different criteria like funding amount, deadline, or popularity."
                position="bottom"
              >
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </OnboardingTooltip>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="my-12 text-center">
              <h3 className="mb-2 text-xl font-semibold">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategories([])
                  setPriceRange([0, maxPrice])
                  setActiveTab("all")
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
