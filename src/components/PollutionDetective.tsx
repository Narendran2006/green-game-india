import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, AlertTriangle, CheckCircle, Factory, Droplets, Wind, Timer } from "lucide-react";

interface Clue {
  id: string;
  title: string;
  data: string;
  value: string;
  impact: string;
}

interface Case {
  id: string;
  title: string;
  description: string;
  location: string;
  clues: Clue[];
  suspects: string[];
  correctSuspect: string;
  solution: string;
}

const cases: Case[] = [
  {
    id: "river-contamination",
    title: "Mystery of the Contaminated River",
    description: "Fish are dying in the Green Valley River. Citizens report strange smells and discolored water.",
    location: "Green Valley River",
    clues: [
      {
        id: "ph-levels",
        title: "Water pH Analysis",
        data: "pH Level: 3.2",
        value: "Highly Acidic",
        impact: "Normal river pH is 6.5-8.5. This indicates chemical contamination."
      },
      {
        id: "chemical-residue",
        title: "Chemical Analysis",
        data: "Heavy metals detected: Lead 150mg/L, Mercury 45mg/L",
        value: "Toxic Levels",
        impact: "Industrial waste contains these metals. Exceeds safe limits by 300%."
      },
      {
        id: "location-data",
        title: "Pollution Source Location",
        data: "Contamination highest near Grid E4",
        value: "Point Source",
        impact: "Pollution concentration decreases downstream, indicating nearby source."
      }
    ],
    suspects: ["Textile Factory", "Agricultural Farm", "Electronics Manufacturer", "Residential Area"],
    correctSuspect: "Electronics Manufacturer",
    solution: "The electronics manufacturer was illegally dumping heavy metals (lead & mercury from circuit board production) into the river. The highly acidic pH and toxic metal concentrations match their manufacturing waste."
  },
  {
    id: "air-pollution",
    title: "The Smog Crisis Investigation",
    description: "A sudden spike in air pollution has residents experiencing breathing difficulties. Visibility is severely reduced.",
    location: "Metro City Industrial District",
    clues: [
      {
        id: "air-quality",
        title: "Air Quality Index",
        data: "AQI: 450 (Hazardous), PM2.5: 250μg/m³",
        value: "Critical Levels",
        impact: "Safe PM2.5 level is <15μg/m³. Current levels cause immediate health risks."
      },
      {
        id: "wind-patterns",
        title: "Wind Direction Analysis",
        data: "Wind blowing from Northwest at 15km/h",
        value: "Northwest Origin",
        impact: "Pollution source located northwest of affected area."
      },
      {
        id: "emission-composition",
        title: "Pollutant Composition",
        data: "Sulfur dioxide: 85%, Coal particles: 12%, Other: 3%",
        value: "Coal Combustion",
        impact: "High sulfur content indicates coal burning as primary source."
      }
    ],
    suspects: ["Coal Power Plant", "Car Traffic", "Construction Site", "Food Processing Plant"],
    correctSuspect: "Coal Power Plant",
    solution: "The coal power plant's emission control system malfunctioned, releasing excessive sulfur dioxide and coal particles. Wind patterns and chemical composition confirm the plant as the source."
  }
];

