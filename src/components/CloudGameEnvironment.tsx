import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Wind, Timer, Trophy } from "lucide-react";

interface WeatherPattern {
  id: string;
  name: string;
  icon: any;
  description: string;
  environmentalImpact: string;
}

const weatherPatterns: WeatherPattern[] = [
  {
    id: "sunny",
    name: "Sunny Day",
    icon: Sun,
    description: "Clear skies and bright sunshine",
    environmentalImpact: "Perfect for solar energy generation and photosynthesis"
  },
  {
    id: "cloudy",
    name: "Cloudy Weather", 
    icon: Cloud,
    description: "Overcast skies with cloud cover",
    environmentalImpact: "Clouds help regulate Earth's temperature and reflect sunlight"
  },
  {
    id: "rainy",
    name: "Rainy Day",
    icon: CloudRain,
    description: "Precipitation and water droplets",
    environmentalImpact: "Essential for the water cycle and plant growth"
  },
  {
    id: "windy",
    name: "Windy Conditions",
    icon: Wind,
    description: "Strong air currents and breezes",
    environmentalImpact: "Great for wind energy and seed dispersal"
  }
];

export function CloudGameEnvironment() {
  const [currentWeather, setCurrentWeather] = useState<WeatherPattern>(weatherPatterns[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    generateNewWeather();
  };

  const generateNewWeather = () => {
    const randomWeather = weatherPatterns[Math.floor(Math.random() * weatherPatterns.length)];
    setCurrentWeather(randomWeather);
    setSelectedPattern("");
    setFeedback("");
  };

  const handlePatternSelect = (pattern: WeatherPattern) => {
    if (!gameStarted) return;
    
    setSelectedPattern(pattern.id);
    
    if (pattern.id === currentWeather.id) {
      setScore(prev => prev + 10);
      setFeedback("Correct! " + pattern.environmentalImpact);
      setTimeout(() => {
        generateNewWeather();
      }, 2000);
    } else {
      setFeedback("Try again! Look at the weather pattern carefully.");
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
  }, [timeLeft, gameStarted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Weather & Climate Game</h1>
          <p className="text-muted-foreground">Learn about weather patterns and their environmental impact</p>
        </div>

        {!gameStarted ? (
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <Cloud className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>Weather Pattern Challenge</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Identify different weather patterns and learn their environmental benefits!
              </p>
              <Button onClick={startGame} size="lg" className="bg-primary text-primary-foreground">
                <Cloud className="h-5 w-5 mr-2" />
                Start Weather Game
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{timeLeft}s</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Current Weather Display */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="text-center">
                <CardTitle>What weather pattern is this?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-sky-200 rounded-full flex items-center justify-center animate-pulse">
                  <currentWeather.icon className="h-16 w-16 text-sky-600" />
                </div>
                <p className="text-lg font-medium mb-2">{currentWeather.description}</p>
                {feedback && (
                  <Badge className={`mt-2 ${selectedPattern === currentWeather.id ? 'bg-success' : 'bg-destructive'}`}>
                    {feedback}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Weather Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {weatherPatterns.map((pattern) => (
                <Card 
                  key={pattern.id}
                  className={`bg-gradient-card shadow-card cursor-pointer transition-all hover:shadow-button ${
                    selectedPattern === pattern.id 
                      ? (selectedPattern === currentWeather.id ? 'ring-2 ring-success' : 'ring-2 ring-destructive')
                      : ''
                  }`}
                  onClick={() => handlePatternSelect(pattern)}
                >
                  <CardContent className="p-4 text-center">
                    <pattern.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-sm">{pattern.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}