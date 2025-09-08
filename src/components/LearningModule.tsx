import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TreePine, 
  Droplets, 
  Recycle, 
  Leaf, 
  Zap, 
  Users, 
  ChevronRight, 
  Play,
  CheckCircle,
  BookOpen,
  Target
} from "lucide-react";

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  content: {
    facts: string[];
    tips: string[];
    imagePrompt: string;
  };
}

const learningTopics: LearningTopic[] = [
  {
    id: "climate-change",
    title: "Climate Change in India",
    description: "Learn about India's climate challenges and solutions",
    icon: TreePine,
    color: "text-success",
    content: {
      facts: [
        "India is the world's 3rd largest carbon emitter",
        "Monsoons are becoming more unpredictable due to climate change",
        "Sea levels are rising, affecting coastal cities like Mumbai",
        "India aims to achieve net-zero emissions by 2070"
      ],
      tips: [
        "Use public transport or cycle to school",
        "Plant trees in your locality",
        "Save electricity by switching off unused lights",
        "Choose local seasonal fruits and vegetables"
      ],
      imagePrompt: "Indian students planting trees in a school compound with the Indian flag"
    }
  },
  {
    id: "water-conservation",
    title: "Water Conservation",
    description: "Understand India's water crisis and conservation methods",
    icon: Droplets,
    color: "text-blue-500",
    content: {
      facts: [
        "India has 18% of world's population but only 4% of freshwater",
        "Chennai ran out of water in 2019 affecting 10 million people",
        "Groundwater levels are falling rapidly in North India",
        "Rainwater harvesting can save 40% of water needs"
      ],
      tips: [
        "Fix leaking taps immediately",
        "Reuse water from washing vegetables for plants",
        "Take shorter showers",
        "Collect rainwater in buckets and containers"
      ],
      imagePrompt: "Indian children collecting rainwater in traditional earthen pots"
    }
  },
  {
    id: "waste-management",
    title: "Waste Management",
    description: "Master the art of reducing, reusing, and recycling",
    icon: Recycle,
    color: "text-accent",
    content: {
      facts: [
        "India generates 62 million tons of waste annually",
        "Only 43 million tons are collected and 12 million treated",
        "Plastic bags take 1000 years to decompose",
        "Composting organic waste reduces methane emissions"
      ],
      tips: [
        "Carry a cloth bag for shopping",
        "Separate wet and dry waste at home",
        "Donate old clothes and books",
        "Make compost from kitchen scraps"
      ],
      imagePrompt: "Indian students sorting colorful waste into different recycling bins"
    }
  },
  {
    id: "biodiversity",
    title: "India's Biodiversity",
    description: "Explore India's rich flora and fauna",
    icon: Leaf,
    color: "text-green-600",
    content: {
      facts: [
        "India is one of 17 megadiverse countries",
        "Home to 8% of global biodiversity",
        "Has 4 biodiversity hotspots including Western Ghats",
        "Over 45,000 plant species and 91,000 animal species"
      ],
      tips: [
        "Create a small garden with native plants",
        "Don't disturb bird nests or animal habitats",
        "Participate in nature walks and bird watching",
        "Support local organic farming"
      ],
      imagePrompt: "Diverse Indian wildlife including tigers, elephants, and colorful birds in a forest"
    }
  },
  {
    id: "renewable-energy",
    title: "Renewable Energy",
    description: "Discover clean energy sources for India's future",
    icon: Zap,
    color: "text-yellow-500",
    content: {
      facts: [
        "India has 4th largest renewable energy capacity globally",
        "Solar energy potential is 748 GW in India",
        "Rajasthan produces 25% of India's solar power",
        "India aims for 500 GW renewable capacity by 2030"
      ],
      tips: [
        "Use solar calculators and small solar devices",
        "Encourage your school to install solar panels",
        "Learn about wind energy in coastal areas",
        "Promote solar water heaters in your community"
      ],
      imagePrompt: "Solar panels on Indian school rooftops with students learning about renewable energy"
    }
  },
  {
    id: "sustainability",
    title: "Sustainable Living",
    description: "Adopt eco-friendly lifestyle choices",
    icon: Users,
    color: "text-purple-500",
    content: {
      facts: [
        "Indians have one of the lowest per-capita carbon footprints globally",
        "Traditional Indian practices are inherently sustainable",
        "Organic farming can increase soil health by 30%",
        "Sustainable practices can create 24 million jobs by 2030"
      ],
      tips: [
        "Buy local products to reduce transport emissions",
        "Use natural alternatives like neem for pest control",
        "Practice 'Reduce, Reuse, Recycle' daily",
        "Choose eco-friendly festivals and celebrations"
      ],
      imagePrompt: "Indian family practicing sustainable living with traditional methods and modern eco-friendly solutions"
    }
  }
];

