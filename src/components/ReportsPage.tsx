import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FileDown, FileSpreadsheet, Calendar, Users, Award, TrendingUp, Clock } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

export function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("current");
  const [reportType, setReportType] = useState("comprehensive");

  // Mock data
  const attendanceData = [
    { month: "Jul", rate: 92 },
    { month: "Aug", rate: 94 },
    { month: "Sep", rate: 91 },
    { month: "Oct", rate: 96 },
    { month: "Nov", rate: 95 },
  ];

  const evaluationData = [
    { category: "Staff of the Year", votes: 234 },
    { category: "Culture Champion", votes: 198 },
    { category: "Team Player", votes: 212 },
    { category: "Innovation Leader", votes: 156 },
  ];

  const departmentData = [
    { name: "Engineering", value: 35 },
    { name: "Marketing", value: 25 },
    { name: "Sales", value: 20 },
    { name: "HR", value: 10 },
    { name: "Operations", value: 10 },
  ];

  const COLORS = ["#1F6E4A", "#FFD400", "#4ade80", "#fbbf24", "#60a5fa"];

  const kpiData = [
    { label: "Total Staff", value: "124", change: "+5", icon: Users, color: "#1F6E4A" },
    { label: "Avg Attendance", value: "95%", change: "+3%", icon: Calendar, color: "#1F6E4A" },
    { label: "Total Evaluations", value: "800", change: "+12%", icon: Award, color: "#FFD400" },
    { label: "Engagement Score", value: "87%", change: "+5%", icon: TrendingUp, color: "#1F6E4A" },
  ];

  const topPerformers = [
    { rank: 1, staffId: "EMP001", name: "John Smith", score: 96 },
    { rank: 2, staffId: "EMP023", name: "Sarah Johnson", score: 94 },
    { rank: 3, staffId: "EMP015", name: "Mike Chen", score: 92 },
  ];

  const badgesSummary = [
    { badge: "Punctual Pro", count: 28 },
    { badge: "Active Voice", count: 35 },
    { badge: "Culture Star", count: 22 },
    { badge: "Team Champion", count: 31 },
  ];

  const leaveSummary = {
    totalRequests: 45,
    approved: 38,
    pending: 5,
    rejected: 2,
  };

  const handleExportPDF = () => {
    toast.success("Generating PDF report...");
    setTimeout(() => {
      toast.success("Report downloaded successfully!");
    }, 2000);
  };

  const handleExportCSV = () => {
    toast.success("Generating CSV export...");
    setTimeout(() => {
      toast.success("CSV file downloaded successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2937] mb-2">Reports & Analytics</h1>
          <p className="text-[#6b7280]">
            Automated reports and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            className="bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="text-[#1F6E4A] border-[#1F6E4A] hover:bg-[#f0fdf4]"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Period</Label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                  <SelectItem value="attendance">Attendance Only</SelectItem>
                  <SelectItem value="evaluations">Evaluations Only</SelectItem>
                  <SelectItem value="performance">Performance Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${kpi.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                    </div>
                    <Badge className="bg-[#f0fdf4] text-[#1F6E4A]">
                      {kpi.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6b7280] mb-1">{kpi.label}</p>
                  <p className="text-[#1F2937]" style={{ fontSize: "1.75rem", fontWeight: "600" }}>
                    {kpi.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Attendance Trend</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Monthly attendance rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#1F6E4A"
                  strokeWidth={3}
                  dot={{ fill: "#1F6E4A", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Department Distribution</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Staff count by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evaluation Votes by Category */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Evaluation Results</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Total votes per award category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={evaluationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="votes" fill="#1F6E4A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Top Performers</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Highest performing staff this period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((performer) => (
              <div
                key={performer.rank}
                className="flex items-center justify-between p-3 bg-[#F5F7F8] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      performer.rank === 1
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        : performer.rank === 2
                        ? "bg-gradient-to-br from-gray-300 to-gray-500"
                        : "bg-gradient-to-br from-orange-400 to-orange-600"
                    }`}
                  >
                    <span className="text-sm font-semibold">{performer.rank}</span>
                  </div>
                  <div>
                    <p className="text-[#1F2937]">{performer.name}</p>
                    <p className="text-xs text-[#6b7280]">{performer.staffId}</p>
                  </div>
                </div>
                <Badge className="bg-[#1F6E4A] text-white">
                  {performer.score}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges Summary */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Badges Awarded</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Badge distribution this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {badgesSummary.map((item) => (
              <div
                key={item.badge}
                className="flex items-center justify-between p-3 bg-[#F5F7F8] rounded-lg"
              >
                <span className="text-[#1F2937]">{item.badge}</span>
                <Badge className="bg-[#FFD400] text-[#1F2937]">
                  {item.count} awarded
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leave Requests Summary */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Leave Requests</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Leave request status summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#F5F7F8] rounded-lg">
                <span className="text-[#6b7280]">Total Requests</span>
                <Badge className="bg-[#1F6E4A] text-white">
                  {leaveSummary.totalRequests}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f0fdf4] rounded-lg">
                <span className="text-[#6b7280]">Approved</span>
                <Badge className="bg-[#1F6E4A] text-white">
                  {leaveSummary.approved}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#fff9e6] rounded-lg">
                <span className="text-[#6b7280]">Pending</span>
                <Badge className="bg-[#FFD400] text-[#1F2937]">
                  {leaveSummary.pending}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-[#6b7280]">Rejected</span>
                <Badge className="bg-red-500 text-white">
                  {leaveSummary.rejected}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
