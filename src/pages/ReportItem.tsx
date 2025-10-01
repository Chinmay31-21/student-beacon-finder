import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ReportItem() {
  const [itemType, setItemType] = useState<"lost" | "found" | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    contactInfo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Books",
    "Clothing", 
    "Bags",
    "Keys",
    "Documents",
    "Jewelry",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemType) {
      toast({
        title: "Please select item type",
        description: "Choose whether you lost or found an item",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('items')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          date: formData.date,
          contact_info: formData.contactInfo,
          status: itemType
        });

      if (error) throw error;

      toast({
        title: "Item reported successfully!",
        description: `Your ${itemType} item has been added to the database.`,
        variant: "default"
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        date: "",
        contactInfo: ""
      });
      setItemType(null);

      // Navigate to browse page after short delay
      setTimeout(() => navigate('/browse'), 1500);
    } catch (error) {
      console.error('Error submitting item:', error);
      toast({
        title: "Error",
        description: "Failed to report item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">Report an Item</h1>
          <p className="text-lg text-muted-foreground">
            Help the community by reporting lost or found items
          </p>
        </div>

        {/* Item Type Selection */}
        <Card className="shadow-card mb-8 animate-scale-in">
          <CardHeader>
            <CardTitle>What would you like to report?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={itemType === "lost" ? "accent" : "outline"}
                size="lg"
                onClick={() => setItemType("lost")}
                className="h-20 flex flex-col gap-2"
              >
                <AlertCircle className="w-6 h-6" />
                I Lost Something
              </Button>
              <Button
                variant={itemType === "found" ? "secondary" : "outline"}
                size="lg"
                onClick={() => setItemType("found")}
                className="h-20 flex flex-col gap-2"
              >
                <CheckCircle className="w-6 h-6" />
                I Found Something
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        {itemType && (
          <Card className="shadow-card animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>
                  {itemType === "lost" ? "Lost Item Details" : "Found Item Details"}
                </CardTitle>
                <Badge 
                  variant={itemType === "lost" ? "destructive" : "default"}
                  className={itemType === "lost" ? "bg-gradient-accent" : "bg-gradient-secondary"}
                >
                  {itemType === "lost" ? "Lost" : "Found"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 13 Pro - Blue"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description including color, size, distinctive features..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    {itemType === "lost" ? "Last seen location" : "Found location"} *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Library, 2nd floor"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information *</Label>
                  <Input
                    id="contact"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  variant={itemType === "lost" ? "accent" : "secondary"}
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : itemType === "lost" ? "Report Lost Item" : "Report Found Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}