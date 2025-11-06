import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";

interface SolutionCardProps {
  title: string;
  description: string;
  badge: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  buttonIcon?: ReactNode;
  onButtonClick?: () => void;
}

export function SolutionCard({
  title,
  description,
  badge,
  buttonText,
  buttonVariant = "default",
  buttonIcon,
  onButtonClick
}: SolutionCardProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (onButtonClick) {
      setIsClicked(true);
      onButtonClick();
      setTimeout(() => setIsClicked(false), 300);
    }
  };

  return (
    <Card className="p-6 shadow-sm border-border rounded-2xl hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3>{title}</h3>
        <Badge variant="secondary" className="rounded-lg px-3 py-1">
          {badge}
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <Button 
        variant={buttonVariant} 
        className={`w-full rounded-xl transition-all duration-200 ${
          buttonVariant === "default" 
            ? "hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md bg-primary hover:bg-[#1ab386]" 
            : "hover:bg-accent active:scale-[0.98] border-primary text-primary hover:text-primary/90"
        } ${isClicked ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={handleClick}
        disabled={!onButtonClick}
      >
        {buttonText}
        {buttonIcon}
      </Button>
    </Card>
  );
}
