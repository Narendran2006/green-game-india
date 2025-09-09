import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, Timer, RotateCcw } from "lucide-react";

const ENVIRONMENTAL_WORDS = [
  "RECYCLE", "SOLAR", "WATER", "FOREST", "CLIMATE", "CARBON", 
  "ORGANIC", "ENERGY", "WASTE", "GREEN", "PLANT", "OZONE"
];

const GRID_SIZE = 12;

interface Position {
  row: number;
  col: number;
}

export function WordSearchGame() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);

  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill('')
    );

    // Place words randomly
    const usedWords = [];
    for (const word of ENVIRONMENTAL_WORDS.slice(0, 8)) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 50) {
        const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        
        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction);
          usedWords.push(word);
          placed = true;
        }
        attempts++;
      }
    }

    // Fill empty cells with random letters
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: string) => {
    if (direction === 'horizontal') {
      if (col + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
      }
    } else {
      if (row + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
      }
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, direction: string) => {
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameStarted) return;
    
    if (!isSelecting) {
      setSelectedCells([{ row, col }]);
      setIsSelecting(true);
    } else {
      const newSelection = [...selectedCells, { row, col }];
      setSelectedCells(newSelection);
      checkForWord(newSelection);
    }
  };

  const checkForWord = (cells: Position[]) => {
    if (cells.length < 2) return;
    
    const word = cells.map(cell => grid[cell.row][cell.col]).join('');
    const reverseWord = word.split('').reverse().join('');
    
    if (ENVIRONMENTAL_WORDS.includes(word) && !foundWords.has(word)) {
      setFoundWords(prev => new Set([...prev, word]));
      setScore(prev => prev + word.length * 10);
      setSelectedCells([]);
      setIsSelecting(false);
    } else if (ENVIRONMENTAL_WORDS.includes(reverseWord) && !foundWords.has(reverseWord)) {
      setFoundWords(prev => new Set([...prev, reverseWord]));
      setScore(prev => prev + reverseWord.length * 10);
      setSelectedCells([]);
      setIsSelecting(false);
    }
  };

  const resetSelection = () => {
    setSelectedCells([]);
    setIsSelecting(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(300);
    setScore(0);
    setFoundWords(new Set());
    generateGrid();
  };

  const resetGame = () => {
    setGameStarted(false);
    setTimeLeft(300);
    setScore(0);
    setFoundWords(new Set());
    setSelectedCells([]);
    setIsSelecting(false);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Environmental Word Search</h1>
          <p className="text-muted-foreground">Find hidden environmental words in the puzzle</p>
        </div>

        {!gameStarted ? (
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>Ready to Search?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Find these environmental words hidden in the grid:
              </p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {ENVIRONMENTAL_WORDS.slice(0, 8).map(word => (
                  <Badge key={word} variant="outline">{word}</Badge>
                ))}
              </div>
              <Button onClick={startGame} size="lg" className="bg-primary text-primary-foreground">
                <Search className="h-5 w-5 mr-2" />
                Start Game
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
                  <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-4 text-center">
                  <Search className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">{foundWords.size}/8</div>
                  <div className="text-sm text-muted-foreground">Words Found</div>
                </CardContent>
              </Card>
            </div>

            {/* Game Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              <Card className="flex-1 bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="grid grid-cols-12 gap-1 mb-4">
                    {grid.map((row, rowIndex) =>
                      row.map((cell, colIndex) => {
                        const isSelected = selectedCells.some(pos => 
                          pos.row === rowIndex && pos.col === colIndex
                        );
                        
                        return (
                          <button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className={`
                              w-6 h-6 text-xs font-bold border border-border rounded
                              transition-colors duration-200
                              ${isSelected 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted hover:bg-muted/80'
                              }
                            `}
                          >
                            {cell}
                          </button>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={resetSelection} variant="outline" size="sm">
                      Clear Selection
                    </Button>
                    <Button onClick={resetGame} variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Game
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Words List */}
              <Card className="w-full lg:w-64 bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Find These Words</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ENVIRONMENTAL_WORDS.slice(0, 8).map(word => (
                      <div 
                        key={word} 
                        className={`p-2 rounded text-sm font-medium transition-colors ${
                          foundWords.has(word) 
                            ? 'bg-success text-success-foreground line-through' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}