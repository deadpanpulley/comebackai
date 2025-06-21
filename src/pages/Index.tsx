import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Target, Calendar, Zap, CheckCircle2, ExternalLink, Download, Share2, User, LogOut, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from '@/components/AuthModal';

interface DayPlan {
  day: number;
  task: string;
  resource: string;
  motivation: string;
}

interface AIResponse {
  roast: string;
  realityCheck: string;
  dailyPlan: DayPlan[];
  finalQuote: string;
}

const Index = () => {
  const [confession, setConfession] = useState('');
  const [goals, setGoals] = useState('');
  const [days, setDays] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confession.trim() || !goals.trim() || !days.trim()) {
      toast({
        title: "Hold up! 🛑",
        description: "Fill out all fields - no shortcuts here!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-comeback-plan', {
        body: {
          confession: confession,
          goals: goals,
          days: parseInt(days)
        }
      });

      if (error) throw error;

      setResponse(data);
      toast({
        title: "Your Comeback Plan is Ready! 🚀",
        description: "Time to make it happen!"
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Oops! 😅",
        description: "Failed to generate your plan. Please try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePlan = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!response) return;

    try {
      const { error } = await supabase
        .from('comeback_plans')
        .insert({
          user_id: user.id,
          confession,
          goals,
          days: parseInt(days),
          roast: response.roast,
          reality_check: response.realityCheck,
          daily_plan: response.dailyPlan as any, // Cast to Json type
          final_quote: response.finalQuote,
          completed_days: Array.from(completedDays) as any // Cast to Json type
        });

      if (error) throw error;

      toast({
        title: "Plan Saved! 💾",
        description: "Your comeback plan is now stored safely in your account!"
      });
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Save Failed",
        description: "Couldn't save your plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleDay = (day: number) => {
    const newCompleted = new Set(completedDays);
    if (newCompleted.has(day)) {
      newCompleted.delete(day);
    } else {
      newCompleted.add(day);
    }
    setCompletedDays(newCompleted);
  };

  const exportPlan = () => {
    if (!response) return;
    const planText = `🎯 COMEBACK PLAN\n\n🔥 ROAST:\n${response.roast}\n\n🪞 REALITY CHECK:\n${response.realityCheck}\n\n📅 DAILY PLAN:\n${response.dailyPlan.map(day => `Day ${day.day}: ${day.task}\n${day.motivation}`).join('\n\n')}\n\n${response.finalQuote}`;
    
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comeback-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Plan Exported! 📄",
      description: "Your comeback plan is ready to go!"
    });
  };

  const sharePlan = () => {
    if (navigator.share && response) {
      navigator.share({
        title: 'My Comeback Plan 🚀',
        text: `I'm making a comeback! ${response.finalQuote}`,
        url: window.location.href
      });
    } else {
      toast({
        title: "Share Feature",
        description: "Copy this URL to share your motivation!"
      });
    }
  };

  const resetForm = () => {
    setConfession('');
    setGoals('');
    setDays('');
    setResponse(null);
    setCompletedDays(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
              ComebackPlanner 💪
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stop making excuses. Start making progress. Your no-BS coach is here to get you back on track! 🔥
            </p>
          </div>
          
          <div className="absolute top-4 right-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-gray-600 text-gray-300"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="border-gray-600 text-gray-300"
              >
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {!response ? (
          /* Input Form */
          <Card className="max-w-2xl mx-auto bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-yellow-400">
                Time for Some Real Talk 🎯
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="confession" className="text-lg font-semibold text-pink-400">
                    😬 What did you waste time on? (Be honest!)
                  </Label>
                  <Textarea
                    id="confession"
                    placeholder="e.g., I spent 3 months binge-watching Netflix and scrolling TikTok..."
                    value={confession}
                    onChange={(e) => setConfession(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-lg font-semibold text-green-400">
                    🎯 What are your goals?
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="e.g., get fit, learn Python, start a side business, read 10 books..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days" className="text-lg font-semibold text-blue-400">
                    ⏰ How many days do you have?
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    min="7"
                    max="100"
                    placeholder="30"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Crafting Your Comeback...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Get My Comeback Plan! 🚀
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Results */
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={savePlan} variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
                <Save className="mr-2 h-4 w-4" />
                {user ? 'Save Plan' : 'Sign In to Save'}
              </Button>
              <Button onClick={exportPlan} variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10">
                <Download className="mr-2 h-4 w-4" />
                Export Plan
              </Button>
              <Button onClick={sharePlan} variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={resetForm} variant="outline" className="border-gray-500 text-gray-400 hover:bg-gray-500/10">
                New Plan
              </Button>
            </div>

            {/* Roast Section */}
            <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-red-400 flex items-center">
                  <Zap className="mr-2" />
                  🔥 The Roast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{response.roast}</p>
              </CardContent>
            </Card>

            {/* Reality Check */}
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400 flex items-center">
                  <Target className="mr-2" />
                  🪞 Reality Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{response.realityCheck}</p>
              </CardContent>
            </Card>

            {/* Daily Plan */}
            <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-green-400 flex items-center">
                  <Calendar className="mr-2" />
                  📅 Your {response.dailyPlan.length}-Day Comeback Plan
                </CardTitle>
                <p className="text-gray-300 mt-2">
                  Progress: {completedDays.size}/{response.dailyPlan.length} days completed
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {response.dailyPlan.map((day, index) => (
                    <div
                      key={day.day}
                      className={`p-4 rounded-lg border transition-all ${
                        completedDays.has(day.day)
                          ? 'bg-green-800/30 border-green-500/50'
                          : 'bg-gray-800/30 border-gray-600/50 hover:border-green-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleDay(day.day)}
                          className={`mt-1 flex-shrink-0 transition-colors ${
                            completedDays.has(day.day) ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
                          }`}
                        >
                          <CheckCircle2 className="h-6 w-6" />
                        </button>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2">Day {day.day}</h4>
                          <p className="text-gray-300 mb-2">{day.task}</p>
                          <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                            <ExternalLink className="h-4 w-4" />
                            <a href={day.resource} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Resource Link
                            </a>
                          </div>
                          <p className="text-yellow-400 font-medium italic">"{day.motivation}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Final Quote */}
            <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/50 backdrop-blur-sm">
              <CardContent className="py-8">
                <blockquote className="text-2xl font-bold text-center text-yellow-400">
                  "{response.finalQuote}"
                </blockquote>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
