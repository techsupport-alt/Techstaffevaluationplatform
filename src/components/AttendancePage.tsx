import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  Timer,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  status: "present" | "late" | "absent" | "half-day";
  notes?: string;
}

interface AttendancePageProps {
  userRole?: string;
}

export function AttendancePage({ userRole = "staff" }: AttendancePageProps) {
  const [selectedMonth, setSelectedMonth] = useState("2025-11");

  // Mock attendance data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "1",
      date: "2025-11-01",
      clockIn: "08:45 AM",
      clockOut: "05:30 PM",
      totalHours: 8.75,
      status: "present",
    },
    {
      id: "2",
      date: "2025-11-02",
      clockIn: "09:15 AM",
      clockOut: "05:45 PM",
      totalHours: 8.5,
      status: "late",
      notes: "Traffic delay",
    },
    {
      id: "3",
      date: "2025-11-03",
      clockIn: "08:30 AM",
      clockOut: "05:00 PM",
      totalHours: 8.5,
      status: "present",
    },
    {
      id: "4",
      date: "2025-11-04",
      clockIn: "08:50 AM",
      clockOut: "05:15 PM",
      totalHours: 8.42,
      status: "present",
    },
    {
      id: "5",
      date: "2025-11-05",
      clockIn: "09:00 AM",
      clockOut: "01:00 PM",
      totalHours: 4,
      status: "half-day",
      notes: "Medical appointment",
    },
    {
      id: "6",
      date: "2025-11-06",
      clockIn: "-",
      clockOut: "-",
      totalHours: 0,
      status: "absent",
      notes: "Sick leave",
    },
    {
      id: "7",
      date: "2025-11-07",
      clockIn: "08:40 AM",
      clockOut: "05:20 PM",
      totalHours: 8.67,
      status: "present",
    },
    {
      id: "8",
      date: "2025-11-08",
      clockIn: "08:35 AM",
      clockOut: "05:10 PM",
      totalHours: 8.58,
      status: "present",
    },
  ];

  // Calculate statistics
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  const lateDays = attendanceRecords.filter((r) => r.status === "late").length;
  const absentDays = attendanceRecords.filter((r) => r.status === "absent").length;
  const totalHours = attendanceRecords.reduce((sum, r) => sum + r.totalHours, 0);
  const attendanceRate = ((presentDays / totalDays) * 100).toFixed(1);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Present",
        };
      case "late":
        return {
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          label: "Late",
        };
      case "absent":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Absent",
        };
      case "half-day":
        return {
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          label: "Half Day",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: "Unknown",
        };
    }
  };

  const handleDownloadReport = () => {
    const [year, month] = selectedMonth.split("-");
    const monthName = new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Generate CSV content
    const csvContent = [
      [`Attendance Report - ${monthName}`],
      [""],
      ["Date", "Clock In", "Clock Out", "Total Hours", "Status", "Notes"],
      ...attendanceRecords.map((record) => [
        new Date(record.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        record.clockIn,
        record.clockOut,
        record.totalHours.toFixed(2),
        getStatusConfig(record.status).label,
        record.notes || "-",
      ]),
      [""],
      ["Summary"],
      [`Total Days: ${totalDays}`],
      [`Present Days: ${presentDays}`],
      [`Late Days: ${lateDays}`],
      [`Absent Days: ${absentDays}`],
      [`Total Hours: ${totalHours.toFixed(2)}`],
      [`Attendance Rate: ${attendanceRate}%`],
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance-${selectedMonth}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloaded attendance report for ${monthName}`);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2937] mb-2">My Attendance</h1>
          <p className="text-sm text-[#6b7280]">
            View your attendance records and track your presence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] bg-white border-[#e5e7eb]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-11">November 2025</SelectItem>
              <SelectItem value="2025-10">October 2025</SelectItem>
              <SelectItem value="2025-09">September 2025</SelectItem>
              <SelectItem value="2025-08">August 2025</SelectItem>
              <SelectItem value="2025-07">July 2025</SelectItem>
              <SelectItem value="2025-06">June 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleDownloadReport}
            className="bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="rounded-2xl border-2 border-[#e5e7eb] hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">
                  {attendanceRate}%
                </Badge>
              </div>
              <p className="text-sm text-[#6b7280] mb-1">Attendance Rate</p>
              <p className="text-3xl text-[#1F2937]">{presentDays}/{totalDays}</p>
              <p className="text-xs text-[#6b7280] mt-1">days present</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-2xl border-2 border-[#e5e7eb] hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-[#6b7280] mb-1">Total Hours</p>
              <p className="text-3xl text-[#1F2937]">{totalHours.toFixed(1)}</p>
              <p className="text-xs text-[#6b7280] mt-1">hours worked</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl border-2 border-[#e5e7eb] hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-0">
                  {lateDays}
                </Badge>
              </div>
              <p className="text-sm text-[#6b7280] mb-1">Late Arrivals</p>
              <p className="text-3xl text-[#1F2937]">{lateDays}</p>
              <p className="text-xs text-[#6b7280] mt-1">times late</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl border-2 border-[#e5e7eb] hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <Badge className="bg-red-100 text-red-700 border-0">{absentDays}</Badge>
              </div>
              <p className="text-sm text-[#6b7280] mb-1">Absent Days</p>
              <p className="text-3xl text-[#1F2937]">{absentDays}</p>
              <p className="text-xs text-[#6b7280] mt-1">days absent</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attendance Records Table */}
      <Card className="rounded-2xl border-2 border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[#1F2937] flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#1F6E4A]" />
            Attendance Records
          </CardTitle>
          <CardDescription className="text-[#6b7280]">
            Detailed daily attendance log for{" "}
            {new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceRecords.map((record, index) => {
              const config = getStatusConfig(record.status);
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`border-2 ${config.borderColor} ${config.bgColor} rounded-xl hover:shadow-md transition-all`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Date */}
                        <div className="flex items-center gap-3 flex-shrink-0 w-32">
                          <Calendar className={`w-5 h-5 ${config.color}`} />
                          <div>
                            <p className="text-sm text-[#1F2937]">
                              {new Date(record.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-[#6b7280]">
                              {new Date(record.date).toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Clock In */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#6b7280] mb-1">Clock In</p>
                          <p className="text-sm text-[#1F2937]">{record.clockIn}</p>
                        </div>

                        {/* Clock Out */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#6b7280] mb-1">Clock Out</p>
                          <p className="text-sm text-[#1F2937]">{record.clockOut}</p>
                        </div>

                        {/* Total Hours */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#6b7280] mb-1">Total Hours</p>
                          <p className="text-sm text-[#1F2937]">
                            {record.totalHours > 0
                              ? `${record.totalHours.toFixed(2)} hrs`
                              : "-"}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusIcon className={`w-5 h-5 ${config.color}`} />
                          <Badge className={`${config.color} bg-transparent border-0`}>
                            {config.label}
                          </Badge>
                        </div>

                        {/* Notes */}
                        {record.notes && (
                          <div className="flex-1 min-w-0 max-w-xs">
                            <p className="text-xs text-[#6b7280] italic truncate">
                              {record.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="rounded-2xl border-2 border-[#1F6E4A]/20 bg-gradient-to-br from-[#f0fdf4] to-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1F6E4A] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1F2937] mb-2">Attendance Tips</h3>
              <ul className="space-y-1 text-sm text-[#6b7280]">
                <li>• Clock in before 9:00 AM to avoid being marked as late</li>
                <li>• Ensure you clock out daily to get accurate hour tracking</li>
                <li>
                  • If you're absent, notify HR and submit leave request in advance
                </li>
                <li>• Download monthly reports for your personal records</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
