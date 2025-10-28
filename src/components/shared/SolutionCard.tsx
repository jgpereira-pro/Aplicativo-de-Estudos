import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

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
  return (
    <Card className="p-6 shadow-sm border-border rounded-2xl">
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
            ? "hover:scale-103 active:scale-97 shadow-sm hover:shadow-md" 
            : "hover:bg-accent active:scale-98"
        }`}
        onClick={onButtonClick}
      >
        {buttonText}
        {buttonIcon}
      </Button>
    </Card>
  );
}
