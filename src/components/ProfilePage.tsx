import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Award, Mail, Phone, MapPin, Calendar, Trophy, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";
import { BadgesDisplay, DEFAULT_BADGES, BadgeData } from "./BadgesDisplay";

export function ProfilePage() {
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  
  const profile = {
    id: "EMP001",
    name: "John Smith",
    role: "Senior Developer",
    department: "Engineering",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: "January 2023",
    avatar: "JS",
  };

  const earnedBadgeIds = ["punctual-pro", "active-voice", "culture-star", "team-player", "top-performer"];
  
  const allBadges: BadgeData[] = DEFAULT_BADGES.map(badge => ({
    ...badge,
    earned: earnedBadgeIds.includes(badge.id),
    earnedDate: earnedBadgeIds.includes(badge.id) ? "Oct 2025" : undefined
  }));

  const achievements = [
    { title: "Culture Champion", month: "July 2025", icon: "🏆" },
    { title: "Best Team Player", month: "April 2025", icon: "🤝" },
    { title: "Innovation Leader", month: "January 2025", icon: "💡" },
    { title: "Rising Star", month: "October 2024", icon: "⭐" },
  ];

  const stats = [
    { label: "Awards Won", value: "4", color: "#1F6E4A" },
    { label: "Nominations", value: "12", color: "#FFD400" },
    { label: "Attendance", value: "98%", color: "#1F6E4A" },
    { label: "Punctuality", value: "96%", color: "#FFD400" },
  ];

  const recentActivity = [
    { action: "Nominated for Staff of the Year", date: "Nov 3, 2025" },
    { action: "Completed Q3 Performance Review", date: "Oct 15, 2025" },
    { action: "Won Culture Champion Award", date: "Jul 28, 2025" },
    { action: "Attended Leadership Workshop", date: "Jun 12, 2025" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[#1F2937] mb-2">My Profile</h1>
        <p className="text-[#6b7280]">View and manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm border-2 border-[#e5e7eb]">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-[#1F6E4A] text-white text-2xl">
                    {profile.avatar}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-[#1F2937] mb-1">{profile.name}</h2>
                <p className="text-[#6b7280] mb-2">{profile.role}</p>
                <Badge className="bg-[#1F6E4A] text-white">{profile.id}</Badge>
              </div>

              <div className="space-y-4 border-t border-[#e5e7eb] pt-6">
                <div className="flex items-center gap-3 text-[#6b7280]">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-[#6b7280]">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-[#6b7280]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3 text-[#6b7280]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {profile.joinDate}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="flex-1 bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white">
                  Edit Profile
                </Button>
                <Dialog open={showBadgesModal} onOpenChange={setShowBadgesModal}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-[#FFD400] hover:bg-[#e6c000] text-[#1F2937]">
                      <Sparkles className="w-4 h-4 mr-2" />
                      View Badges
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-[#1F2937]">
                        <Trophy className="w-6 h-6 text-[#FFD400]" />
                        My Badges & Milestones
                      </DialogTitle>
                      <DialogDescription className="text-[#6b7280]">
                        {allBadges.filter(b => b.earned).length} of {allBadges.length} badges earned • Track your achievements and progress
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6">
                      <BadgesDisplay badges={allBadges} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Badges Preview */}
              <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm text-[#1F2937]">Recent Badges</h4>
                  <Badge variant="outline" className="border-[#FFD400] text-[#FFD400]">
                    {allBadges.filter(b => b.earned).length}
                  </Badge>
                </div>
                <BadgesDisplay badges={allBadges} compact />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white shadow-sm border-2 hover:shadow-md transition-all" style={{ borderColor: stat.color }}>
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                      <Trophy className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <p className="text-2xl text-[#1F2937] mb-1">{stat.value}</p>
                    <p className="text-xs text-[#6b7280]">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <Card className="bg-white shadow-sm border-2 border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="text-[#1F2937] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFD400]" />
                Recent Achievements
              </CardTitle>
              <CardDescription className="text-[#6b7280]">
                Awards and recognitions you've received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 border-2 border-[#e5e7eb] rounded-lg hover:shadow-md hover:border-[#FFD400] transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFD400] to-[#f59e0b] rounded-lg flex items-center justify-center text-2xl shadow-md">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#1F2937] mb-1">{achievement.title}</h4>
                      <p className="text-sm text-[#6b7280]">{achievement.month}</p>
                    </div>
                    <Trophy className="w-5 h-5 text-[#FFD400]" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm border-2 border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="text-[#1F2937]">Recent Activity</CardTitle>
              <CardDescription className="text-[#6b7280]">
                Your recent actions and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 pb-4 border-b border-[#e5e7eb] last:border-b-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#1F6E4A] mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-[#1F2937] mb-1">{activity.action}</p>
                      <p className="text-xs text-[#6b7280]">{activity.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
