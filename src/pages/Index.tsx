import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentDashboard } from "@/components/StudentDashboard";
import { RecycleSortingGame } from "@/components/RecycleSortingGame";
import { EcoQuizBattle } from "@/components/EcoQuizBattle";
import { LearningModule } from "@/components/LearningModule";
import { 
  Leaf, 
  Recycle, 
  Brain, 
  Trophy, 
  TreePine, 
  Droplets, 
  Zap,
  Users,
  Award,
  Target
} from "lucide-react";

type CurrentView = 'home' | 'dashboard' | 'learning' | 'recycling-game' | 'quiz-battle';

const Index = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'learning':
        return <LearningModule onTestLevel={() => setCurrentView('recycling-game')} />;
      case 'recycling-game':
        return <RecycleSortingGame />;
      case 'quiz-battle':
        return <EcoQuizBattle />;
      default:
        return <HomePage />;
    }
  };

  const HomePage = () => (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="animate-bounce-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EcoLearn
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Gamified Environmental Education for Indian Students
            </p>
            <p className="text-lg mb-12 max-w-2xl mx-auto opacity-80">
              Learn, Play, and Save the Planet! Earn eco-points, badges, and compete with friends while building sustainable habits.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button 
              size="lg" 
              onClick={() => setCurrentView('learning')}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-button text-lg px-8 py-3"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setCurrentView('recycling-game')}
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-3"
            >
              <Recycle className="h-5 w-5 mr-2" />
              Play Games
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Learn Through Play
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive games and challenges that make environmental education fun and engaging
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Game Cards */}
            <Card 
              className="bg-gradient-card shadow-card hover:shadow-button transition-all cursor-pointer animate-bounce-in"
              onClick={() => setCurrentView('recycling-game')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Recycle className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle>Recycle Sorting Game</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Drag and drop waste items into correct bins. Learn proper recycling habits!
                </p>
                <Badge className="bg-success text-success-foreground">
                  <Target className="h-3 w-3 mr-1" />
                  Interactive
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-card shadow-card hover:shadow-button transition-all cursor-pointer animate-bounce-in"
              onClick={() => setCurrentView('quiz-battle')}
              style={{ animationDelay: '0.1s' }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle>Eco Quiz Battle</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Test your environmental knowledge in timed quiz battles with friends!
                </p>
                <Badge className="bg-accent text-accent-foreground">
                  <Zap className="h-3 w-3 mr-1" />
                  Competitive
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-card shadow-card hover:shadow-button transition-all cursor-pointer animate-bounce-in"
              onClick={() => setCurrentView('learning')}
              style={{ animationDelay: '0.2s' }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-success-foreground" />
                </div>
                <CardTitle>Learning Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Interactive learning modules with environmental topics and progress tracking!
                </p>
                <Badge className="bg-eco-gold text-foreground">
                  <Award className="h-3 w-3 mr-1" />
                  Learn & Progress
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Making Real Impact
            </h2>
            <p className="text-xl text-muted-foreground">
              Students across India are learning and taking action
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-bounce-in">
              <div className="text-4xl md:text-5xl font-bold text-success mb-2">5K+</div>
              <p className="text-muted-foreground">Students Learning</p>
            </div>
            <div className="text-center animate-bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">100K+</div>
              <p className="text-muted-foreground">Eco Points Earned</p>
            </div>
            <div className="text-center animate-bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-eco-gold mb-2">1M+</div>
              <p className="text-muted-foreground">Questions Answered</p>
            </div>
            <div className="text-center animate-bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Schools Joined</p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Topics */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive environmental topics designed for Indian students
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: TreePine, label: "Climate Change", color: "text-success" },
              { icon: Recycle, label: "Recycling", color: "text-accent" },
              { icon: Droplets, label: "Water Conservation", color: "text-blue-500" },
              { icon: Leaf, label: "Biodiversity", color: "text-green-600" },
              { icon: Zap, label: "Renewable Energy", color: "text-yellow-500" },
              { icon: Users, label: "Sustainability", color: "text-purple-500" },
            ].map((topic, index) => (
              <Card 
                key={topic.label} 
                className="bg-gradient-card shadow-card text-center hover:shadow-button transition-all animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <topic.icon className={`h-12 w-12 mx-auto mb-3 ${topic.color}`} />
                  <p className="font-medium text-sm">{topic.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Become an Eco-Champion?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already making a difference for our planet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setCurrentView('learning')}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-button text-lg px-8 py-3"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setCurrentView('quiz-battle')}
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-3"
            >
              <Brain className="h-5 w-5 mr-2" />
              Test Your Knowledge
            </Button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="relative">
      {/* Navigation */}
      {currentView !== 'home' && (
        <div className="fixed top-4 left-4 z-50">
          <Button 
            onClick={() => setCurrentView('home')}
            variant="secondary"
            className="shadow-button"
          >
            ← Back to Home
          </Button>
        </div>
      )}
      
      {renderCurrentView()}
    </div>
  );
};

export default Index;
