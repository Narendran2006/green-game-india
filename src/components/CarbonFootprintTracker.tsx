import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Car, Bike, ShoppingBag, Leaf, Zap, Home, Award } from "lucide-react";

interface Choice {
  id: string;
  scenario: string;
  options: {
    text: string;
    carbonImpact: number;
    icon: any;
    description: string;
  }[];
}

const choices: Choice[] = [
  {
    id: "transport",
    scenario: "How will you travel to college today?",
    options: [
      { text: "Drive alone", carbonImpact: 50, icon: Car, description: "High emissions from fuel" },
      { text: "Carpool", carbonImpact: 15, icon: Car, description: "Shared emissions" },
      { text: "Public transport", carbonImpact: 8, icon: Car, description: "Low per-person emissions" },
      { text: "Bike/Walk", carbonImpact: 0, icon: Bike, description: "Zero emissions!" }
    ]
  },
  {
    id: "shopping",
    scenario: "Time to buy groceries. What bag do you choose?",
    options: [
      { text: "Plastic bags", carbonImpact: 20, icon: ShoppingBag, description: "Single-use plastic waste" },
      { text: "Paper bags", carbonImpact: 15, icon: ShoppingBag, description: "Biodegradable but energy-intensive" },
      { text: "Reusable bag", carbonImpact: 2, icon: Leaf, description: "Minimal impact over time" }
    ]
  },
  {
    id: "energy",
    scenario: "Your dorm room needs lighting. What's your choice?",
    options: [
      { text: "Leave lights on", carbonImpact: 30, icon: Zap, description: "Constant energy waste" },
      { text: "Use when needed", carbonImpact: 10, icon: Zap, description: "Moderate consumption" },
      { text: "LED + natural light", carbonImpact: 3, icon: Leaf, description: "Energy efficient" }
    ]
  },
  {
    id: "food",
    scenario: "Lunch time! What's on your plate?",
    options: [
      { text: "Fast food delivery", carbonImpact: 35, icon: Home, description: "Packaging + transport emissions" },
      { text: "Cafeteria meal", carbonImpact: 18, icon: Home, description: "Shared cooking resources" },
      { text: "Local organic food", carbonImpact: 8, icon: Leaf, description: "Low transport, sustainable farming" }
    ]
  },
  {
    id: "consumption",
    scenario: "You need new clothes for the semester:",
    options: [
      { text: "Fast fashion", carbonImpact: 40, icon: ShoppingBag, description: "High manufacturing footprint" },
      { text: "Brand new clothes", carbonImpact: 25, icon: ShoppingBag, description: "Standard manufacturing" },
      { text: "Thrift/secondhand", carbonImpact: 5, icon: Leaf, description: "Reusing existing items" }
    ]
  }
];

export function CarbonFootprintTracker() {
  const [currentChoice, setCurrentChoice] = useState(0);
  const [carbonScore, setCarbonScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const handleChoice = (optionIndex: number) => {
    const choice = choices[currentChoice];
    const selectedOption = choice.options[optionIndex];
    
    setCarbonScore(prev => prev + selectedOption.carbonImpact);
    setSelectedChoices(prev => [...prev, selectedOption.text]);
    
    if (currentChoice < choices.length - 1) {
      setCurrentChoice(prev => prev + 1);
    } else {
      setGameCompleted(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCarbonScore(0);
    setCurrentChoice(0);
    setGameCompleted(false);
    setSelectedChoices([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCarbonScore(0);
    setCurrentChoice(0);
    setGameCompleted(false);
    setSelectedChoices([]);
  };

  const getEcoRating = () => {
    if (carbonScore <= 30) return { rating: "Net Zero Hero", color: "text-success", icon: Award };
    if (carbonScore <= 60) return { rating: "Eco Warrior", color: "text-primary", icon: Leaf };
    if (carbonScore <= 100) return { rating: "Climate Conscious", color: "text-warning", icon: Zap };
    return { rating: "Carbon Footprint Alert", color: "text-destructive", icon: Car };
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Carbon Footprint Tracker</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-lg">
                  Make daily lifestyle choices and track your carbon footprint. 
                  Can you achieve "Net Zero Hero" status?
                </p>
                <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">How it works:</h3>
                  <ul className="text-sm text-left space-y-1">
                    <li>• Make choices in 5 daily scenarios</li>
                    <li>• Each choice affects your carbon score</li>
                    <li>• Lower scores = better for the environment</li>
                    <li>• Aim for "Net Zero Hero" status!</li>
                  </ul>
                </div>
                <Button onClick={startGame} size="lg" className="bg-success hover:bg-success/90">
                  <Leaf className="h-5 w-5 mr-2" />
                  Start Tracking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const ecoRating = getEcoRating();
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
              <CardHeader className="text-center">
                <div className={`mx-auto w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mb-4`}>
                  <ecoRating.icon className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Your Eco Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className={`text-2xl font-bold ${ecoRating.color} mb-2`}>
                    {ecoRating.rating}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Carbon Score: {carbonScore} kg CO₂
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="font-bold text-left">Your Choices:</h3>
                  {selectedChoices.map((choice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">{choices[index].scenario.split('?')[0]}</span>
                      <Badge variant="outline">{choice}</Badge>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button onClick={resetGame} variant="outline" className="flex-1">
                    Try Again
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

  const choice = choices[currentChoice];
  const progress = ((currentChoice + 1) / choices.length) * 100;

  return (
    <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-success">Scenario {currentChoice + 1}/{choices.length}</Badge>
                <Badge variant="outline">Carbon: {carbonScore} kg CO₂</Badge>
              </div>
              <Progress value={progress} className="mb-4" />
              <CardTitle className="text-xl">{choice.scenario}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {choice.options.map((option, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary/50"
                    onClick={() => handleChoice(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                          <option.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg">{option.text}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                          <Badge 
                            className={`mt-2 ${option.carbonImpact <= 10 ? 'bg-success' : option.carbonImpact <= 25 ? 'bg-warning' : 'bg-destructive'}`}
                          >
                            +{option.carbonImpact} kg CO₂
                          </Badge>
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
  );
}