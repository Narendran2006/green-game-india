import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, Timer, Lightbulb, CheckCircle, Recycle, Zap, Droplets } from "lucide-react";

interface Puzzle {
  id: string;
  room: string;
  title: string;
  description: string;
  question: string;
  answer: string;
  hint: string;
  category: "waste" | "energy" | "water" | "carbon";
  points: number;
}

const puzzles: Puzzle[] = [
  {
    id: "waste-sorting",
    room: "Recycling Chamber",
    title: "Waste Classification Code",
    description: "Sort these items to unlock the door: Paper, Glass, Plastic, Organic",
    question: "Enter the recycling codes in order (Paper, Glass, Plastic, Organic):",
    answer: "1472",
    hint: "Paper=1, Glass=7, Plastic=4, Organic=2",
    category: "waste",
    points: 100
  },
  {
    id: "energy-calculation",
    room: "Solar Energy Lab",
    title: "Solar Panel Efficiency",
    description: "Calculate optimal solar panel placement for maximum energy output",
    question: "A 100W panel gets 6 hours of sunlight. Daily output in kWh?",
    answer: "0.6",
    hint: "Power × Time ÷ 1000 = kWh",
    category: "energy",
    points: 150
  },
  {
    id: "water-conservation",
    room: "Hydro Conservation Center",
    title: "Water Usage Optimization",
    description: "Calculate water savings from efficient fixtures",
    question: "Old toilet: 13L/flush, New: 6L/flush, 8 flushes/day. Daily savings in L?",
    answer: "56",
    hint: "Difference per flush × number of flushes",
    category: "water",
    points: 125
  },
  {
    id: "carbon-footprint",
    room: "Climate Control Room",
    title: "CO₂ Reduction Challenge",
    description: "Calculate carbon emissions reduction from switching transport modes",
    question: "Car: 250g CO₂/km, Bus: 80g CO₂/km, 20km trip. Savings in grams?",
    answer: "3400",
    hint: "Calculate difference and multiply by distance",
    category: "carbon",
    points: 175
  }
];

