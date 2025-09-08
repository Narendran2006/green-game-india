import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Leaf, Recycle, Zap, Star, TreePine, Droplets } from "lucide-react";
import { useState } from "react";

interface StudentStats {
  name: string;
  ecoPoints: number;
  level: string;
  streak: number;
  badges: string[];
  recentActivity: string[];
}

export function StudentDashboard() {
  const [studentData] = useState<StudentStats>({
    name: "Priya Sharma",
    ecoPoints: 2450,
    level: "Silver",
    streak: 12,
    badges: ["Tree Planter", "Water Saver", "Recycle Champion"],
    recentActivity: [
      "Completed Plastic Free Week Challenge",
      "Planted 3 trees in school garden",
      "Aced the Climate Quiz with 95%",
      "Helped organize school recycling drive"
    ]
  });

  const getProgressToNext = (points: number) => {
    if (points < 1000) return (points / 1000) * 100;
    if (points < 3000) return ((points - 1000) / 2000) * 100;
    if (points < 6000) return ((points - 3000) / 3000) * 100;
    return 100;
  };

  const getNextLevel = (points: number) => {
    if (points < 1000) return "Silver";
    if (points < 3000) return "Gold";
    if (points < 6000) return "Eco-Champion";
    return "Max Level";
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Tree Planter": return <TreePine className="h-4 w-4" />;
      case "Water Saver": return <Droplets className="h-4 w-4" />;
      case "Recycle Champion": return <Recycle className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Ready to save the planet today?</p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder.svg" alt={studentData.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {studentData.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Eco Points</p>
                <p className="text-2xl font-bold text-success">{studentData.ecoPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-eco-gold" />
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold text-eco-gold">{studentData.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-2xl font-bold text-accent">{studentData.streak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Badges</p>
                <p className="text-2xl font-bold text-warning">{studentData.badges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-eco-gold" />
            <span>Progress to {getNextLevel(studentData.ecoPoints)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={getProgressToNext(studentData.ecoPoints)} 
            className="h-3"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Keep going! You're {Math.ceil((3000 - studentData.ecoPoints) / 100) * 100} points away from {getNextLevel(studentData.ecoPoints)} level.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="bg-primary hover:bg-primary/90 shadow-button h-12">
            <Recycle className="h-5 w-5 mr-2" />
            Sorting Game
          </Button>
          <Button variant="secondary" className="h-12">
            <Zap className="h-5 w-5 mr-2" />
            Daily Quiz
          </Button>
          <Button variant="outline" className="h-12">
            <TreePine className="h-5 w-5 mr-2" />
            New Challenge
          </Button>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {studentData.badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-gradient-badge text-foreground p-2 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {getBadgeIcon(badge)}
                <span className="ml-1">{badge}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <p className="text-sm">{activity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}