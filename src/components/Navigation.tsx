import { Button } from "@/components/ui/button";
import { Search, Plus, Home, List } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">FindIt</span>
          </Link>
          
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link to="/browse">
              <Button 
                variant={isActive("/browse") ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Browse
              </Button>
            </Link>
            <Link to="/report">
              <Button 
                variant="hero" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Report Item
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Link to="/report">
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}