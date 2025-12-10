import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
    rating: number;
    outOf?: number;
}

export function Rating({ rating, outOf = 5 }: RatingProps) {
    const stars = [];
    let ratingLeft = rating;

    for (let i = 1; i <= 5; i++) {
        if (ratingLeft >= 1 || ratingLeft <= 0) {
            stars.push(
                <Star key={i} className={cn("w-4 h-4", ratingLeft <= 0 ? "text-input" : "text-yellow-400")} fill={ratingLeft <= 0 ? "none" : "currentColor"} />,
            );
            ratingLeft -= 1;
        }
        else if (ratingLeft > 0 && ratingLeft < 1) {
            const percentage = Math.min(ratingLeft, 1) * 100;
            stars.push(
                <div className="relative w-4 h-4" key={i}>
                    <Star className="w-4 h-4 text-input" fill="none" />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${percentage}%` }}>
                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    </div>
                </div>,
            );
            ratingLeft = 0;
        }
    }
    return <div className="flex items-center gap-1">{stars}</div>;
}