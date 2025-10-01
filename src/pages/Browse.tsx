import { useState, useEffect } from "react";
import { ItemCard, ItemData } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [allItems, setAllItems] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems: ItemData[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        date: item.date,
        contactInfo: item.contact_info,
        status: item.status as "lost" | "found"
      }));

      setAllItems(formattedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error",
        description: "Failed to load items. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Loading items...</h3>
          </div>
        ) : filteredItems.length > 0 ? (
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