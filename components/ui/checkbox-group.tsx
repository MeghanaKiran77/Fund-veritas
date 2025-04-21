"use client"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface CheckboxGroupProps {
  options: { value: string; label: string; count?: number }[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  className?: string
}

export function CheckboxGroup({ options, selectedValues, onChange, className }: CheckboxGroupProps) {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-md border border-input px-3 py-2 transition-all hover:bg-accent",
            selectedValues.includes(option.value) && "border-purple-500 bg-purple-500/10",
          )}
          onClick={() => toggleOption(option.value)}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded border border-primary",
                selectedValues.includes(option.value) ? "bg-primary text-primary-foreground" : "bg-background",
              )}
            >
              {selectedValues.includes(option.value) && <CheckIcon className="h-3.5 w-3.5" />}
            </div>
            <span className="text-sm">{option.label}</span>
          </div>
          {option.count !== undefined && (
            <Badge variant="secondary" className="ml-auto">
              {option.count}
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}
