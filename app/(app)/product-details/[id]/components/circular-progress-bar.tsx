export const CircularProgressBar = ({ rating }: { rating: number }) => {
  return (
    <svg
      className="w-24 h-24 transform -rotate-90 scale-y-[-1]"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="rgb(229, 231, 235)"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="rgb(249, 115, 22)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(rating / 5) * 282.6} 282.6`}
        className="transition-all duration-300"
      />
    </svg>
  );
};
