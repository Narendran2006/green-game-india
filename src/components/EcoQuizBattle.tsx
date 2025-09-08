import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Trophy, Target, RotateCcw, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuizQuestion, getRandomQuestions } from "@/data/questionBank";

interface QuizState {
  questions: QuizQuestion[];
  currentQuestion: number;
  score: number;
  timeLeft: number;
  selectedAnswer: number | null;
  showResults: boolean;
  gameStarted: boolean;
  streak: number;
  totalCorrect: number;
}

const QUESTION_TIME = 30; // seconds per question
const TOTAL_QUESTIONS = 10;

export function EcoQuizBattle() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    timeLeft: QUESTION_TIME,
    selectedAnswer: null,
    showResults: false,
    gameStarted: false,
    streak: 0,
    totalCorrect: 0,
  });
  
  const { toast } = useToast();

  const startQuiz = useCallback(() => {
    const questions = getRandomQuestions(TOTAL_QUESTIONS);
    setQuizState({
      questions,
      currentQuestion: 0,
      score: 0,
      timeLeft: QUESTION_TIME,
      selectedAnswer: null,
      showResults: false,
      gameStarted: true,
      streak: 0,
      totalCorrect: 0,
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      gameStarted: false,
      showResults: false,
    }));
  }, []);

  const selectAnswer = useCallback((answerIndex: number) => {
    if (quizState.selectedAnswer !== null) return;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex
    }));

    const currentQ = quizState.questions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.max(0, quizState.timeLeft * 10);
      const streakBonus = quizState.streak * 50;
      const questionScore = 100 + timeBonus + streakBonus;
      
      setQuizState(prev => ({
        ...prev,
        score: prev.score + questionScore,
        streak: prev.streak + 1,
        totalCorrect: prev.totalCorrect + 1,
      }));

      toast({
        title: "Correct! 🎉",
        description: `+${questionScore} points (${timeBonus} time bonus, ${streakBonus} streak bonus)`,
        className: "bg-success text-success-foreground",
      });
    } else {
      setQuizState(prev => ({
        ...prev,
        streak: 0,
      }));

      toast({
        title: "Incorrect 😔",
        description: currentQ.explanation,
        variant: "destructive",
      });
    }

    // Auto advance after showing result
    setTimeout(() => {
      if (quizState.currentQuestion + 1 >= TOTAL_QUESTIONS) {
        setQuizState(prev => ({ ...prev, showResults: true }));
      } else {
        setQuizState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          selectedAnswer: null,
          timeLeft: QUESTION_TIME,
        }));
      }
    }, 2000);
  }, [quizState, toast]);

  // Timer effect
  useEffect(() => {
    if (!quizState.gameStarted || quizState.showResults || quizState.selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setQuizState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up - auto select wrong answer
          const currentQ = prev.questions[prev.currentQuestion];
          toast({
            title: "Time's up! ⏰",
            description: currentQ.explanation,
            variant: "destructive",
          });

          setTimeout(() => {
            if (prev.currentQuestion + 1 >= TOTAL_QUESTIONS) {
              setQuizState(current => ({ ...current, showResults: true }));
            } else {
              setQuizState(current => ({
                ...current,
                currentQuestion: current.currentQuestion + 1,
                selectedAnswer: null,
                timeLeft: QUESTION_TIME,
                streak: 0,
              }));
            }
          }, 2000);

          return {
            ...prev,
            selectedAnswer: -1, // Mark as time out
            timeLeft: 0,
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.gameStarted, quizState.showResults, quizState.selectedAnswer, quizState.currentQuestion, toast]);

  const getScoreRating = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return { rating: "Eco-Champion", color: "text-eco-champion", badge: "🏆" };
    if (percentage >= 80) return { rating: "Eco-Expert", color: "text-eco-gold", badge: "🌟" };
    if (percentage >= 70) return { rating: "Eco-Warrior", color: "text-success", badge: "🌱" };
    if (percentage >= 60) return { rating: "Eco-Learner", color: "text-accent", badge: "📚" };
    return { rating: "Eco-Beginner", color: "text-muted-foreground", badge: "🌿" };
  };

  if (!quizState.gameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gradient-card shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Eco Quiz Battle</CardTitle>
            <p className="text-muted-foreground">
              Test your environmental knowledge in this timed challenge!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-1 text-accent" />
                <p className="font-medium">30 sec</p>
                <p className="text-muted-foreground">per question</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-1 text-success" />
                <p className="font-medium">{TOTAL_QUESTIONS}</p>
                <p className="text-muted-foreground">questions</p>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Categories: Climate • Recycling • Energy • Water • Biodiversity</p>
            </div>
            <Button 
              onClick={startQuiz}
              className="w-full bg-accent hover:bg-accent/90 shadow-button"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start Quiz Battle
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState.showResults) {
    const rating = getScoreRating(quizState.totalCorrect, TOTAL_QUESTIONS);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gradient-success shadow-success">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4 animate-bounce-in">{rating.badge}</div>
            <CardTitle className="text-2xl text-success-foreground">Quiz Complete!</CardTitle>
            <p className={`text-lg font-bold ${rating.color}`}>{rating.rating}</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-success-foreground">{quizState.score}</p>
              <p className="text-success-foreground/80">Total Points</p>
              <div className="flex justify-center space-x-4 text-sm">
                <div>
                  <p className="font-bold text-success-foreground">{quizState.totalCorrect}/{TOTAL_QUESTIONS}</p>
                  <p className="text-success-foreground/80">Correct</p>
                </div>
                <div>
                  <p className="font-bold text-success-foreground">
                    {Math.round((quizState.totalCorrect / TOTAL_QUESTIONS) * 100)}%
                  </p>
                  <p className="text-success-foreground/80">Accuracy</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={resetQuiz}
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

  const currentQ = quizState.questions[quizState.currentQuestion];
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quiz Battle</h1>
            <p className="text-muted-foreground">
              Question {quizState.currentQuestion + 1} of {TOTAL_QUESTIONS}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">{quizState.score}</p>
            <p className="text-sm text-muted-foreground">points</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress 
            value={(quizState.currentQuestion / TOTAL_QUESTIONS) * 100} 
            className="h-2" 
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-muted-foreground">
              {Math.round((quizState.currentQuestion / TOTAL_QUESTIONS) * 100)}%
            </span>
          </div>
        </div>

        {/* Timer */}
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-medium">Time Left</span>
              </div>
              <div className="flex items-center space-x-4">
                {quizState.streak > 0 && (
                  <Badge className="bg-success text-success-foreground animate-pulse-glow">
                    🔥 {quizState.streak} streak
                  </Badge>
                )}
                <span className={`text-2xl font-bold ${quizState.timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-accent'}`}>
                  {quizState.timeLeft}s
                </span>
              </div>
            </div>
            <Progress 
              value={(quizState.timeLeft / QUESTION_TIME) * 100} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="mb-2">
                {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
              </Badge>
              <Badge 
                variant={currentQ.difficulty === 'easy' ? 'secondary' : 
                        currentQ.difficulty === 'medium' ? 'default' : 'destructive'}
              >
                {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonClass = "w-full text-left justify-start h-auto p-4 border-2 transition-all";
              
              if (quizState.selectedAnswer !== null) {
                if (index === currentQ.correctAnswer) {
                  buttonClass += " bg-success text-success-foreground border-success animate-pulse-glow";
                } else if (index === quizState.selectedAnswer && index !== currentQ.correctAnswer) {
                  buttonClass += " bg-destructive text-destructive-foreground border-destructive animate-shake";
                } else {
                  buttonClass += " opacity-50";
                }
              } else {
                buttonClass += " hover:bg-muted hover:border-primary";
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => selectAnswer(index)}
                  disabled={quizState.selectedAnswer !== null}
                >
                  <span className="mr-3 font-bold text-accent">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Show explanation after answer */}
        {quizState.selectedAnswer !== null && (
          <Card className="bg-gradient-card shadow-card animate-slide-up">
            <CardContent className="p-4">
              <h3 className="font-bold mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-accent" />
                Explanation
              </h3>
              <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}