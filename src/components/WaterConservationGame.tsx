import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Timer, Target, Zap, AlertTriangle } from "lucide-react";

interface WaterActivity {
  id: string;
  name: string;
  normalUsage: number;
  conservedUsage: number;
  tip: string;
  icon: string;
}

const waterActivities: WaterActivity[] = [
  {
    id: "shower",
    name: "Taking a Shower",
    normalUsage: 68,
    conservedUsage: 25,
    tip: "Take shorter showers (5 min max)",
    icon: "🚿"
  },
  {
    id: "brushing",
    name: "Brushing Teeth",
    normalUsage: 8,
    conservedUsage: 2,
    tip: "Turn off tap while brushing",
    icon: "🦷"
  },
  {
    id: "washing-dishes",
    name: "Washing Dishes",
    normalUsage: 37,
    conservedUsage: 10,
    tip: "Fill basin instead of running water",
    icon: "🍽️"
  },
  {
    id: "watering-plants",
    name: "Watering Plants",
    normalUsage: 20,
    conservedUsage: 8,
    tip: "Use collected rainwater",
    icon: "🌱"
  },
  {
    id: "washing-car",
    name: "Washing Car",
    normalUsage: 150,
    conservedUsage: 40,
    tip: "Use bucket instead of hose",
    icon: "🚗"
  }
];

export function WaterConservationGame() {
  const [currentActivity, setCurrentActivity] = useState<WaterActivity | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [waterSaved, setWaterSaved] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'normal' | 'conserved' | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [round, setRound] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(90);
    setWaterSaved(0);
    setScore(0);
    setRound(0);
    generateNewActivity();
  };

  const generateNewActivity = () => {
    const randomActivity = waterActivities[Math.floor(Math.random() * waterActivities.length)];
    setCurrentActivity(randomActivity);
    setSelectedChoice(null);
    setFeedback("");
    setRound(prev => prev + 1);
  };

  const handleChoice = (choice: 'normal' | 'conserved') => {
    if (!currentActivity || selectedChoice) return;
    
    setSelectedChoice(choice);
    
    if (choice === 'conserved') {
      const saved = currentActivity.normalUsage - currentActivity.conservedUsage;
      setWaterSaved(prev => prev + saved);
      setScore(prev => prev + Math.round(saved * 2));
      setFeedback(`Great choice! You saved ${saved} liters. ${currentActivity.tip}`);
    } else {
      setFeedback(`You used ${currentActivity.normalUsage} liters. Try to conserve water! ${currentActivity.tip}`);
    }
    
    setTimeout(() => {
      if (round < 10) {
        generateNewActivity();
      } else {
        setGameStarted(false);
      }
    }, 3000);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
  }, [timeLeft, gameStarted]);

  const getWaterLevel = () => {
    return Math.min((waterSaved / 500) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Water Conservation Challenge</h1>
          <p className="text-muted-foreground">Make smart choices to save water in daily activities</p>
        </div>

        {!gameStarted ? (
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <Droplets className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>Water Conservation Challenge</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Choose the water-efficient option for daily activities and learn conservation tips!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="font-medium">Save Water</div>
                  <div className="text-sm text-muted-foreground">Make smart choices</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🌍</div>
                  <div className="font-medium">Help Environment</div>
                  <div className="text-sm text-muted-foreground">Every drop counts</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-medium">Earn Points</div>
                  <div className="text-sm text-muted-foreground">Beat the challenge</div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="bg-primary text-primary-foreground">
                <Droplets className="h-5 w-5 mr-2" />
                Start Conservation Challenge
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{timeLeft}s</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{waterSaved}L</div>
                  <div className="text-sm text-muted-foreground">Water Saved</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-sm text-muted-foreground">Eco Points</div>
                </CardContent>
              </Card>
            </div>

            {/* Water Level Indicator */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Droplets className="h-5 w-5 mr-2" />
                  Water Conservation Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                    style={{ width: `${getWaterLevel()}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Target: 500L saved | Progress: {Math.round(getWaterLevel())}%
                </p>
              </CardContent>
            </Card>

            {/* Current Activity */}
            {currentActivity && (
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="text-center">
                  <CardTitle>Round {round}/10</CardTitle>
                  <div className="text-4xl mb-4">{currentActivity.icon}</div>
                  <h3 className="text-xl font-bold">{currentActivity.name}</h3>
                  <p className="text-muted-foreground">How will you approach this activity?</p>
                </CardHeader>
                <CardContent>
                  {!selectedChoice ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => handleChoice('normal')}
                        variant="outline"
                        className="h-24"
                        size="lg"
                      >
                        <div className="text-center">
                          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                          <div className="font-medium">Normal Way</div>
                          <div className="text-sm text-muted-foreground">
                            Uses {currentActivity.normalUsage}L
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        onClick={() => handleChoice('conserved')}
                        variant="outline"
                        className="h-24"
                        size="lg"
                      >
                        <div className="text-center">
                          <Zap className="h-6 w-6 mx-auto mb-2 text-green-500" />
                          <div className="font-medium">Water-Smart Way</div>
                          <div className="text-sm text-muted-foreground">
                            Uses {currentActivity.conservedUsage}L
                          </div>
                        </div>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Badge 
                        className={`mb-4 ${selectedChoice === 'conserved' ? 'bg-success' : 'bg-orange-500'}`}
                      >
                        {selectedChoice === 'conserved' ? '✓ Water Smart!' : '⚠ Try to conserve'}
                      </Badge>
                      <p className="text-muted-foreground">{feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Game Over */}
        {!gameStarted && round > 0 && (
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                <Droplets className="h-8 w-8 text-success-foreground" />
              </div>
              <CardTitle>Challenge Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-success mb-2">{waterSaved}L Saved!</div>
              <p className="text-muted-foreground mb-4">
                You've learned how small changes in daily habits can make a big difference!
              </p>
              <Button onClick={startGame} className="bg-primary text-primary-foreground">
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}