import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Building, Zap, Droplets, Utensils, Recycle, Users, DollarSign, Leaf, Award } from "lucide-react";

interface Budget {
  energy: number;
  water: number;
  food: number;
  waste: number;
}

interface Metrics {
  sustainabilityScore: number;
  studentHappiness: number;
  totalBudget: number;
  energyEfficiency: number;
  waterConservation: number;
  wasteReduction: number;
}

interface Investment {
  id: string;
  name: string;
  category: "energy" | "water" | "food" | "waste";
  cost: number;
  sustainabilityImpact: number;
  happinessImpact: number;
  description: string;
  icon: any;
}

const investments: Investment[] = [
  // Energy
  {
    id: "solar-panels",
    name: "Solar Panel Installation",
    category: "energy",
    cost: 40,
    sustainabilityImpact: 25,
    happinessImpact: 5,
    description: "Renewable energy for campus buildings",
    icon: Zap
  },
  {
    id: "led-lights",
    name: "LED Lighting Upgrade",
    category: "energy",
    cost: 15,
    sustainabilityImpact: 15,
    happinessImpact: 10,
    description: "Energy-efficient lighting system",
    icon: Zap
  },
  // Water
  {
    id: "rainwater-harvesting",
    name: "Rainwater Harvesting System",
    category: "water",
    cost: 30,
    sustainabilityImpact: 20,
    happinessImpact: 8,
    description: "Collect and reuse rainwater",
    icon: Droplets
  },
  {
    id: "low-flow-fixtures",
    name: "Water-Efficient Fixtures",
    category: "water",
    cost: 20,
    sustainabilityImpact: 18,
    happinessImpact: 5,
    description: "Reduce water consumption",
    icon: Droplets
  },
  // Food
  {
    id: "organic-cafeteria",
    name: "Organic Food Program",
    category: "food",
    cost: 35,
    sustainabilityImpact: 22,
    happinessImpact: 15,
    description: "Local, organic cafeteria meals",
    icon: Utensils
  },
  {
    id: "campus-garden",
    name: "Campus Vegetable Garden",
    category: "food",
    cost: 25,
    sustainabilityImpact: 18,
    happinessImpact: 12,
    description: "Grow food on campus",
    icon: Leaf
  },
  // Waste
  {
    id: "composting-system",
    name: "Campus Composting Program",
    category: "waste",
    cost: 20,
    sustainabilityImpact: 20,
    happinessImpact: 8,
    description: "Turn organic waste into fertilizer",
    icon: Recycle
  },
  {
    id: "recycling-stations",
    name: "Smart Recycling Stations",
    category: "waste",
    cost: 25,
    sustainabilityImpact: 15,
    happinessImpact: 10,
    description: "Automated sorting and tracking",
    icon: Recycle
  }
];

