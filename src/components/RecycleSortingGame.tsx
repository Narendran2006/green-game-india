import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, Recycle, Zap, TreePine, Award, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WasteItem {
  id: string;
  name: string;
  category: 'organic' | 'recyclable' | 'hazardous' | 'e-waste';
  emoji: string;
}

interface Bin {
  type: 'organic' | 'recyclable' | 'hazardous' | 'e-waste';
  name: string;
  color: string;
  icon: string;
}

const wasteItems: WasteItem[] = [
  { id: '1', name: 'Apple Core', category: 'organic', emoji: '🍎' },
  { id: '2', name: 'Plastic Bottle', category: 'recyclable', emoji: '🍶' },
  { id: '3', name: 'Battery', category: 'hazardous', emoji: '🔋' },
  { id: '4', name: 'Old Phone', category: 'e-waste', emoji: '📱' },
  { id: '5', name: 'Banana Peel', category: 'organic', emoji: '🍌' },
  { id: '6', name: 'Newspaper', category: 'recyclable', emoji: '📰' },
  { id: '7', name: 'Paint Can', category: 'hazardous', emoji: '🎨' },
  { id: '8', name: 'Laptop', category: 'e-waste', emoji: '💻' },
  { id: '9', name: 'Glass Jar', category: 'recyclable', emoji: '🫙' },
  { id: '10', name: 'Medicine', category: 'hazardous', emoji: '💊' },
];

const bins: Bin[] = [
  { type: 'organic', name: 'Organic Waste', color: 'bg-green-100 border-green-400', icon: '🌱' },
  { type: 'recyclable', name: 'Recyclable', color: 'bg-blue-100 border-blue-400', icon: '♻️' },
  { type: 'hazardous', name: 'Hazardous', color: 'bg-red-100 border-red-400', icon: '⚠️' },
  { type: 'e-waste', name: 'E-Waste', color: 'bg-purple-100 border-purple-400', icon: '📺' },
];

export function RecycleSortingGame() {
  const [currentItems, setCurrentItems] = useState<WasteItem[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [draggedItem, setDraggedItem] = useState<WasteItem | null>(null);
  const { toast } = useToast();
  const dragCounter = useRef(0);

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setLevel(1);
    setItemsCompleted(0);
    generateNewItems();
  };

  const generateNewItems = useCallback(() => {
    const shuffled = [...wasteItems].sort(() => 0.5 - Math.random());
    setCurrentItems(shuffled.slice(0, 5));
  }, []);

  const handleDragStart = (e: React.DragEvent, item: WasteItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    e.currentTarget.classList.add('bg-muted', 'scale-105');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      e.currentTarget.classList.remove('bg-muted', 'scale-105');
    }
  };

  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    e.currentTarget.classList.remove('bg-muted', 'scale-105');
    
    if (!draggedItem) return;

    const isCorrect = draggedItem.category === binType;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
      setItemsCompleted(prev => prev + 1);
      setCurrentItems(prev => prev.filter(item => item.id !== draggedItem.id));
      
      toast({
        title: "Correct! 🎉",
        description: `Great job sorting the ${draggedItem.name}!`,
        className: "bg-success text-success-foreground",
      });

      // Check if level completed
      if (currentItems.length === 1) {
        setLevel(prev => prev + 1);
        toast({
          title: "Level Complete! 🏆",
          description: `Moving to level ${level + 1}`,
          className: "bg-eco-gold text-foreground",
        });
        
        if (level >= 3) {
          endGame();
        } else {
          setTimeout(() => generateNewItems(), 1000);
        }
      }
    } else {
      toast({
        title: "Oops! Try again 🤔",
        description: `${draggedItem.name} doesn't belong in ${binType} waste.`,
        variant: "destructive",
      });
    }
    
    setDraggedItem(null);
  };

  const endGame = () => {
    setGameEnded(true);
    const finalScore = score + (level * 500);
    setScore(finalScore);
    
    toast({
      title: "Game Complete! 🌟",
      description: `Final Score: ${finalScore} points! You're an eco-hero!`,
      className: "bg-gradient-success text-success-foreground animate-pulse-glow",
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gradient-card shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Recycle className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Recycle Sorting Game</CardTitle>
            <p className="text-muted-foreground">
              Sort waste items into the correct bins and learn proper recycling!
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <span className="text-green-600">🌱</span> Organic
              </div>
              <div className="p-2 bg-muted rounded">
                <span className="text-blue-600">♻️</span> Recyclable
              </div>
              <div className="p-2 bg-muted rounded">
                <span className="text-red-600">⚠️</span> Hazardous
              </div>
              <div className="p-2 bg-muted rounded">
                <span className="text-purple-600">📺</span> E-Waste
              </div>
            </div>
            <Button 
              onClick={startGame}
              className="w-full bg-primary hover:bg-primary/90 shadow-button"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gradient-success shadow-success">
          <CardHeader className="text-center">
            <Award className="h-16 w-16 mx-auto text-success-foreground mb-4 animate-bounce-in" />
            <CardTitle className="text-2xl text-success-foreground">Congratulations!</CardTitle>
            <p className="text-success-foreground/80">You completed all levels!</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-success-foreground">{score} Points</p>
              <p className="text-success-foreground/80">Level {level} Reached</p>
              <Badge className="bg-eco-gold text-foreground">
                <TreePine className="h-4 w-4 mr-1" />
                Eco-Sorting Master
              </Badge>
            </div>
            <Button 
              onClick={resetGame}
              variant="secondary"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Game Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Recycle Sorting Game</h1>
            <p className="text-muted-foreground">Level {level} • Drag items to correct bins</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-success">{score} pts</p>
            <p className="text-sm text-muted-foreground">{itemsCompleted} sorted</p>
          </div>
        </div>
        <Progress value={(itemsCompleted / (level * 5)) * 100} className="h-2" />
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Items to Sort */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="h-5 w-5 mr-2" />
              Items to Sort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="p-4 bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing hover:shadow-button transition-all animate-bounce-in"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <p className="text-sm font-medium">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sorting Bins */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bins.map((bin) => (
            <Card
              key={bin.type}
              className={`${bin.color} border-2 border-dashed transition-all duration-200 min-h-32`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, bin.type)}
            >
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <div className="text-3xl mb-2">{bin.icon}</div>
                <p className="font-medium text-sm">{bin.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}