import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trees, Fish, Mountain, Building, Award, AlertTriangle, CheckCircle, Eye } from "lucide-react";

interface Species {
  id: string;
  name: string;
  type: "flora" | "fauna";
  habitat: "forest" | "lake" | "mountain" | "urban";
  status: "thriving" | "declining" | "endangered" | "extinct";
  population: number;
  threats: string[];
  conservation: string[];
  facts: string[];
  discovered: boolean;
}

interface Ecosystem {
  id: string;
  name: string;
  description: string;
  icon: any;
  species: Species[];
  biodiversityScore: number;
  threats: string[];
}

const ecosystems: Ecosystem[] = [
  {
    id: "forest",
    name: "Temperate Forest",
    description: "Dense woodland ecosystem with diverse plant and animal life",
    icon: Trees,
    biodiversityScore: 85,
    threats: ["Deforestation", "Climate Change", "Invasive Species"],
    species: [
      {
        id: "oak-tree",
        name: "Ancient Oak",
        type: "flora",
        habitat: "forest",
        status: "thriving",
        population: 15000,
        threats: ["Disease", "Urban Development"],
        conservation: ["Protected Areas", "Reforestation Programs"],
        facts: ["Can live over 1000 years", "Supports 500+ insect species", "Produces 260 pounds of oxygen annually"],
        discovered: false
      },
      {
        id: "red-squirrel",
        name: "Red Squirrel",
        type: "fauna",
        habitat: "forest",
        status: "declining",
        population: 8500,
        threats: ["Habitat Loss", "Competition from Grey Squirrels"],
        conservation: ["Habitat Protection", "Supplemental Feeding Programs"],
        facts: ["Caches up to 10,000 nuts per year", "Important seed disperser", "Lives in tree cavities"],
        discovered: false
      },
      {
        id: "spotted-owl",
        name: "Spotted Owl",
        type: "fauna",
        habitat: "forest",
        status: "endangered",
        population: 1200,
        threats: ["Old-growth Forest Loss", "Barred Owl Competition"],
        conservation: ["Critical Habitat Designation", "Research Programs"],
        facts: ["Requires old-growth forests", "Indicator species for forest health", "Nests in tree cavities"],
        discovered: false
      }
    ]
  },
  {
    id: "lake",
    name: "Freshwater Lake",
    description: "Aquatic ecosystem supporting diverse fish, birds, and plant species",
    icon: Fish,
    biodiversityScore: 72,
    threats: ["Water Pollution", "Overfishing", "Invasive Species"],
    species: [
      {
        id: "native-trout",
        name: "Native Trout",
        type: "fauna",
        habitat: "lake",
        status: "declining",
        population: 5500,
        threats: ["Water Temperature Rise", "Pollution", "Overfishing"],
        conservation: ["Fishing Regulations", "Water Quality Monitoring"],
        facts: ["Cold-water specialist", "Indicator of water quality", "Can live up to 20 years"],
        discovered: false
      },
      {
        id: "water-lily",
        name: "White Water Lily",
        type: "flora",
        habitat: "lake",
        status: "thriving",
        population: 3200,
        threats: ["Water Pollution", "Boat Traffic"],
        conservation: ["Wetland Protection", "Buffer Zones"],
        facts: ["Provides oxygen to water", "Habitat for aquatic insects", "Flowers open only during day"],
        discovered: false
      },
      {
        id: "great-blue-heron",
        name: "Great Blue Heron",
        type: "fauna",
        habitat: "lake",
        status: "thriving",
        population: 890,
        threats: ["Wetland Destruction", "Human Disturbance"],
        conservation: ["Nesting Site Protection", "Wetland Restoration"],
        facts: ["Excellent fisher", "Can fly up to 55 mph", "Nests in colonies"],
        discovered: false
      }
    ]
  },
  {
    id: "urban",
    name: "Urban Environment",
    description: "City ecosystem where wildlife adapts to human-dominated landscape",
    icon: Building,
    biodiversityScore: 45,
    threats: ["Habitat Fragmentation", "Pollution", "Light Pollution"],
    species: [
      {
        id: "peregrine-falcon",
        name: "Peregrine Falcon",
        type: "fauna",
        habitat: "urban",
        status: "thriving",
        population: 450,
        threats: ["Building Collisions", "Pesticides"],
        conservation: ["Nesting Box Programs", "Building Safety Measures"],
        facts: ["Fastest bird (240+ mph dive)", "Nests on tall buildings", "Urban adaptation success story"],
        discovered: false
      },
      {
        id: "urban-wildflower",
        name: "Urban Wildflower Mix",
        type: "flora",
        habitat: "urban",
        status: "declining",
        population: 2100,
        threats: ["Mowing", "Herbicides", "Development"],
        conservation: ["Pollinator Gardens", "No-mow Zones"],
        facts: ["Supports urban pollinators", "Improves air quality", "Reduces urban heat island effect"],
        discovered: false
      }
    ]
  }
];

