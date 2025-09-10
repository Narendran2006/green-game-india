import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Factory, CheckCircle, ArrowRight, Award, Leaf } from "lucide-react";

interface WasteItem {
  id: string;
  name: string;
  category: string;
  description: string;
  emoji: string;
}

interface Industry {
  id: string;
  name: string;
  accepts: string[];
  produces: string;
  description: string;
  icon: string;
  sustainabilityImpact: number;
}

interface Chain {
  wasteItem: WasteItem;
  targetIndustry: Industry;
  completed: boolean;
}

const wasteItems: WasteItem[] = [
  {
    id: "plastic-bottles",
    name: "Plastic Bottles",
    category: "plastic",
    description: "PET bottles from beverages",
    emoji: "🍶"
  },
  {
    id: "food-waste",
    name: "Food Scraps",
    category: "organic",
    description: "Kitchen and restaurant waste",
    emoji: "🍃"
  },
  {
    id: "old-paper",
    name: "Waste Paper",
    category: "paper",
    description: "Newspapers, magazines, cardboard",
    emoji: "📰"
  },
  {
    id: "metal-cans",
    name: "Aluminum Cans",
    category: "metal",
    description: "Beverage and food cans",
    emoji: "🥤"
  },
  {
    id: "glass-bottles",
    name: "Glass Containers",
    category: "glass",
    description: "Bottles and jars",
    emoji: "🫙"
  },
  {
    id: "textile-waste",
    name: "Old Clothing",
    category: "textile",
    description: "Worn out clothes and fabrics",
    emoji: "👕"
  },
  {
    id: "electronics",
    name: "E-Waste",
    category: "electronic",
    description: "Old phones, computers, batteries",
    emoji: "📱"
  },
  {
    id: "wood-waste",
    name: "Wood Scraps",
    category: "wood",
    description: "Construction and furniture waste",
    emoji: "🪵"
  }
];

const industries: Industry[] = [
  {
    id: "textile-recycling",
    name: "Textile Industry",
    accepts: ["plastic", "textile"],
    produces: "New Clothing & Fibers",
    description: "Converts plastic bottles into polyester fibers and recycles old clothing",
    icon: "🧵",
    sustainabilityImpact: 85
  },
  {
    id: "biogas-plant",
    name: "Biogas Facility",
    accepts: ["organic", "wood"],
    produces: "Renewable Energy",
    description: "Generates clean energy from organic waste and wood biomass",
    icon: "⚡",
    sustainabilityImpact: 90
  },
  {
    id: "paper-mill",
    name: "Paper Mill",
    accepts: ["paper"],
    produces: "Recycled Paper Products",
    description: "Creates new paper products from waste paper",
    icon: "📄",
    sustainabilityImpact: 75
  },
  {
    id: "metal-smelting",
    name: "Metal Processing",
    accepts: ["metal", "electronic"],
    produces: "New Metal Products",
    description: "Extracts and reprocesses metals from cans and electronics",
    icon: "🔧",
    sustainabilityImpact: 95
  },
  {
    id: "glass-factory",
    name: "Glass Manufacturing",
    accepts: ["glass"],
    produces: "New Glass Products",
    description: "Melts and reforms glass into new containers and products",
    icon: "🫙",
    sustainabilityImpact: 80
  }
];

