import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Leaf, 
  Trophy, 
  Target, 
  Zap, 
  Award, 
  TreePine, 
  Recycle, 
  Droplets,
  Calendar,
  TrendingUp,
  Star,
  Crown,
  Shield,
  Flame,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Gift,
  Medal,
  Brain
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  rarity: string;
  dateEarned: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  completed: boolean;
}

interface StudentStats {
  name: string;
  ecoPoints: number;
  level: string;
  levelNumber: number;
  streak: number;
  badges: Badge[];
  achievements: Achievement[];
  recentActivity: Array<{
    action: string;
    points: number;
    timestamp: string;
    type: string;
  }>;
  totalGamesPlayed: number;
  totalLessonsCompleted: number;
  rank: number;
  nextLevelPoints: number;
}

export function StudentDashboard() {
  const [studentData] = useState<StudentStats>({
    name: "Priya Sharma",
    ecoPoints: 2850,
    level: "Eco Champion",
    levelNumber: 8,
    streak: 12,
    nextLevelPoints: 3500,
    totalGamesPlayed: 47,
    totalLessonsCompleted: 23,
    rank: 12,
    badges: [
      {
        id: "tree-planter",
        name: "Forest Guardian",
        description: "Planted 50+ virtual trees",
        icon: TreePine,
        color: "text-success",
        rarity: "Epic",
        dateEarned: "2024-01-15"
      },
      {
        id: "water-saver",
        name: "Aqua Protector",
        description: "Saved 1000L+ water in challenges",
        icon: Droplets,
        color: "text-blue-500",
        rarity: "Rare",
        dateEarned: "2024-01-12"
      },
      {
        id: "recycling-master",
        name: "Recycling Master",
        description: "Perfect score in 10 recycling games",
        icon: Recycle,
        color: "text-accent",
        rarity: "Legendary",
        dateEarned: "2024-01-10"
      },
      {
        id: "quiz-champion",
        name: "Knowledge Champion",
        description: "Won 25+ quiz battles",
        icon: Brain,
        color: "text-primary",
        rarity: "Epic",
        dateEarned: "2024-01-08"
      },
      {
        id: "streak-master",
        name: "Consistency King",
        description: "Maintained 10+ day streak",
        icon: Flame,
        color: "text-orange-500",
        rarity: "Rare",
        dateEarned: "2024-01-05"
      }
    ],
    achievements: [
      {
        id: "eco-points-3000",
        title: "Eco Point Collector",
        description: "Earn 3000 eco points",
        progress: 2850,
        maxProgress: 3000,
        reward: 200,
        completed: false
      },
      {
        id: "games-50",
        title: "Game Master",
        description: "Play 50 different games",
        progress: 47,
        maxProgress: 50,
        reward: 150,
        completed: false
      },
      {
        id: "lessons-25",
        title: "Learning Enthusiast",
        description: "Complete 25 learning modules",
        progress: 23,
        maxProgress: 25,
        reward: 100,
        completed: false
      }
    ],
    recentActivity: [
      { action: "Won Water Conservation Challenge", points: 120, timestamp: "1 hour ago", type: "game" },
      { action: "Completed Tree Planting Simulation", points: 95, timestamp: "3 hours ago", type: "game" },
      { action: "Perfect score in Eco Quiz Battle", points: 150, timestamp: "5 hours ago", type: "quiz" },
      { action: "Finished Biodiversity Learning Module", points: 100, timestamp: "1 day ago", type: "learning" },
      { action: "Achieved 12-day learning streak", points: 50, timestamp: "1 day ago", type: "achievement" },
      { action: "Earned 'Consistency King' badge", points: 200, timestamp: "2 days ago", type: "badge" }
    ]
  });

  const getProgressToNext = (points: number) => {
    return ((points / studentData.nextLevelPoints) * 100);
  };

  const getLevelColor = (levelNumber: number) => {
    if (levelNumber >= 10) return "text-purple-600";
    if (levelNumber >= 7) return "text-yellow-500";
    if (levelNumber >= 4) return "text-blue-500";
    return "text-green-500";
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "from-yellow-400 to-orange-500";
      case "Epic": return "from-purple-400 to-pink-500";
      case "Rare": return "from-blue-400 to-cyan-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "game": return Target;
      case "quiz": return Brain;
      case "learning": return BookOpen;
      case "achievement": return Trophy;
      case "badge": return Award;
      default: return CheckCircle;
    }
  };

  return (
    <div className="min-h-screen p-4 bg-environmental-bg bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-4 border-primary shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-2xl font-bold">
                    {studentData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back, {studentData.name}!</h1>
                  <p className="text-muted-foreground mb-3 text-lg">Ready to save the planet today?</p>
                  <div className="flex items-center space-x-6">
                    <Badge className={`px-3 py-1 text-white bg-gradient-to-r ${getRarityColor("Epic")}`}>
                      <Crown className="h-4 w-4 mr-1" />
                      Level {studentData.levelNumber}: {studentData.level}
                    </Badge>
                    <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                      <Flame className="h-4 w-4 mr-1 text-orange-500" />
                      <span className="font-bold text-orange-700">{studentData.streak} day streak!</span>
                    </div>
                    <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="font-bold text-blue-700">Rank #{studentData.rank}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-eco-gold to-eco-gold/80 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-eco-gold">{studentData.ecoPoints}</div>
                <div className="text-sm text-muted-foreground">Eco Points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary">{studentData.badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-success">{studentData.totalGamesPlayed}</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-accent">{studentData.totalLessonsCompleted}</div>
                <div className="text-sm text-muted-foreground">Lessons</div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <TrendingUp className="h-6 w-6 mr-2 text-primary" />
                  Level Progress
                </CardTitle>
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  Next: {studentData.nextLevelPoints - studentData.ecoPoints} points needed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>Current: {studentData.ecoPoints} points</span>
                  <span>Next Level: {studentData.nextLevelPoints} points</span>
                </div>
                <Progress value={getProgressToNext(studentData.ecoPoints)} className="h-4" />
                <p className="text-center text-muted-foreground">
                  {Math.round(getProgressToNext(studentData.ecoPoints))}% complete to next level
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Badges Collection */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Award className="h-6 w-6 mr-2 text-primary" />
                Badge Collection ({studentData.badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentData.badges.map((badge, index) => (
                  <div 
                    key={badge.id} 
                    className="relative p-4 bg-gradient-to-br from-muted/50 to-muted/80 rounded-xl hover:shadow-button transition-all animate-bounce-in border-2 border-transparent hover:border-primary/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                        <badge.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(badge.dateEarned).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Progress */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="h-6 w-6 mr-2 text-primary" />
                Active Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.achievements.map((achievement, index) => (
                  <div 
                    key={achievement.id} 
                    className="p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{achievement.title}</h3>
                      <Badge className="bg-eco-gold text-foreground">
                        <Gift className="h-3 w-3 mr-1" />
                        +{achievement.reward} points
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                        <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-card border-2 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Clock className="h-6 w-6 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentData.recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg animate-fade-in hover:shadow-sm transition-all"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                          <ActivityIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground font-bold">
                        +{activity.points} points
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}