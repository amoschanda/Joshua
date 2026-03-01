import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-zinc-900", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center text-zinc-900",
        caption_label: "text-sm font-medium text-zinc-900",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 hover:bg-zinc-100 rounded-md border border-zinc-300 inline-flex items-center justify-center text-zinc-900"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-zinc-500 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-yellow-100 [&:has([aria-selected].day-outside)]:bg-yellow-50",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          "h-8 w-8 p-0 font-normal rounded-md hover:bg-zinc-100 inline-flex items-center justify-center text-zinc-900 aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#FFD700] text-black hover:bg-[#E6C200] hover:text-black focus:bg-[#FFD700] focus:text-black font-semibold",
        day_today: "bg-zinc-200 text-zinc-900 font-semibold",
        day_outside:
          "day-outside text-zinc-400 aria-selected:bg-yellow-50 aria-selected:text-zinc-500",
        day_disabled: "text-zinc-300 opacity-50",
        day_range_middle:
          "aria-selected:bg-yellow-100 aria-selected:text-zinc-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4 text-zinc-900", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4 text-zinc-900", className)} {...props} />
        ),
      }}
      {...props} />
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
