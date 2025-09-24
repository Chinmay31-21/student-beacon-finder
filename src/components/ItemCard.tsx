import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User } from "lucide-react";

export interface ItemData {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contactInfo: string;
  status: "lost" | "found";
  image?: string;
}

interface ItemCardProps {
  item: ItemData;
  onContact?: (item: ItemData) => void;
}

export function ItemCard({ item, onContact }: ItemCardProps) {
  return (
    <Card className="shadow-card hover:shadow-floating transition-all duration-200 hover:scale-105 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-2">
            {item.title}
          </CardTitle>
          <Badge 
            variant={item.status === "lost" ? "destructive" : "default"}
            className={item.status === "lost" ? "bg-gradient-accent" : "bg-gradient-secondary"}
          >
            {item.status === "lost" ? "Lost" : "Found"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{item.date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Category: {item.category}</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onContact?.(item)}
          variant={item.status === "lost" ? "accent" : "secondary"}
          size="sm"
          className="w-full mt-4"
        >
          Contact {item.status === "lost" ? "Owner" : "Finder"}
        </Button>
      </CardContent>
    </Card>
  );
}