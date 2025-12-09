import React from "react";
import { Link } from "react-router-dom";


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/40 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-400 via-blue-400 to-lime-300 flex items-center justify-center text-lg transform group-hover:scale-110 transition-transform duration-300">
              ⏱️
            </div>
            <span className="group-hover:text-blue-400 transition-colors duration-300">ChronoStudy</span>
          </Link>
          <ul className="hidden md:flex gap-8 text-sm text-slate-300">
            <li><a href="#features" className="hover:text-blue-400 transition-colors duration-300 relative group">Features<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span></a></li>
            <li><a href="#guide" className="hover:text-blue-400 transition-colors duration-300 relative group">How to Use<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span></a></li>
            <li><a href="#why" className="hover:text-blue-400 transition-colors duration-300 relative group">Why Us<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span></a></li>
          </ul>
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-sm border border-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-105">
              Log In
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
              Get Started
            </Link>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>


        <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-8 animate-fadeInLeft">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-blue-400 to-lime-300 bg-clip-text text-transparent animate-gradient">Study in vibes,</span>
              <br />
              not in chaos.
            </h1>
            <p className="text-lg text-slate-300 max-w-md opacity-0 animate-fadeInUp animation-delay-200">
              Turn your messy timetable into a clean, aesthetic dashboard. Track hours, crush deadlines, and keep your streaks alive all in one native workspace.
            </p>
            <div className="flex flex-wrap gap-3 opacity-0 animate-fadeInUp animation-delay-400">
              <span className="px-4 py-2 border border-slate-700 rounded-full text-sm bg-slate-900/50 backdrop-blur hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-slate-700/50 cursor-pointer">⚡ Live stats</span>
              <span className="px-4 py-2 border border-slate-700 rounded-full text-sm bg-slate-900/50 backdrop-blur hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-slate-700/50 cursor-pointer">🔥 Streaks & vibes</span>
              <span className="px-4 py-2 border border-slate-700 rounded-full text-sm bg-slate-900/50 backdrop-blur hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-slate-700/50 cursor-pointer">📅 Calendar x To-Do</span>
            </div>
            <div className="flex gap-4 pt-4 opacity-0 animate-fadeInUp animation-delay-600">
              <Link to="/login" className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95">
                Start Free
              </Link>
              <a href="#guide" className="px-8 py-3 border border-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-400 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-700/50 active:scale-95">
                Learn More
              </a>
            </div>
          </div>


          {/* Right - Visual */}
          <div className="relative h-96 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-pink-500/10 to-blue-500/10 backdrop-blur-sm flex items-center justify-center animate-fadeInRight group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-slate-900/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="text-center space-y-4 relative z-10">
              <div className="text-6xl animate-float">📊</div>
              <div className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Dashboard • Calendar • Stats<br />Tasks • Competition • Insights</div>
              <div className="text-xs text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse">Built for students ⚡</div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 opacity-0 animate-fadeInUp">Everything You Need</h2>
          <p className="text-center text-slate-400 mb-16 opacity-0 animate-fadeInUp animation-delay-200">One integrated platform for studying smart, not hard</p>


          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📊", title: "Dashboard", desc: "Your daily snapshot. See today's focus minutes, streak trends, lifetime hours, and completed tasks at a glance." },
              { icon: "✅", title: "Tasks", desc: "Manage what you need to study. Add tasks with priority labels and auto-integrate them into your focus stats." },
              { icon: "📅", title: "Calendar", desc: "Plan study blocks, classes, and meetings. Organize with repeating routines (daily, weekly, monthly, custom)." },
              { icon: "📈", title: "Stats", desc: "Deep insights into your consistency. View daily, weekly, and monthly breakdowns plus long-term streak data." },
              { icon: "🏆", title: "Competition", desc: "Study with friends. Compare focus minutes, weekly totals, and monthly stats with friendly visual bar comparisons." },
              { icon: "🔔", title: "Notifications", desc: "Smart study reminders. Customize intervals by priority level and snooze duration. Always on, never annoying." }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 border border-slate-700/50 rounded-xl bg-slate-900/30 backdrop-blur hover:border-blue-400/50 hover:bg-slate-900/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 opacity-0 animate-fadeInUp group cursor-pointer"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-4xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* How to Use Guide */}
      <section id="guide" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 opacity-0 animate-fadeInUp">🚀 How to Use ChronoStudy</h2>
          <p className="text-center text-slate-400 mb-16 opacity-0 animate-fadeInUp animation-delay-200">A quick guide to mastering your personal study OS</p>


          <div className="space-y-8">
            {[
              {
                num: "1",
                title: "Dashboard — Your Daily Overview",
                desc: "The dashboard is your command center. It gives you a snapshot of your study life in one clean view:",
                points: [
                  "Today's total focus minutes — see how much you've studied today",
                  "Streak trends — track your consistency over the last 7 days",
                  "Total lifetime hours — celebrate your long-term commitment",
                  "Completed tasks — mark what you've conquered",
                  "Friendly competition stats — compare with friends"
                ]
              },
              {
                num: "2",
                title: "Tasks — Manage What You Need to Study",
                desc: "Tasks are your to-do list, but smarter. Use the Tasks page to organize your workload and automatically track progress.",
                points: [
                  "Add tasks with priority labels — High, Medium, Low",
                  "Mark tasks completed — check them off as you conquer them",
                  "Track pending tasks — see what's left for today",
                  "Auto-integrate into stats — completed tasks automatically add to your focus stats",
                  "Generate reminders — the app sends alerts based on your notification settings"
                ]
              },
              {
                num: "3",
                title: "Calendar — Plan Study Blocks & Classes",
                desc: "The Calendar is your long-term study planner. Schedule everything from quick study sessions to full-day study marathons.",
                points: [
                  "Create events — study blocks, classes, meetings, or all-day sessions",
                  "Set repeating routines — daily, weekly, monthly, or custom schedules",
                  "Edit or delete — full control over your schedule",
                  "Organize by subject — color-code and group related events",
                  "See your structure — view your weekly/monthly patterns clearly"
                ]
              },
              {
                num: "4",
                title: "Stats — Deep Insights & Streaks",
                desc: "Stats show you the bigger picture. Understand your patterns, celebrate streaks, and optimize your study rhythm.",
                points: [
                  "Daily focus times — see how much you studied each day",
                  "Weekly and monthly totals — track cumulative progress",
                  "Completion trends — understand your task completion rate",
                  "Long-term streaks — visualize consistency over weeks and months",
                  "Comparative insights — see how this week compares to last week"
                ]
              },
              {
                num: "5",
                title: "Competition — Study With Friends",
                desc: "Friendly competition makes studying fun. Challenge your friends and stay motivated together.",
                points: [
                  "Enter a friend's email — add them as your competition target",
                  "Compare today's focus minutes — who studied more today?",
                  "Weekly totals — week-long head-to-head comparison",
                  "Monthly totals — month-long tracking",
                  "Visual bar comparison — see the difference at a glance"
                ]
              },
              {
                num: "6",
                title: "Notifications — Smart Study Reminders",
                desc: "Never miss a deadline. Customize reminders so they help you, not stress you.",
                points: [
                  "High-priority intervals — frequent reminders for urgent tasks",
                  "Medium & low-priority intervals — gentle nudges for regular tasks",
                  "Default snooze duration — set how long you can postpone a reminder",
                  "Real-time checking — the app checks every second for pending reminders",
                  "Timely alerts — get notified when tasks are due or overdue"
                ]
              }
            ].map((guide, idx) => (
              <div key={idx} className="p-8 border border-slate-700/50 rounded-xl bg-slate-900/30 backdrop-blur hover:border-blue-400/50 transition-all duration-500 transform hover:shadow-xl hover:shadow-blue-500/10 opacity-0 animate-fadeInUp group" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 flex items-center justify-center font-bold text-slate-950 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    {guide.num}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold group-hover:text-blue-400 transition-colors duration-300">{guide.title}</h3>
                    <p className="text-slate-300 mt-2 group-hover:text-slate-200 transition-colors duration-300">{guide.desc}</p>
                  </div>
                </div>
                <ul className="ml-16 space-y-2 text-sm text-slate-300">
                  {guide.points.map((point, i) => (
                    <li key={i} className="flex gap-2 group-hover:text-slate-200 transition-colors duration-300 transform group-hover:translate-x-1">
                      <span className="text-blue-400 mt-1 group-hover:text-blue-300 transition-colors duration-300">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Why Section */}
      <section id="why" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold opacity-0 animate-fadeInUp">🎯 Why ChronoStudy?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto opacity-0 animate-fadeInUp animation-delay-200">Built for how you actually study</p>
          
          <div className="p-12 border border-slate-700/50 rounded-2xl bg-gradient-to-br from-pink-500/10 to-blue-500/10 backdrop-blur opacity-0 animate-fadeInUp animation-delay-400 group hover:border-blue-400/50 transition-all duration-500 transform hover:shadow-xl hover:shadow-blue-500/20">
            <h3 className="text-3xl font-bold mb-6 group-hover:text-blue-400 transition-colors duration-300">The Goal</h3>
            <p className="text-lg text-slate-300 mb-4 group-hover:text-slate-200 transition-colors duration-300">
              ChronoStudy is built to help you stay consistent, plan realistically, track your efforts clearly, and build healthy study habits — all while having fun competing with friends.
            </p>
            <p className="text-slate-300 mb-8 group-hover:text-slate-200 transition-colors duration-300">
              A single tool for everything. From quick tasks to full study scheduling. From daily streaks to lifelong consistency.
            </p>
            <Link to="/login" className="px-10 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/50 inline-block active:scale-95">
              Start Your Study OS Today
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-slate-800/40 py-12 px-6 bg-slate-950/80">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-slate-800/40 pt-8 text-center text-sm text-slate-400">
            <p className="opacity-0 animate-fadeInUp animation-delay-600">© 2025 ChronoStudy. Made by <span className="text-blue-400 font-semibold">Ishan</span> for students who live in tabs and playlists. ✨</p>
          </div>
        </div>
      </footer>


      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};


export default LandingPage;