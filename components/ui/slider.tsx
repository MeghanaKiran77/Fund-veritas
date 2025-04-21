"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showTooltip?: boolean
    formatValue?: (value: number) => string
  }
>(({ className, showTooltip = false, formatValue = (v) => v.toString(), ...props }, ref) => {
  const [hovering, setHovering] = useState(false)
  const [localValue, setLocalValue] = useState(props.defaultValue || props.value || [0])

  React.useEffect(() => {
    if (props.value) {
      setLocalValue(props.value)
    }
  }, [props.value])

  const handleValueChange = (newValue: number[]) => {
    setLocalValue(newValue)
    if (props.onValueChange) {
      props.onValueChange(newValue)
    }
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-purple-700 to-purple-500" />
      </SliderPrimitive.Track>
      {localValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            data-value={value}
          />
          {showTooltip && hovering && (
            <div
              className="absolute top-0 -translate-x-1/2 -translate-y-full rounded bg-purple-700 px-2 py-1 text-xs text-white"
              style={{ left: `calc(${(value - (props.min || 0)) / ((props.max || 100) - (props.min || 0))} * 100%)` }}
            >
              {formatValue(value)}
            </div>
          )}
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

import { useState } from "react"

export { Slider }