interface LearningModuleProps {
  onTestLevel: () => void;
}

export function LearningModule({ onTestLevel }: LearningModuleProps) {
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSection] = useState<'facts' | 'tips'>('facts');

  const handleTopicComplete = (topicId: string) => {
    setCompletedTopics(prev => new Set([...prev, topicId]));
    setSelectedTopic(null);
  };

  const progress = (completedTopics.size / learningTopics.length) * 100;
  const allTopicsCompleted = completedTopics.size === learningTopics.length;

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => setSelectedTopic(null)}
              variant="outline"
            >
              ← Back to Topics
            </Button>
            <Badge className="bg-primary text-primary-foreground">
              <BookOpen className="h-3 w-3 mr-1" />
              Learning Mode
            </Badge>
          </div>

          {/* Topic Header */}
          <Card className="bg-gradient-card shadow-card mb-6">
            <CardHeader className="text-center">
              <div className={`mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4`}>
                <selectedTopic.icon className={`h-8 w-8 text-primary-foreground`} />
              </div>
              <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
              <p className="text-muted-foreground">{selectedTopic.description}</p>
            </CardHeader>
          </Card>

          {/* Content Navigation */}
          <div className="flex gap-2 mb-6">
            <Button 
              onClick={() => setCurrentSection('facts')}
              variant={currentSection === 'facts' ? 'default' : 'outline'}
              className="flex-1"
            >
              📚 Key Facts
            </Button>
            <Button 
              onClick={() => setCurrentSection('tips')}
              variant={currentSection === 'tips' ? 'default' : 'outline'}
              className="flex-1"
            >
              💡 Action Tips
            </Button>
          </div>

          {/* Content */}
          <Card className="bg-gradient-card shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentSection === 'facts' ? '🌍 Did You Know?' : '🎯 What You Can Do'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(currentSection === 'facts' ? selectedTopic.content.facts : selectedTopic.content.tips).map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1`}>
                      <span className="text-primary-foreground text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Complete Topic Button */}
          <div className="text-center">
            <Button 
              onClick={() => handleTopicComplete(selectedTopic.id)}
              className="bg-success text-success-foreground hover:bg-success/90 text-lg px-8 py-3"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Complete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Environmental Learning Hub</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Master environmental concepts through interactive learning modules
          </p>
          
          {/* Progress */}
          <Card className="max-w-md mx-auto bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Learning Progress</span>
                <span className="text-sm text-muted-foreground">{completedTopics.size}/{learningTopics.length}</span>
              </div>
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-xs text-muted-foreground">
                {allTopicsCompleted ? "🎉 All topics completed!" : `${Math.round(progress)}% complete`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {learningTopics.map((topic, index) => {
            const isCompleted = completedTopics.has(topic.id);
            
            return (
              <Card 
                key={topic.id}
                className={`bg-gradient-card shadow-card hover:shadow-button transition-all cursor-pointer animate-bounce-in ${
                  isCompleted ? 'ring-2 ring-success' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedTopic(topic)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`mx-auto w-16 h-16 ${isCompleted ? 'bg-success' : 'bg-primary'} rounded-full flex items-center justify-center mb-4 relative`}>
                    <topic.icon className={`h-8 w-8 ${isCompleted ? 'text-success-foreground' : 'text-primary-foreground'}`} />
                    {isCompleted && (
                      <CheckCircle className="absolute -top-1 -right-1 h-6 w-6 text-success bg-background rounded-full" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground text-sm mb-4">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-success text-success-foreground" : ""}>
                      {isCompleted ? "✓ Completed" : "Start Learning"}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Test Your Level Section */}
        {allTopicsCompleted && (
          <Card className="bg-gradient-success shadow-success animate-bounce-in">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Target className="h-16 w-16 mx-auto text-success-foreground mb-4 animate-bounce-in" />
                <h2 className="text-2xl font-bold text-success-foreground mb-2">
                  🎉 Congratulations!
                </h2>
                <p className="text-success-foreground/80 text-lg">
                  You've completed all learning modules. Ready to test your environmental knowledge?
                </p>
              </div>
              
              <Button 
                onClick={onTestLevel}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-button text-lg px-8 py-3 animate-pulse-glow"
              >
                <Play className="h-5 w-5 mr-2" />
                Test Your Level
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Partial Progress CTA */}
        {!allTopicsCompleted && completedTopics.size > 0 && (
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Keep Going! 🌱</h3>
              <p className="text-muted-foreground mb-4">
                Complete all topics to unlock the testing games
              </p>
              <Button 
                onClick={onTestLevel}
                variant="outline"
                disabled={!allTopicsCompleted}
              >
                <Play className="h-4 w-4 mr-2" />
                Test Available After Learning
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}