export function CircularEconomyPuzzle() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [completedChains, setCompletedChains] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<WasteItem | null>(null);
  const [currentWasteItems, setCurrentWasteItems] = useState<WasteItem[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const generateLevel = (levelNum: number) => {
    const itemCount = Math.min(4 + levelNum, 8);
    const shuffled = [...wasteItems].sort(() => Math.random() - 0.5);
    setCurrentWasteItems(shuffled.slice(0, itemCount));
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setCompletedChains(new Set());
    setFeedback(null);
    generateLevel(1);
  };

  const handleDragStart = (wasteItem: WasteItem) => {
    setDraggedItem(wasteItem);
  };

  const handleDrop = (industry: Industry) => {
    if (!draggedItem) return;

    const chainId = `${draggedItem.id}-${industry.id}`;
    
    if (completedChains.has(chainId)) {
      setFeedback({ type: 'error', message: 'This chain already exists!' });
      setDraggedItem(null);
      return;
    }

    if (industry.accepts.includes(draggedItem.category)) {
      // Correct match
      setCompletedChains(prev => new Set([...prev, chainId]));
      setScore(prev => prev + (100 + industry.sustainabilityImpact));
      setFeedback({
        type: 'success',
        message: `Great! ${draggedItem.name} → ${industry.name} → ${industry.produces}`
      });
      
      // Remove matched item from current items
      setCurrentWasteItems(prev => prev.filter(item => item.id !== draggedItem.id));
      
      // Check if level completed
      if (currentWasteItems.length === 1) { // Will be 0 after filter
        setTimeout(() => {
          if (level < 3) {
            setLevel(prev => prev + 1);
            generateLevel(level + 1);
            setFeedback(null);
          } else {
            setGameCompleted(true);
          }
        }, 1500);
      }
    } else {
      // Incorrect match
      setScore(prev => Math.max(0, prev - 25));
      setFeedback({
        type: 'error',
        message: `${industry.name} cannot process ${draggedItem.category} waste. Try a different industry!`
      });
    }
    
    setDraggedItem(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setLevel(1);
    setScore(0);
    setCompletedChains(new Set());
    setDraggedItem(null);
    setCurrentWasteItems([]);
    setFeedback(null);
  };

  const getCompletedChainsForLevel = () => {
    return Array.from(completedChains).map(chainId => {
      const [wasteId, industryId] = chainId.split('-');
      const waste = wasteItems.find(w => w.id === wasteId);
      const industry = industries.find(i => i.id === industryId);
      return { waste, industry };
    }).filter(chain => chain.waste && chain.industry);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-accent/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mb-4">
                  <RotateCcw className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Circular Economy Puzzle</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-lg">
                  Match waste materials with industries that can transform them into new products. 
                  Build sustainable supply chains and master the circular economy!
                </p>
                <div className="bg-gradient-to-r from-accent/10 to-success/10 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Circular Challenge:</h3>
                  <ul className="text-sm text-left space-y-1">
                    <li>• Drag waste items to appropriate industries</li>
                    <li>• Create sustainable transformation chains</li>
                    <li>• Progress through 3 levels of complexity</li>
                    <li>• Maximize sustainability impact points</li>
                  </ul>
                </div>
                <Button onClick={startGame} size="lg" className="bg-accent hover:bg-accent/90">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Start Puzzle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const totalChains = completedChains.size;
    const averageSustainability = getCompletedChainsForLevel().reduce((avg, chain) => 
      avg + (chain.industry?.sustainabilityImpact || 0), 0) / Math.max(1, totalChains);
    
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Circular Economy Master!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-success mb-2">{score} Points</div>
                  <div className="text-lg text-muted-foreground mb-4">
                    Chains Completed: {totalChains}
                  </div>
                  <Badge className={`text-lg px-4 py-2 ${averageSustainability >= 85 ? 'bg-success' : averageSustainability >= 75 ? 'bg-primary' : 'bg-warning'}`}>
                    {averageSustainability >= 85 ? "Sustainability Champion" : averageSustainability >= 75 ? "Circular Economy Expert" : "Green Innovator"}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="font-bold">Your Supply Chains:</h3>
                  {getCompletedChainsForLevel().map((chain, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{chain.waste?.emoji}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{chain.industry?.icon}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-medium">{chain.industry?.produces}</span>
                      </div>
                      <Badge className="bg-success">
                        +{chain.industry?.sustainabilityImpact}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={resetGame} variant="outline" className="flex-1">
                    New Puzzle
                  </Button>
                  <Button onClick={() => window.history.back()} className="flex-1 bg-success hover:bg-success/90">
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((level - 1) / 3) * 100 + (33.33 * (wasteItems.length - currentWasteItems.length) / wasteItems.length);

  return (
    <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-accent">Level {level}/3</Badge>
              <Badge variant="outline">Score: {score}</Badge>
              <Badge variant="outline">Chains: {completedChains.size}</Badge>
            </div>
            <Progress value={progress} className="w-32" />
          </div>

          {/* Feedback */}
          {feedback && (
            <Card className={`mb-6 border-2 ${feedback.type === 'success' ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {feedback.type === 'success' ? 
                    <CheckCircle className="h-5 w-5 text-success" /> : 
                    <Factory className="h-5 w-5 text-destructive" />
                  }
                  <span className={feedback.type === 'success' ? 'text-success' : 'text-destructive'}>
                    {feedback.message}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Waste Items */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Waste Materials ({currentWasteItems.length} remaining)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {currentWasteItems.map(item => (
                    <Card
                      key={item.id}
                      className="cursor-grab border-2 border-muted hover:border-accent/50 transition-all active:cursor-grabbing"
                      draggable
                      onDragStart={() => handleDragStart(item)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{item.emoji}</div>
                        <div className="font-bold text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                        <Badge className="mt-2 bg-primary text-xs">{item.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {currentWasteItems.length === 0 && (
                  <div className="text-center text-muted-foreground p-8">
                    <Leaf className="h-12 w-12 mx-auto mb-2 text-success" />
                    <p>All waste transformed! Moving to next level...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Industries */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Processing Industries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {industries.map(industry => (
                    <Card
                      key={industry.id}
                      className="border-2 border-dashed border-muted hover:border-accent/50 transition-all cursor-pointer"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(industry)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{industry.icon}</div>
                          <div className="flex-1">
                            <div className="font-bold text-sm">{industry.name}</div>
                            <div className="text-xs text-muted-foreground mb-1">{industry.description}</div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-accent text-xs">
                                Accepts: {industry.accepts.join(', ')}
                              </Badge>
                              <Badge className="bg-success text-xs">
                                Impact: {industry.sustainabilityImpact}
                              </Badge>
                            </div>
                            <div className="text-xs font-medium mt-1 text-primary">
                              → {industry.produces}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completed Chains */}
          {completedChains.size > 0 && (
            <Card className="mt-6 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Completed Supply Chains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {getCompletedChainsForLevel().map((chain, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                      <span className="text-lg">{chain.waste?.emoji}</span>
                      <ArrowRight className="h-4 w-4 text-success" />
                      <span className="text-lg">{chain.industry?.icon}</span>
                      <ArrowRight className="h-4 w-4 text-success" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{chain.industry?.produces}</div>
                        <Badge className="bg-success text-xs">+{chain.industry?.sustainabilityImpact} pts</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}