export function SustainableCampusTycoon() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [level, setLevel] = useState(1);
  const [budget, setBudget] = useState<Budget>({ energy: 25, water: 25, food: 25, waste: 25 });
  const [investments, setInvestments] = useState<Set<string>>(new Set());
  const [metrics, setMetrics] = useState<Metrics>({
    sustainabilityScore: 0,
    studentHappiness: 50,
    totalBudget: 100,
    energyEfficiency: 0,
    waterConservation: 0,
    wasteReduction: 0
  });

  const calculateMetrics = (newBudget: Budget, newInvestments: Set<string>): Metrics => {
    let sustainabilityScore = 0;
    let studentHappiness = 50;
    let energyEfficiency = Math.min(100, newBudget.energy * 2);
    let waterConservation = Math.min(100, newBudget.water * 2);
    let wasteReduction = Math.min(100, newBudget.waste * 2);

    // Base scores from budget allocation
    sustainabilityScore += (newBudget.energy + newBudget.water + newBudget.waste + newBudget.food) * 0.5;
    
    // Bonus from investments
    Array.from(newInvestments).forEach(investmentId => {
      const investment = investments.find(inv => inv.id === investmentId);
      if (investment) {
        sustainabilityScore += investment.sustainabilityImpact;
        studentHappiness += investment.happinessImpact;
        
        // Category-specific bonuses
        switch (investment.category) {
          case "energy":
            energyEfficiency += investment.sustainabilityImpact;
            break;
          case "water":
            waterConservation += investment.sustainabilityImpact;
            break;
          case "waste":
            wasteReduction += investment.sustainabilityImpact;
            break;
        }
      }
    });

    // Balance bonus - reward balanced allocation
    const budgetValues = Object.values(newBudget);
    const minBudget = Math.min(...budgetValues);
    const maxBudget = Math.max(...budgetValues);
    const balanceBonus = Math.max(0, 20 - (maxBudget - minBudget));
    sustainabilityScore += balanceBonus;

    return {
      sustainabilityScore: Math.min(100, sustainabilityScore),
      studentHappiness: Math.min(100, studentHappiness),
      totalBudget: 100,
      energyEfficiency: Math.min(100, energyEfficiency),
      waterConservation: Math.min(100, waterConservation),
      wasteReduction: Math.min(100, wasteReduction)
    };
  };

  const handleBudgetChange = (category: keyof Budget, value: number[]) => {
    const newBudget = { ...budget, [category]: value[0] };
    const totalAllocated = Object.values(newBudget).reduce((sum, val) => sum + val, 0);
    
    if (totalAllocated <= 100) {
      setBudget(newBudget);
      setMetrics(calculateMetrics(newBudget, investments));
    }
  };

  const makeInvestment = (investmentId: string) => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investments.has(investmentId)) return;

    const newInvestments = new Set([...investments, investmentId]);
    setInvestments(newInvestments);
    setMetrics(calculateMetrics(budget, newInvestments));
  };

  const nextLevel = () => {
    if (metrics.sustainabilityScore >= 70 && metrics.studentHappiness >= 60) {
      if (level < 3) {
        setLevel(prev => prev + 1);
        setMetrics(prev => ({ ...prev, totalBudget: prev.totalBudget + 50 }));
      } else {
        setGameCompleted(true);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setBudget({ energy: 25, water: 25, food: 25, waste: 25 });
    setInvestments(new Set());
    setMetrics({
      sustainabilityScore: 0,
      studentHappiness: 50,
      totalBudget: 100,
      energyEfficiency: 50,
      waterConservation: 50,
      wasteReduction: 50
    });
    setGameCompleted(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-accent/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mb-4">
                  <Building className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Sustainable Campus Tycoon</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-lg">
                  Manage a virtual college campus and make it sustainable! 
                  Allocate budget across energy, water, food, and waste management.
                </p>
                <div className="bg-gradient-to-r from-accent/10 to-success/10 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Campus Management:</h3>
                  <ul className="text-sm text-left space-y-1">
                    <li>• Allocate budget across 4 sustainability categories</li>
                    <li>• Invest in green technologies and programs</li>
                    <li>• Balance sustainability score with student happiness</li>
                    <li>• Unlock new challenges across 3 levels</li>
                  </ul>
                </div>
                <Button onClick={startGame} size="lg" className="bg-accent hover:bg-accent/90">
                  <Building className="h-5 w-5 mr-2" />
                  Start Managing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Campus Sustainability Master!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-2xl font-bold text-success mb-2">
                    Level {level} Completed!
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">{Math.round(metrics.sustainabilityScore)}</div>
                      <div className="text-sm">Sustainability Score</div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{Math.round(metrics.studentHappiness)}</div>
                      <div className="text-sm">Student Happiness</div>
                    </div>
                  </div>
                  <Badge className="bg-success text-lg px-4 py-2">
                    Sustainable Campus Leader
                  </Badge>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={resetGame} variant="outline" className="flex-1">
                    New Campus
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

  const totalAllocated = Object.values(budget).reduce((sum, val) => sum + val, 0);
  const canAdvance = metrics.sustainabilityScore >= 70 && metrics.studentHappiness >= 60;

  return (
    <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-accent">Level {level}/3</Badge>
              <Badge variant="outline">Budget: {totalAllocated}/100</Badge>
            </div>
            <Button 
              onClick={nextLevel} 
              disabled={!canAdvance}
              className="bg-success hover:bg-success/90"
            >
              {level < 3 ? "Next Level" : "Complete"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Budget Allocation */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(budget).map(([category, value]) => {
                  const icons = { energy: Zap, water: Droplets, food: Utensils, waste: Recycle };
                  const Icon = icons[category as keyof typeof icons];
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium capitalize">{category}</span>
                        </div>
                        <span className="text-sm font-bold">{value}%</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(newValue) => handleBudgetChange(category as keyof Budget, newValue)}
                        max={100 - (totalAllocated - value)}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Total Allocated:</span>
                    <span className={`font-bold ${totalAllocated <= 100 ? 'text-success' : 'text-destructive'}`}>
                      {totalAllocated}/100
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campus Metrics */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Campus Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-success/10 rounded-lg text-center">
                    <Leaf className="h-6 w-6 mx-auto mb-1 text-success" />
                    <div className="text-xl font-bold text-success">{Math.round(metrics.sustainabilityScore)}</div>
                    <div className="text-xs">Sustainability</div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg text-center">
                    <Users className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold text-primary">{Math.round(metrics.studentHappiness)}</div>
                    <div className="text-xs">Student Happiness</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Energy Efficiency</span>
                      <span>{Math.round(metrics.energyEfficiency)}%</span>
                    </div>
                    <Progress value={metrics.energyEfficiency} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Water Conservation</span>
                      <span>{Math.round(metrics.waterConservation)}%</span>
                    </div>
                    <Progress value={metrics.waterConservation} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Waste Reduction</span>
                      <span>{Math.round(metrics.wasteReduction)}%</span>
                    </div>
                    <Progress value={metrics.wasteReduction} />
                  </div>
                </div>

                {!canAdvance && (
                  <div className="bg-warning/10 p-3 rounded-lg text-center">
                    <div className="text-sm text-warning font-medium">
                      Need: 70+ Sustainability & 60+ Happiness
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Investments */}
            <Card className="md:col-span-2 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Available Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {investments.map(investment => (
                    <Card
                      key={investment.id}
                      className={`cursor-pointer border-2 transition-all ${
                        investments.has(investment.id)
                          ? 'border-success bg-success/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => makeInvestment(investment.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                            <investment.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm mb-1">{investment.name}</div>
                            <div className="text-xs text-muted-foreground mb-2">{investment.description}</div>
                            <div className="flex gap-2">
                              <Badge className="bg-success text-xs">+{investment.sustainabilityImpact} Sustainability</Badge>
                              <Badge className="bg-primary text-xs">+{investment.happinessImpact} Happiness</Badge>
                            </div>
                            {investments.has(investment.id) && (
                              <Badge className="bg-success mt-2">Implemented</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}