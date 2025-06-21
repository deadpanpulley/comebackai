
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Target, Zap, Calendar, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-12">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
            ComebackPlanner 💪
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Stop procrastinating. Start succeeding. Your no-BS coach for getting back on track! 🔥
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-4 px-8 text-lg">
                Get My Comeback Plan! 🚀
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-400">Free • No signup required • Takes 2 minutes</p>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold text-yellow-400 mb-6">We've All Been There... 😅</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-red-900/30 border-red-500/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📱</div>
                <p className="text-gray-300">"I'll just scroll for 5 minutes..." *3 hours later*</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-900/30 border-orange-500/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📺</div>
                <p className="text-gray-300">"One more episode..." *entire weekend gone*</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-900/30 border-yellow-500/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎮</div>
                <p className="text-gray-300">"I'll start tomorrow..." *tomorrow never comes*</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-green-400 mb-12">How ComebackPlanner Works 🎯</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-gray-600/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-red-400" />
                </div>
                <CardTitle className="text-xl text-white">1. Confess</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Tell us what you've been wasting time on. Be honest - we won't judge! 😬</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white">2. Get Roasted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Our AI coach gives you the reality check you need (with love and humor). 🔥</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white">3. Get Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Receive a personalized daily comeback plan tailored to your goals and timeline. 📅</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">4. Execute</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Track your progress daily and watch your comeback unfold! 💪</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-purple-400 mb-12">Why ComebackPlanner? 🤔</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400 flex items-center">
                  <Users className="mr-3" />
                  No BS Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />Honest, motivational coaching</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />No sugar-coating or false promises</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />Real talk that actually helps</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-green-400 flex items-center">
                  <TrendingUp className="mr-3" />
                  Personalized Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />Tailored to your specific goals</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />Daily actionable tasks</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />Progress tracking & motivation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/50 backdrop-blur-sm">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Ready for Your Comeback? 🚀</h2>
              <p className="text-xl text-gray-300 mb-8">
                Stop making excuses. Start making progress. Your future self will thank you!
              </p>
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-4 px-8 text-lg">
                  Start My Comeback Now! 💪
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-gray-400 mt-4">Takes less than 2 minutes • Completely free</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;