export function BiodiversityExplorer() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEcosystem, setCurrentEcosystem] = useState(0);
  const [discoveredSpecies, setDiscoveredSpecies] = useState<Set<string>>(new Set());
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [conservationActions, setConservationActions] = useState<Set<string>>(new Set());

  const startGame = () => {
    setGameStarted(true);
    setCurrentEcosystem(0);
    setDiscoveredSpecies(new Set());
    setSelectedSpecies(null);
    setGameCompleted(false);
    setScore(0);
    setConservationActions(new Set());
  };

  const discoverSpecies = (species: Species) => {
    if (!discoveredSpecies.has(species.id)) {
      setDiscoveredSpecies(prev => new Set([...prev, species.id]));
      setScore(prev => prev + getSpeciesPoints(species));
    }
    setSelectedSpecies(species);
  };

  const getSpeciesPoints = (species: Species): number => {
    const basePoints = 100;
    const statusMultiplier = {
      thriving: 1,
      declining: 1.2,
      endangered: 1.5,
      extinct: 2
    };
    return Math.round(basePoints * statusMultiplier[species.status]);
  };

  const takeConservationAction = (action: string, species: Species) => {
    const actionKey = `${species.id}-${action}`;
    if (!conservationActions.has(actionKey)) {
      setConservationActions(prev => new Set([...prev, actionKey]));
      setScore(prev => prev + 50);
    }
  };

  const nextEcosystem = () => {
    if (currentEcosystem < ecosystems.length - 1) {
      setCurrentEcosystem(prev => prev + 1);
      setSelectedSpecies(null);
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentEcosystem(0);
    setDiscoveredSpecies(new Set());
    setSelectedSpecies(null);
    setGameCompleted(false);
    setScore(0);
    setConservationActions(new Set());
  };

  const getStatusColor = (status: Species['status']) => {
    switch (status) {
      case 'thriving': return 'bg-success';
      case 'declining': return 'bg-warning';
      case 'endangered': return 'bg-destructive';
      case 'extinct': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: Species['status']) => {
    switch (status) {
      case 'thriving': return CheckCircle;
      case 'declining': return AlertTriangle;
      case 'endangered': return AlertTriangle;
      case 'extinct': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-forest-scene bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mb-4">
                  <Trees className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Biodiversity Explorer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-lg">
                  Explore diverse ecosystems and discover species! Learn about conservation 
                  and help protect biodiversity through your choices.
                </p>
                <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Exploration Mission:</h3>
                  <ul className="text-sm text-left space-y-1">
                    <li>• Explore 3 different ecosystems</li>
                    <li>• Click on species to learn about them</li>
                    <li>• Make conservation choices to help species thrive</li>
                    <li>• Earn points for discoveries and conservation actions</li>
                  </ul>
                </div>
                <Button onClick={startGame} size="lg" className="bg-success hover:bg-success/90">
                  <Eye className="h-5 w-5 mr-2" />
                  Start Exploring
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const totalSpecies = ecosystems.reduce((total, eco) => total + eco.species.length, 0);
    const discoveryRate = (discoveredSpecies.size / totalSpecies) * 100;
    
    return (
      <div className="min-h-screen bg-forest-scene bg-cover bg-center bg-no-repeat p-4">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto pt-20">
            <Card className="bg-white/95 backdrop-blur-sm shadow-success border-2 border-success/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Exploration Complete!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-success mb-2">{score} Points</div>
                  <div className="text-lg text-muted-foreground mb-4">
                    Species Discovered: {discoveredSpecies.size}/{totalSpecies}
                  </div>
                  <Badge className={`text-lg px-4 py-2 ${discoveryRate >= 80 ? 'bg-success' : discoveryRate >= 60 ? 'bg-primary' : 'bg-warning'}`}>
                    {discoveryRate >= 80 ? "Biodiversity Champion" : discoveryRate >= 60 ? "Conservation Explorer" : "Nature Enthusiast"}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="font-bold">Ecosystem Exploration:</h3>
                  {ecosystems.map((ecosystem, index) => {
                    const ecosystemSpecies = ecosystem.species.filter(s => discoveredSpecies.has(s.id));
                    return (
                      <div key={ecosystem.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <ecosystem.icon className="h-5 w-5" />
                          <span>{ecosystem.name}</span>
                        </div>
                        <Badge variant="outline">{ecosystemSpecies.length}/{ecosystem.species.length} species</Badge>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={resetGame} variant="outline" className="flex-1">
                    Explore Again
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

  const ecosystem = ecosystems[currentEcosystem];
  const progress = ((currentEcosystem + 1) / ecosystems.length) * 100;
  const EcosystemIcon = ecosystem.icon;

  return (
    <div className="min-h-screen bg-forest-scene bg-cover bg-center bg-no-repeat p-4">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-success">Ecosystem {currentEcosystem + 1}/{ecosystems.length}</Badge>
              <Badge variant="outline">Score: {score}</Badge>
              <Badge variant="outline">Discovered: {discoveredSpecies.size}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={progress} className="w-32" />
              <Button onClick={nextEcosystem} className="bg-success hover:bg-success/90">
                {currentEcosystem < ecosystems.length - 1 ? "Next Ecosystem" : "Complete"}
              </Button>
            </div>
          </div>

          {/* Ecosystem Header */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-success/20 mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center">
                  <EcosystemIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{ecosystem.name}</CardTitle>
                  <p className="text-muted-foreground">{ecosystem.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-success">Biodiversity Score: {ecosystem.biodiversityScore}/100</Badge>
                    <Badge variant="outline">Threats: {ecosystem.threats.length}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Species Discovery */}
            <Card className="md:col-span-2 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Discover Species
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {ecosystem.species.map(species => {
                    const StatusIcon = getStatusIcon(species.status);
                    const isDiscovered = discoveredSpecies.has(species.id);
                    
                    return (
                      <Card
                        key={species.id}
                        className={`cursor-pointer border-2 transition-all ${
                          isDiscovered ? 'border-success bg-success/10' : 'border-muted hover:border-success/50'
                        } ${selectedSpecies?.id === species.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => discoverSpecies(species)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-bold">{isDiscovered ? species.name : "???"}</div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {isDiscovered ? `${species.type} • ${species.habitat}` : "Click to discover"}
                              </div>
                            </div>
                            {isDiscovered && (
                              <div className="flex items-center gap-1">
                                <StatusIcon className={`h-5 w-5 ${
                                  species.status === 'thriving' ? 'text-success' :
                                  species.status === 'declining' ? 'text-warning' :
                                  'text-destructive'
                                }`} />
                                <Badge className={`${getStatusColor(species.status)} text-xs`}>
                                  {species.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          {isDiscovered && (
                            <div className="space-y-2">
                              <div className="text-sm">
                                <strong>Population:</strong> {species.population.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Click to learn more and take conservation action
                              </div>
                              {!isDiscovered && (
                                <Badge className="bg-primary">+{getSpeciesPoints(species)} pts</Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Species Details & Conservation */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Species Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSpecies ? (
                  <div className="space-y-4">
                    <div>
                      <div className="font-bold text-lg">{selectedSpecies.name}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(selectedSpecies.status)}>
                          {selectedSpecies.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Pop: {selectedSpecies.population.toLocaleString()}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Interesting Facts:</h4>
                      <ul className="text-xs space-y-1">
                        {selectedSpecies.facts.map((fact, index) => (
                          <li key={index}>• {fact}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Threats:</h4>
                      <div className="space-y-1">
                        {selectedSpecies.threats.map(threat => (
                          <Badge key={threat} variant="outline" className="text-xs mr-1 mb-1">
                            {threat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Conservation Actions:</h4>
                      <div className="space-y-2">
                        {selectedSpecies.conservation.map(action => {
                          const actionKey = `${selectedSpecies.id}-${action}`;
                          const isImplemented = conservationActions.has(actionKey);
                          
                          return (
                            <Button
                              key={action}
                              size="sm"
                              variant={isImplemented ? "default" : "outline"}
                              className={`w-full text-xs ${isImplemented ? 'bg-success' : ''}`}
                              onClick={() => takeConservationAction(action, selectedSpecies)}
                              disabled={isImplemented}
                            >
                              {isImplemented ? "✓ Implemented" : `Implement ${action}`}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Click on a species to learn more about it and take conservation actions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}