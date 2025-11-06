import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./components/DashboardPage";
import { EvaluationPage } from "./components/EvaluationPage";
import { AdminDashboardPage } from "./components/AdminDashboardPage";
import { ChatPage } from "./components/ChatPage";
import { AttendanceUploadPage } from "./components/AttendanceUploadPage";
import { ResultsOverviewPage } from "./components/ResultsOverviewPage";
import { ProfilePage } from "./components/ProfilePage";
import { LeaveManagementPage } from "./components/LeaveManagementPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { AnnouncementsPage } from "./components/AnnouncementsPage";
import { PerformanceReviewPage } from "./components/PerformanceReviewPage";
import { PeerReviewPage } from "./components/PeerReviewPage";
import { ReportsPage } from "./components/ReportsPage";
import { DepartmentAnalyticsPage } from "./components/DepartmentAnalyticsPage";
import { StaffOverviewPage } from "./components/StaffOverviewPage";
import { TasksPage } from "./components/TasksPage";
import { ProgressReportPage } from "./components/ProgressReportPage";
import { ProjectsPage } from "./components/ProjectsPage";
import { RequestsPage } from "./components/RequestsPage";
import { AttendancePage } from "./components/AttendancePage";
import { StaffEnrollmentPage } from "./components/StaffEnrollmentPage";
import { OtherPages } from "./components/OtherPages";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("staff");
  const [activePage, setActivePage] = useState("dashboard");
  const [isTeamLead, setIsTeamLead] = useState(false); // Track if user is a team lead

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    // For demo purposes, you can set certain users as team leads
    // In production, this would come from your auth/database
    if (role === "staff") {
      // Randomly set some staff as team leads for demo
      setIsTeamLead(Math.random() > 0.7);
    }
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("staff");
    setActivePage("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Debug logging
  console.log('Current state:', { isLoggedIn, userRole, activePage });

  return (
    <>
      <div className="min-h-screen bg-[#F5F7F8]">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} userRole={userRole} onLogout={handleLogout} />
        <div className="ml-64">
          <TopBar 
            onViewAllNotifications={() => handleNavigate("notifications")} 
            onViewProfile={() => handleNavigate("profile")}
            userRole={userRole}
            isTeamLead={isTeamLead}
          />
          <main className="p-8">
            <div className="max-w-7xl mx-auto">
              {activePage === "dashboard" && userRole === "staff" && (
                <DashboardPage onNavigate={setActivePage} />
              )}
              {activePage === "dashboard" && (userRole === "superadmin" || userRole === "hr" || userRole === "management") && (
                <AdminDashboardPage onNavigate={setActivePage} />
              )}
              {activePage === "evaluation" && <EvaluationPage userRole={userRole} />}
              {activePage === "tasks" && <TasksPage userRole={userRole} />}
              {activePage === "chat" && <ChatPage userRole={userRole} userDepartment="Tech" />}
              {activePage === "attendance-upload" && <AttendanceUploadPage />}
              {activePage === "results" && <ResultsOverviewPage userRole={userRole} />}
              {activePage === "leaderboard" && <LeaderboardPage userRole={userRole} />}
              {activePage === "profile" && <ProfilePage />}
              {activePage === "leave" && <LeaveManagementPage userRole={userRole} />}
              {activePage === "notifications" && <NotificationsPage />}
              {activePage === "announcements" && <AnnouncementsPage userRole={userRole} />}
              {activePage === "performance-review" && <PerformanceReviewPage />}
              {activePage === "peer-review" && <PeerReviewPage userRole={userRole} />}
              {activePage === "reports" && <ReportsPage />}
              {activePage === "department-analytics" && <DepartmentAnalyticsPage />}
              {activePage === "staff-overview" && <StaffOverviewPage userRole={userRole} />}
              {activePage === "progress-report" && <ProgressReportPage userRole={userRole} />}
              {activePage === "projects" && <ProjectsPage userRole={userRole} />}
              {activePage === "requests" && <RequestsPage userRole={userRole} />}
              {activePage === "attendance" && <AttendancePage userRole={userRole} />}
              {activePage === "staff-enrollment" && <StaffEnrollmentPage userRole={userRole} />}
              {activePage === "add-staff" && <StaffEnrollmentPage userRole={userRole} />}
              {(activePage === "settings") && (
                <OtherPages page={activePage} userRole={userRole} />
              )}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}