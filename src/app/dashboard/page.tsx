import { DashboardHeader } from "../../components/DashboardHeader";
import { DashboardCards } from "../../components/DashboardCards";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Floating background elements - same as hero section */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-60 left-1/3 w-12 h-12 bg-purple-400 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute bottom-60 right-1/3 w-18 h-18 bg-yellow-400 rounded-full opacity-25 animate-float"></div>
      </div>
      <div className="relative z-10">
        <DashboardHeader />
        <DashboardCards />
      </div>
    </main>
  );
}
