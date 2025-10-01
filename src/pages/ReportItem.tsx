import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Lightbulb, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Validation schema
const itemSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z.string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  category: z.string()
    .min(1, { message: "Category is required" }),
  location: z.string()
    .max(200, { message: "Location must be less than 200 characters" })
    .optional(),
  date: z.string()
    .min(1, { message: "Date is required" }),
  contactInfo: z.string()
    .trim()
    .min(1, { message: "Contact information is required" })
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
});

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    score: number;
    suggestions: string[];
    strengths: string[];
    missingDetails: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Prediction AI Mode ---
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

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

    // Clear previous errors
    setErrors({});

    // Validate form data
    try {
      itemSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: "Please check all required fields",
          variant: "destructive"
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('items')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: formData.location.trim() || null,
          date: formData.date,
          contact_info: formData.contactInfo.trim(),
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
      setErrors({});
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

  // Debounced AI analysis
  useEffect(() => {
    if (!formData.title && !formData.description) {
      setAiAnalysis(null);
      return;
    }

    const timer = setTimeout(() => {
      analyzeDetails();
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.title, formData.description, itemType]);

  const analyzeDetails = async () => {
    if (!itemType || (!formData.title && !formData.description)) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-item-details', {
        body: {
          title: formData.title,
          description: formData.description,
          itemType
        }
      });

      if (error) throw error;
      setAiAnalysis(data);
    } catch (error) {
      console.error('Error analyzing details:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Prediction AI Mode function ---
  const handlePredictDescription = async () => {
    setIsPredicting(true);
    setPrediction(null);

    try {
      // You can use the same analyze-item-details function but with a different prompt, or create a dedicated endpoint
      // For demonstration, we'll use analyze-item-details and extract a "suggested description"
      const { data, error } = await supabase.functions.invoke('analyze-item-details', {
        body: {
          title: formData.title,
          description: formData.description,
          itemType,
          mode: "predict" // You can handle this in your backend prompt if needed
        }
      });

      if (error) throw error;
      // If the backend returns a "predictedDescription", use it; otherwise, fallback to suggestions.
      setPrediction(data.predictedDescription || data.suggestions?.join(" ") || null);
      toast({
        title: "AI Prediction Complete",
        description: "Check the suggested description below.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error predicting description:', error);
      toast({
        title: "AI Prediction Error",
        description: "Could not generate a predicted description.",
        variant: "destructive"
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Autofill handler: fills the description field with the prediction
  const handleAutofill = () => {
    if (prediction) {
      setFormData(prev => ({ ...prev, description: prediction }));
      setPrediction(null);
      toast({
        title: "Description Autofilled",
        description: "You can further edit or submit your report.",
        variant: "default"
      });
    }
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
                    maxLength={200}
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description including color, size, distinctive features..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    maxLength={1000}
                    required
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}

                  {/* Prediction AI Mode UI */}
                  <div className="flex flex-col md:flex-row gap-2 mt-2">
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPredicting || !formData.title}
                      onClick={handlePredictDescription}
                      className="flex items-center gap-2"
                    >
                      <Wand2 className="w-4 h-4" />
                      {isPredicting ? "Predicting..." : "Suggest Description"}
                    </Button>
                    {prediction && (
                      <Button 
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAutofill}
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Autofill Description
                      </Button>
                    )}
                  </div>
                  {prediction && (
                    <div className="mt-2 p-2 rounded-md bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                      <strong>AI Suggested Description:</strong>
                      <div className="mt-1 whitespace-pre-line">{prediction}</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
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
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive">{errors.date}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    {itemType === "lost" ? "Last seen location" : "Found location"}
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Library, 2nd floor (optional)"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    maxLength={200}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information *</Label>
                  <Input
                    id="contact"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    maxLength={255}
                    required
                  />
                  {errors.contactInfo && (
                    <p className="text-sm text-destructive">{errors.contactInfo}</p>
                  )}
                </div>

                {/* AI Analysis Section */}
                {aiAnalysis && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">AI Analysis</CardTitle>
                        </div>
                        <Badge variant={aiAnalysis.score >= 70 ? "default" : aiAnalysis.score >= 40 ? "secondary" : "destructive"}>
                          {aiAnalysis.score}% Complete
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Detail Strength</span>
                          <span className="text-sm text-muted-foreground">{aiAnalysis.score}/100</span>
                        </div>
                        <Progress value={aiAnalysis.score} className="h-2" />
                      </div>

                      {aiAnalysis.strengths.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Good Details:</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {aiAnalysis.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-muted-foreground list-disc">{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiAnalysis.suggestions.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium">Suggestions to Improve:</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {aiAnalysis.suggestions.map((suggestion, i) => (
                              <li key={i} className="text-sm text-muted-foreground list-disc">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiAnalysis.missingDetails.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium">Missing Details:</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {aiAnalysis.missingDetails.map((detail, i) => (
                              <li key={i} className="text-sm text-muted-foreground list-disc">{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isAnalyzing && (
                        <p className="text-sm text-muted-foreground italic">Analyzing your details...</p>
                      )}
                    </CardContent>
                  </Card>
                )}

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
