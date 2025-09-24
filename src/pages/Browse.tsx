import { useState } from "react";
import { ItemCard, ItemData } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

// Mock data - in a real app, this would come from an API
const allItems: ItemData[] = [
  {
    id: "1",
    title: "iPhone 13 Pro - Blue",
    description: "Found in the library on the second floor near the study tables. Has a clear case with some scratches.",
    category: "Electronics",
    location: "Main Library",
    date: "2024-01-15",
    contactInfo: "library@university.edu",
    status: "found"
  },
  {
    id: "2", 
    title: "MacBook Pro with Stickers",
    description: "Lost silver MacBook Pro 13-inch with university and coding stickers. Very important for studies!",
    category: "Electronics",
    location: "Computer Science Building",
    date: "2024-01-14",
    contactInfo: "student@university.edu",
    status: "lost"
  },
  {
    id: "3",
    title: "Black Jansport Backpack",
    description: "Black backpack with water bottle and textbooks inside. Found near the cafeteria.",
    category: "Bags",
    location: "Student Union",
    date: "2024-01-13",
    contactInfo: "security@university.edu",
    status: "found"
  },
  {
    id: "4",
    title: "Chemistry Textbook",
    description: "Organic Chemistry textbook, 3rd edition. Has highlighting and notes inside.",
    category: "Books",
    location: "Science Building",
    date: "2024-01-12",
    contactInfo: "science@university.edu",
    status: "found"
  },
  {
    id: "5",
    title: "Blue Nike Hoodie",
    description: "Lost blue Nike hoodie size M. Has a small stain on the front pocket.",
    category: "Clothing",
    location: "Gymnasium",
    date: "2024-01-11",
    contactInfo: "athletics@university.edu",
    status: "lost"
  },
  {
    id: "6",
    title: "Car Keys with Subaru Keychain",
    description: "Found car keys with Subaru keychain and student ID attached.",
    category: "Keys",
    location: "Parking Lot B",
    date: "2024-01-10",
    contactInfo: "parking@university.edu",
    status: "found"
  }
];

const categories = [
  "All Categories",
  "Electronics",
  "Books", 
  "Clothing",
  "Bags",
  "Keys",
  "Documents",
  "Jewelry",
  "Other"
];

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">("all");

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleContact = (item: ItemData) => {
    alert(`Contact: ${item.contactInfo}`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse Items</h1>
          <p className="text-lg text-muted-foreground">
            Search through lost and found items to find what you're looking for
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg shadow-card p-6 mb-8 animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="flex-1"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "lost" ? "accent" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("lost")}
                className="flex-1"
              >
                Lost
              </Button>
              <Button
                variant={statusFilter === "found" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("found")}
                className="flex-1"
              >
                Found
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing {filteredItems.length} items
            </span>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-gradient-accent text-white">
              {allItems.filter(item => item.status === "lost").length} Lost
            </Badge>
            <Badge variant="outline" className="bg-gradient-secondary text-white">
              {allItems.filter(item => item.status === "found").length} Found
            </Badge>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onContact={handleContact}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}