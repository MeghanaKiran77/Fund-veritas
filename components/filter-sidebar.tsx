"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"
import { AnimatedGradientBorder } from "./animated-gradient-border"

interface FilterSidebarProps {
  categories: { value: string; label: string; count: number }[]
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  maxPrice: number
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function FilterSidebar({
  categories,
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  isOpen,
  onClose,
  className,
}: FilterSidebarProps) {
  const formatPrice = (value: number) => `$${value.toLocaleString()}`

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-full max-w-xs transform overflow-y-auto bg-background p-4 transition-transform duration-300 ease-in-out md:relative md:inset-auto md:w-64 md:translate-x-0 md:overflow-visible ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${className}`}
    >
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <AnimatedGradientBorder>
        <Card className="mb-6 border-0 p-4">
          <h3 className="mb-3 flex items-center text-sm font-semibold">
            <Filter className="mr-2 h-4 w-4" /> Categories
          </h3>
          <CheckboxGroup options={categories} selectedValues={selectedCategories} onChange={onCategoriesChange} />
          {selectedCategories.length > 0 && (
            <Button
              variant="link"
              className="mt-2 h-auto p-0 text-xs text-purple-400"
              onClick={() => onCategoriesChange([])}
            >
              Clear selection
            </Button>
          )}
        </Card>
      </AnimatedGradientBorder>

      <AnimatedGradientBorder>
        <Card className="mb-6 border-0 p-4">
          <h3 className="mb-3 flex items-center text-sm font-semibold">
            <Filter className="mr-2 h-4 w-4" /> Funding Goal
          </h3>
          <div className="px-1 pt-6">
            <Slider
              defaultValue={priceRange}
              min={0}
              max={maxPrice}
              step={5000}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              showTooltip
              formatValue={formatPrice}
            />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </Card>
      </AnimatedGradientBorder>

      <AnimatedGradientBorder>
        <Card className="border-0 p-4">
          <h3 className="mb-3 flex items-center text-sm font-semibold">
            <Filter className="mr-2 h-4 w-4" /> Project Status
          </h3>
          <CheckboxGroup
            options={[
              { value: "verified", label: "Verified", count: 12 },
              { value: "unverified", label: "Unverified", count: 5 },
              { value: "funded", label: "Funded", count: 8 },
              { value: "milestone-pending", label: "Milestone Pending", count: 3 },
            ]}
            selectedValues={[]}
            onChange={() => {}}
          />
        </Card>
      </AnimatedGradientBorder>

      <div className="mt-6 flex justify-center md:hidden">
        <Button onClick={onClose}>Apply Filters</Button>
      </div>
    </div>
  )
}
