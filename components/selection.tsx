import { Check, ChevronDown } from "lucide-react"
import { useState } from "react";
import { cn } from "@/lib/utils";

const Selection = ({ defaultValue, values }: { defaultValue: number | string, values: number[] | string[] }) => {
    const [openSelection, setOpenSelection] = useState(false);
    return (
        <div className='relative w-full h-full'>
            <div onClick={() => setOpenSelection(!openSelection)} className='flex w-full bg-background items-center justify-between outline-none border border-input shadow-xs shadow-black/5 transition-shadow text-foreground h-8.5 px-2.5 text-xs gap-1 rounded-md min-w-[50px]'>
                <p className="min-w-1">{defaultValue}</p>
                <ChevronDown className='text-foreground/60 w-4 h-4' />
            </div>
            <div className={cn("absolute min-w-full z-50 top-10 bg-background overflow-hidden transition-all duration-200", { "max-h-[1000px]": openSelection, "max-h-0": !openSelection })} >
                <div className="p-1.5 border border-input rounded-md">
                    {values.map((item, index) => (
                        <div key={item} onClick={() => setOpenSelection(false)} className='flex items-center hover:bg-accent/50 cursor-pointer rounded-md gap-2.5 py-1.5 px-2 flex-shrink-0'>
                            <Check className={cn("text-primary w-4 h-4", index !== 0 && "opacity-0")} />
                            <span className='text-sm text-foreground text-nowrap'>{item}</span>
                        </div>))}
                </div>
            </div>
        </div >
    )
}

export default Selection;