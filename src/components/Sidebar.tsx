import {
  LayoutDashboard,
  Vote,
  MessageSquare,
  FileText,
  Settings,
  Shield,
  Upload,
  BarChart3,
  LogOut,
  Trophy,
  Users,
  CheckSquare,
  FolderKanban,
  Receipt,
  TrendingUp,
  CalendarCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userRole: string;
  onLogout: () => void;
}

export function Sidebar({ activePage, onNavigate, userRole, onLogout }: SidebarProps) {
  // Define menu items based on role
  const getMenuItems = () => {
    // Staff menu items
    if (userRole === "staff") {
      return [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "evaluation", label: "Evaluation", icon: Vote },
        { id: "results", label: "Results", icon: BarChart3 },
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "peer-review", label: "Peer Reviews", icon: Users },
        { id: "chat", label: "Chat", icon: MessageSquare },
        { id: "requests", label: "Requests", icon: Receipt },
        { id: "leave", label: "Leave Requests", icon: FileText },
        { id: "attendance", label: "My Attendance", icon: CalendarCheck },
        { id: "settings", label: "Settings", icon: Settings },
      ];
    }

    // Base admin menu items
    const baseAdminItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "staff-overview", label: "Staff Overview", icon: Users },
      { id: "progress-report", label: "Progress Report", icon: TrendingUp },
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "requests", label: "Requests", icon: Receipt },
      { id: "results", label: "Results", icon: BarChart3 },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy },
      { id: "tasks", label: "Tasks", icon: CheckSquare },
      { id: "chat", label: "Team Chat", icon: MessageSquare },
      { id: "leave", label: "Leave Requests", icon: FileText },
      { id: "reports", label: "Reports", icon: FileText },
      { id: "attendance-upload", label: "Attendance", icon: Upload },
    ];

    // Add Staff Enrollment for Super Admin and HR only
    if (userRole === "superadmin" || userRole === "hr") {
      baseAdminItems.push({ id: "add-staff", label: "Staff Enrollment", icon: UserPlus });
    }

    baseAdminItems.push({ id: "settings", label: "Settings", icon: Settings });

    return baseAdminItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 h-screen bg-white border-r border-[#e5e7eb] flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1F6E4A] rounded-lg flex items-center justify-center">
            <span className="text-white">RA</span>
          </div>
          <div>
            <h2 className="text-[#1F2937]">ReachAll</h2>
            <p className="text-xs text-[#6b7280]">Staff Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#1F6E4A] text-white"
                  : "text-[#1F2937] hover:bg-[#f0fdf4]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e5e7eb]">
        <Button
          onClick={onLogout}
          className="w-full bg-white border border-[#e5e7eb] text-[#1F2937] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}