export function PollutionDetective() {
  const [currentCase, setCurrentCase] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [revealedClues, setRevealedClues] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<string>("");
  const [score, setScore] = useState(1000);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [casesSolved, setCasesSolved] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setRevealedClues(new Set());
    setGameCompleted(false);
    setSelectedSuspect("");
    setScore(1000);
    setTimeLeft(300);
    setCasesSolved(0);
    setCurrentCase(0);
  };

  const revealClue = (clueId: string) => {
    if (revealedClues.size >= 2) {
      setScore(prev => Math.max(0, prev - 100)); // Cost for extra hints
    }
    setRevealedClues(prev => new Set([...prev, clueId]));
  };

  const solveCase = () => {
    const isCorrect = selectedSuspect === cases[currentCase].correctSuspect;
    
    if (isCorrect) {
      const bonusPoints = Math.max(0, 500 - (revealedClues.size * 100));
      setScore(prev => prev + bonusPoints);
      setCasesSolved(prev => prev + 1);
      
      if (currentCase < cases.length - 1) {
        // Move to next case
        setTimeout(() => {
          setCurrentCase(prev => prev + 1);
          setRevealedClues(new Set());
          setSelectedSuspect("");
        }, 2000);
      } else {
        // All cases completed
        setTimeout(() => {
          setGameCompleted(true);
        }, 2000);
      }
    } else {
      setScore(prev => Math.max(0, prev - 200));
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentCase(0);
    setRevealedClues(new Set());
    setGameCompleted(false);
    setSelectedSuspect("");
    setScore(1000);
    setCasesSolved(0);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-warning/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Pollution Detective</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-lg">
                  Investigate pollution incidents using environmental data and scientific analysis. 
                  Can you solve the mystery and identify the pollution source?
                </p>
                <div className="bg-gradient-to-r from-warning/10 to-destructive/10 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Detective Tools:</h3>
                  <ul className="text-sm text-left space-y-1">
                    <li>• Analyze scientific data and environmental reports</li>
                    <li>• Investigate clues to identify pollution sources</li>
                    <li>• Use evidence to solve environmental crimes</li>
                    <li>• Score points for quick and accurate solutions</li>
                  </ul>
                </div>
                <Button onClick={startGame} size="lg" className="bg-warning hover:bg-warning/90">
                  <Search className="h-5 w-5 mr-2" />
                  Start Investigation
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
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Investigation Complete!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-success mb-2">{score} Points</div>
                  <div className="text-lg text-muted-foreground mb-4">
                    Cases Solved: {casesSolved}/{cases.length}
                  </div>
                  <Badge className="bg-success text-lg px-4 py-2">
                    {score >= 800 ? "Expert Detective" : score >= 600 ? "Skilled Investigator" : "Detective in Training"}
                  </Badge>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={resetGame} variant="outline" className="flex-1">
                    New Investigation
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

  const case_ = cases[currentCase];
  const isCurrentCaseSolved = selectedSuspect === case_.correctSuspect;

  return (
    <div className="min-h-screen bg-environmental-bg bg-cover bg-center bg-no-repeat p-4">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-warning">Case {currentCase + 1}/{cases.length}</Badge>
              <Badge variant="outline">Score: {score}</Badge>
              <Badge variant="outline">
                <Timer className="h-4 w-4 mr-1" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Badge>
            </div>
            <Progress value={((currentCase + (isCurrentCaseSolved ? 1 : 0)) / cases.length) * 100} className="w-32" />
          </div>

          {/* Case Header */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-warning/20 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                {case_.title}
              </CardTitle>
              <p className="text-muted-foreground">{case_.description}</p>
              <Badge className="w-fit">Location: {case_.location}</Badge>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Clues Section */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Evidence & Clues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {case_.clues.map((clue, index) => (
                    <Card key={clue.id} className="border-2 border-muted">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-sm">{clue.title}</h4>
                          {!revealedClues.has(clue.id) ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => revealClue(clue.id)}
                            >
                              Analyze {revealedClues.size >= 2 && "(-100 pts)"}
                            </Button>
                          ) : (
                            <CheckCircle className="h-5 w-5 text-success" />
                          )}
                        </div>
                        {revealedClues.has(clue.id) && (
                          <div className="space-y-2">
                            <div className="bg-muted p-2 rounded text-sm">
                              <strong>Data:</strong> {clue.data}
                            </div>
                            <div className="text-sm">
                              <strong>Analysis:</strong> {clue.impact}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suspects Section */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Identify the Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {case_.suspects.map(suspect => (
                    <Card
                      key={suspect}
                      className={`cursor-pointer border-2 transition-all ${
                        selectedSuspect === suspect 
                          ? 'border-primary bg-primary/10' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedSuspect(suspect)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedSuspect === suspect ? 'bg-primary border-primary' : 'border-muted'
                          }`} />
                          <span className="font-medium">{suspect}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedSuspect && (
                  <Button 
                    onClick={solveCase}
                    className="w-full bg-warning hover:bg-warning/90"
                    disabled={revealedClues.size === 0}
                  >
                    Solve Case
                  </Button>
                )}

                {isCurrentCaseSolved && (
                  <Card className="mt-4 border-success bg-success/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-bold text-success">Correct!</span>
                      </div>
                      <p className="text-sm">{case_.solution}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}