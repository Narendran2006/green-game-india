import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TreePine, Sprout, Leaf, Timer, Target, Award } from "lucide-react";

interface Tree {
  id: string;
  type: string;
  growthStage: number;
  co2Absorbed: number;
  oxygenProduced: number;
  position: { x: number; y: number };
}

const treeTypes = [
  { name: "Neem", co2Rate: 48, oxygenRate: 35, icon: "🌿" },
  { name: "Banyan", co2Rate: 70, oxygenRate: 50, icon: "🌳" },
  { name: "Mango", co2Rate: 55, oxygenRate: 40, icon: "🥭" },
  { name: "Peepal", co2Rate: 80, oxygenRate: 60, icon: "🍃" }
];

export function TreePlantingGame() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTreeType, setSelectedTreeType] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [totalCO2, setTotalCO2] = useState(0);
  const [totalOxygen, setTotalOxygen] = useState(0);
  const [target, setTarget] = useState(500);

  const startGame = () => {
    setGameStarted(true);
    setTrees([]);
    setTimeLeft(120);
    setTotalCO2(0);
    setTotalOxygen(0);
    setTarget(500);
  };

  const plantTree = (x: number, y: number) => {
    if (!gameStarted || trees.length >= 20) return;

    const treeType = treeTypes[selectedTreeType];
    const newTree: Tree = {
      id: `tree-${Date.now()}`,
      type: treeType.name,
      growthStage: 1,
      co2Absorbed: 0,
      oxygenProduced: 0,
      position: { x, y }
    };

    setTrees(prev => [...prev, newTree]);
  };

  const handleForestClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    plantTree(x, y);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const growthInterval = setInterval(() => {
        setTrees(prevTrees => 
          prevTrees.map(tree => {
            if (tree.growthStage < 5) {
              const treeType = treeTypes.find(t => t.name === tree.type)!;
              return {
                ...tree,
                growthStage: tree.growthStage + 1,
                co2Absorbed: tree.co2Absorbed + treeType.co2Rate,
                oxygenProduced: tree.oxygenProduced + treeType.oxygenRate
              };
            }
            return tree;
          })
        );
      }, 2000);

      return () => clearInterval(growthInterval);
    }
  }, [gameStarted]);

  useEffect(() => {
    const newTotalCO2 = trees.reduce((sum, tree) => sum + tree.co2Absorbed, 0);
    const newTotalOxygen = trees.reduce((sum, tree) => sum + tree.oxygenProduced, 0);
    setTotalCO2(newTotalCO2);
    setTotalOxygen(newTotalOxygen);
  }, [trees]);

  const getTreeSize = (stage: number) => {
    return Math.min(stage * 8 + 12, 32);
  };

  const getTreeEmoji = (tree: Tree) => {
    const treeType = treeTypes.find(t => t.name === tree.type);
    if (tree.growthStage === 1) return "🌱";
    if (tree.growthStage === 2) return "🌿";
    if (tree.growthStage <= 3) return "🌳";
    return treeType?.icon || "🌳";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Virtual Forest Planting</h1>
          <p className="text-muted-foreground">Plant trees and watch them grow while learning about carbon absorption</p>
        </div>

        {!gameStarted ? (
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                <TreePine className="h-8 w-8 text-success-foreground" />
              </div>
              <CardTitle>Plant Your Forest</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Plant different types of trees and learn about their environmental benefits!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {treeTypes.map((tree, index) => (
                  <Card key={tree.name} className="p-3 text-center bg-muted">
                    <div className="text-2xl mb-2">{tree.icon}</div>
                    <div className="font-medium text-sm">{tree.name}</div>
                    <div className="text-xs text-muted-foreground">
                      CO₂: {tree.co2Rate}kg/yr
                    </div>
                  </Card>
                ))}
              </div>
              <Button onClick={startGame} size="lg" className="bg-success text-success-foreground">
                <TreePine className="h-5 w-5 mr-2" />
                Start Planting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xl font-bold">{timeLeft}s</div>
                  <div className="text-xs text-muted-foreground">Time Left</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <TreePine className="h-6 w-6 mx-auto mb-2 text-success" />
                  <div className="text-xl font-bold">{trees.length}</div>
                  <div className="text-xs text-muted-foreground">Trees Planted</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-xl font-bold">{totalCO2}kg</div>
                  <div className="text-xs text-muted-foreground">CO₂ Absorbed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Leaf className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-xl font-bold">{totalOxygen}kg</div>
                  <div className="text-xs text-muted-foreground">O₂ Produced</div>
                </CardContent>
              </Card>
            </div>

            {/* Tree Selection */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Select Tree Type to Plant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {treeTypes.map((tree, index) => (
                    <Button
                      key={tree.name}
                      onClick={() => setSelectedTreeType(index)}
                      variant={selectedTreeType === index ? "default" : "outline"}
                      className="h-20 flex flex-col"
                    >
                      <div className="text-2xl mb-1">{tree.icon}</div>
                      <div className="text-sm">{tree.name}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forest Area */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Forest (Click to plant trees)</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="relative w-full h-80 bg-gradient-to-b from-sky-200 via-green-200 to-green-300 rounded-lg cursor-crosshair overflow-hidden"
                  onClick={handleForestClick}
                >
                  {trees.map((tree) => (
                    <div
                      key={tree.id}
                      className="absolute transition-all duration-500"
                      style={{
                        left: `${tree.position.x}%`,
                        top: `${tree.position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${getTreeSize(tree.growthStage)}px`
                      }}
                    >
                      {getTreeEmoji(tree)}
                    </div>
                  ))}
                  
                  {trees.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Click anywhere to plant your first tree!
                    </div>
                  )}
                </div>
                
                {totalCO2 >= target && (
                  <Badge className="mt-4 bg-success text-success-foreground animate-pulse">
                    <Award className="h-4 w-4 mr-2" />
                    Target Achieved! Great job protecting the environment!
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}