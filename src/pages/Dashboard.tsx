import { Button } from "@/components/ui/button";
import { ItemCard, ItemData } from "@/components/ItemCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Book, 
  Shirt, 
  Backpack, 
  Key, 
  Search,
  TrendingUp
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

// Mock data
const recentItems: ItemData[] = [
  {
    id: "1",
    title: "iPhone 13 Pro - Blue",
    description: "Found in the library on the second floor near the study tables",
    category: "Electronics",
    location: "Main Library",
    date: "2024-01-15",
    contactInfo: "library@university.edu",
    status: "found"
  },
  {
    id: "2", 
    title: "MacBook Pro with Stickers",
    description: "Lost silver MacBook Pro 13-inch with university and coding stickers",
    category: "Electronics",
    location: "Computer Science Building",
    date: "2024-01-14",
    contactInfo: "student@university.edu",
    status: "lost"
  },
  {
    id: "3",
    title: "Black Jansport Backpack",
    description: "Black backpack with water bottle and textbooks inside",
    category: "Bags",
    location: "Student Union",
    date: "2024-01-13",
    contactInfo: "security@university.edu",
    status: "found"
  }
];

const categories = [
  { icon: Smartphone, title: "Electronics", count: 12 },
  { icon: Book, title: "Books", count: 8 },
  { icon: Shirt, title: "Clothing", count: 6 },
  { icon: Backpack, title: "Bags", count: 9 },
  { icon: Key, title: "Keys", count: 4 },
];

export default function Dashboard() {
  const handleContact = (item: ItemData) => {
    // In a real app, this would open a contact modal or redirect to contact page
    alert(`Contact: ${item.contactInfo}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-hero text-white py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(33, 118, 210, 0.8), rgba(0, 150, 136, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find What You've Lost
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your campus community helping students reunite with their belongings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Search className="w-5 h-5 mr-2" />
                  Report Lost Item
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Browse Found Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                icon={category.icon}
                title={category.title}
                count={category.count}
                onClick={() => {/* Navigate to category */}}
              />
            ))}
          </div>
        </section>

        {/* Recent Items Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Recent Activity</h2>
            <Link to="/browse">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onContact={handleContact}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}