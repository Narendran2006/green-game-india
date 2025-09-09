import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Recycle, 
  Brain, 
  Search, 
  Cloud, 
  TreePine, 
  Droplets,
  Target,
  Zap,
  Award
} from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  badge: string;
  difficulty: string;
}

const games: Game[] = [
  {
    id: "recycling-game",
    title: "Recycle Sorting Game",
    description: "Drag and drop waste items into correct bins. Master proper recycling habits!",
    icon: Recycle,
    color: "text-accent",
    badge: "Interactive",
    difficulty: "Easy"
  },
  {
    id: "quiz-battle",
    title: "Eco Quiz Battle",
    description: "Test your environmental knowledge in timed quiz battles with challenging questions!",
    icon: Brain,
    color: "text-primary",
    badge: "Competitive",
    difficulty: "Medium"
  },
  {
    id: "word-search",
    title: "Word Search Puzzle",
    description: "Find hidden environmental words in puzzle grids. Improve vocabulary while learning!",
    icon: Search,
    color: "text-purple-500",
    badge: "Educational",
    difficulty: "Easy"
  },
  {
    id: "weather-game",
    title: "Weather & Climate Game",
    description: "Learn about weather patterns, climate change and their environmental impact!",
    icon: Cloud,
    color: "text-sky-500",
    badge: "Learning",
    difficulty: "Medium"
  },
  {
    id: "tree-planting",
    title: "Virtual Tree Planting",
    description: "Plant and grow virtual trees while learning about carbon absorption and oxygen production!",
    icon: TreePine,
    color: "text-success",
    badge: "Simulation",
    difficulty: "Easy"
  },
  {
    id: "water-conservation",
    title: "Water Conservation Challenge",
    description: "Make smart water choices in daily activities and learn conservation techniques!",
    icon: Droplets,
    color: "text-blue-500",
    badge: "Challenge",
    difficulty: "Medium"
  }
];

interface GamesGridProps {
  onGameSelect: (gameId: string) => void;
}

export function GamesGrid({ onGameSelect }: GamesGridProps) {
  return (
    <div className="min-h-screen p-4 bg-forest-scene bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Environmental Game Zone
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Choose your adventure! Play interactive games to learn and test your environmental knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <Card 
                key={game.id}
                className="bg-white/95 backdrop-blur-sm shadow-button hover:shadow-success transition-all cursor-pointer animate-bounce-in border-2 border-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onGameSelect(game.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <game.icon className={`h-10 w-10 text-white`} />
                  </div>
                  <CardTitle className="text-xl text-foreground">{game.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-success/90 text-white border-0">
                      <Target className="h-3 w-3 mr-1" />
                      {game.badge}
                    </Badge>
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      {game.difficulty}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Click to play</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievement Section */}
          <Card className="mt-12 bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-eco-gold to-eco-gold/80 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Game Achievements</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Complete games to earn eco-points, unlock badges, and climb the leaderboard!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-lg">Eco Points</div>
                  <div className="text-sm text-muted-foreground">Earn points for every game completed</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-success/10 to-success/20 rounded-lg">
                  <Award className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="font-bold text-lg">Badges</div>
                  <div className="text-sm text-muted-foreground">Unlock special achievements</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="font-bold text-lg">Leaderboard</div>
                  <div className="text-sm text-muted-foreground">Compete with other eco-champions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}