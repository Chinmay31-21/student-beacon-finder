import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  onClick?: () => void;
}

export function CategoryCard({ icon: Icon, title, count, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="shadow-card hover:shadow-floating transition-all duration-200 hover:scale-105 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-card-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{count} items</p>
      </CardContent>
    </Card>
  );
}