export function EcoEscapeRoom() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set());
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      setGameCompleted(true);
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentPuzzle(0);
    setSolvedPuzzles(new Set());
    setUserAnswer("");
    setShowHint(false);
    setTimeLeft(900);
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
  };

  const checkAnswer = () => {
    const puzzle = puzzles[currentPuzzle];
    setAttempts(prev => prev + 1);
    
    if (userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase()) {
      // Correct answer
      setSolvedPuzzles(prev => new Set([...prev, puzzle.id]));
      const timeBonus = Math.max(0, Math.floor((900 - (900 - timeLeft)) / 10));
      const hintPenalty = showHint ? 25 : 0;
      const attemptPenalty = Math.max(0, (attempts - 1) * 10);
      const finalScore = puzzle.points + timeBonus - hintPenalty - attemptPenalty;
      setScore(prev => prev + Math.max(25, finalScore));
      
      if (currentPuzzle < puzzles.length - 1) {
        // Move to next puzzle
        setTimeout(() => {
          setCurrentPuzzle(prev => prev + 1);
          setUserAnswer("");
          setShowHint(false);
          setAttempts(0);
        }, 1500);
      } else {
        // All puzzles completed
        setTimeout(() => {
          setGameCompleted(true);
        }, 1500);
      }
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentPuzzle(0);
    setSolvedPuzzles(new Set());
    setUserAnswer("");
    setShowHint(false);
    setTimeLeft(900);
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "waste": return Recycle;
      case "energy": return Zap;
      case "water": return Droplets;
      case "carbon": return Lightbulb;
      default: return Lock;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Eco Escape Room</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-lg">
                  Solve environmental puzzles to unlock each room and escape! 
                  Test your knowledge of waste, energy, water, and carbon footprint.
                </p>
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Escape Challenge:</h3>
                  <ul className="text-sm text-left space-y-1">
                    <li>• 4 locked rooms with environmental puzzles</li>
                    <li>• 15 minutes to escape all rooms</li>
                    <li>• Hints available (but reduce your score)</li>
                    <li>• Bonus points for speed and accuracy</li>
                  </ul>
                </div>
                <Button onClick={startGame} size="lg" className="bg-primary hover:bg-primary/90">
                  <Lock className="h-5 w-5 mr-2" />
                  Enter Escape Room
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const successRate = (solvedPuzzles.size / puzzles.length) * 100;
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mb-4">
                  {solvedPuzzles.size === puzzles.length ? <Unlock className="h-10 w-10 text-white" /> : <Lock className="h-10 w-10 text-white" />}
                </div>
                <CardTitle className="text-3xl">
                  {solvedPuzzles.size === puzzles.length ? "Escape Successful!" : "Time's Up!"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">{score} Points</div>
                  <div className="text-lg text-muted-foreground mb-4">
                    Rooms Escaped: {solvedPuzzles.size}/{puzzles.length}
                  </div>
                  <Badge className={`text-lg px-4 py-2 ${successRate === 100 ? 'bg-success' : successRate >= 75 ? 'bg-primary' : 'bg-warning'}`}>
                    {successRate === 100 ? "Eco Master" : successRate >= 75 ? "Environmental Expert" : "Green Learner"}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="font-bold">Room Status:</h3>
                  {puzzles.map((puzzle, index) => (
                    <div key={puzzle.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="flex items-center gap-2">
                        {React.createElement(getCategoryIcon(puzzle.category), { className: "h-5 w-5" })}
                        {puzzle.room}
                      </span>
                      {solvedPuzzles.has(puzzle.id) ? 
                        <CheckCircle className="h-5 w-5 text-success" /> : 
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      }
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

  const puzzle = puzzles[currentPuzzle];
  const CategoryIcon = getCategoryIcon(puzzle.category);
  const isCurrentSolved = solvedPuzzles.has(puzzle.id);
  const progress = ((currentPuzzle + (isCurrentSolved ? 1 : 0)) / puzzles.length) * 100;

  return (
    <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-primary">Room {currentPuzzle + 1}/{puzzles.length}</Badge>
              <Badge variant="outline">Score: {score}</Badge>
              <Badge variant="outline" className={timeLeft < 180 ? "bg-destructive text-destructive-foreground" : ""}>
                <Timer className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
            </div>
            <Progress value={progress} className="w-32" />
          </div>

          {/* Current Puzzle */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4">
                <CategoryIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{puzzle.room}</CardTitle>
              <Badge className="w-fit mx-auto">{puzzle.category.charAt(0).toUpperCase() + puzzle.category.slice(1)} Challenge</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">{puzzle.title}</h3>
                <p className="text-muted-foreground mb-4">{puzzle.description}</p>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="font-medium">{puzzle.question}</p>
                </div>
              </div>

              {!isCurrentSolved ? (
                <div className="space-y-4">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="text-center text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  
                  <div className="flex gap-2">
                    <Button onClick={checkAnswer} className="flex-1 bg-primary hover:bg-primary/90">
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Room
                    </Button>
                    <Button 
                      onClick={() => setShowHint(true)} 
                      variant="outline"
                      disabled={showHint}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Hint (-25 pts)
                    </Button>
                  </div>

                  {showHint && (
                    <Card className="bg-warning/10 border-warning/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-5 w-5 text-warning" />
                          <span className="font-bold">Hint:</span>
                        </div>
                        <p className="text-sm">{puzzle.hint}</p>
                      </CardContent>
                    </Card>
                  )}

                  {attempts > 0 && !isCurrentSolved && (
                    <div className="text-center text-sm text-muted-foreground">
                      Attempts: {attempts} {attempts > 1 && `(-${(attempts - 1) * 10} pts)`}
                    </div>
                  )}
                </div>
              ) : (
                <Card className="bg-success/10 border-success/20">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                    <div className="font-bold text-success text-lg">Room Unlocked!</div>
                    <div className="text-sm text-muted-foreground">Moving to next challenge...</div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}