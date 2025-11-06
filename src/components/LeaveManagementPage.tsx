import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CalendarIcon, Check, X, Clock, Eye, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner@2.0.3";

interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  hrComment?: string;
  approverName?: string;
  submittedDate?: string;
}

export function LeaveManagementPage({ userRole }: { userRole: string }) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState("annual");
  const [reason, setReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const leaveBalance = {
    annual: { total: 20, used: 8, remaining: 12 },
    sick: { total: 10, used: 3, remaining: 7 },
    personal: { total: 5, used: 2, remaining: 3 },
  };

  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: "LR001",
      staffId: "EMP001",
      staffName: "John Smith",
      type: "Annual Leave",
      startDate: "Nov 10, 2025",
      endDate: "Nov 15, 2025",
      days: 5,
      reason: "Family vacation planned for holiday season. Need time off to spend with family.",
      status: "pending",
      submittedDate: "Nov 1, 2025",
    },
    {
      id: "LR002",
      staffId: "EMP002",
      staffName: "Alice Johnson",
      type: "Sick Leave",
      startDate: "Nov 8, 2025",
      endDate: "Nov 9, 2025",
      days: 2,
      reason: "Medical appointment scheduled with specialist. Doctor's note attached.",
      status: "approved",
      hrComment: "Approved. Get well soon! Medical documentation received.",
      approverName: "Sarah HR Manager",
      submittedDate: "Nov 5, 2025",
    },
    {
      id: "LR003",
      staffId: "EMP003",
      staffName: "Bob Williams",
      type: "Personal Leave",
      startDate: "Nov 12, 2025",
      endDate: "Nov 12, 2025",
      days: 1,
      reason: "Personal matter that requires immediate attention.",
      status: "rejected",
      hrComment: "Insufficient leave balance. Only 0.5 days remaining. Please discuss with HR.",
      approverName: "Sarah HR Manager",
      submittedDate: "Nov 4, 2025",
    },
  ]);

  const leaveHistory = [
    { 
      id: "LH001",
      period: "Oct 2025", 
      type: "Annual", 
      startDate: "Oct 15, 2025",
      endDate: "Oct 17, 2025",
      days: 3, 
      status: "Approved",
      reason: "Personal time off",
      approverName: "Sarah HR Manager",
    },
    { 
      id: "LH002",
      period: "Sep 2025", 
      type: "Sick", 
      startDate: "Sep 20, 2025",
      endDate: "Sep 21, 2025",
      days: 2, 
      status: "Approved",
      reason: "Flu symptoms",
      approverName: "Sarah HR Manager",
    },
    { 
      id: "LH003",
      period: "Aug 2025", 
      type: "Annual", 
      startDate: "Aug 1, 2025",
      endDate: "Aug 5, 2025",
      days: 5, 
      status: "Approved",
      reason: "Summer vacation",
      approverName: "Sarah HR Manager",
    },
    { 
      id: "LH004",
      period: "Jul 2025", 
      type: "Personal", 
      startDate: "Jul 10, 2025",
      endDate: "Jul 10, 2025",
      days: 1, 
      status: "Approved",
      reason: "Family event",
      approverName: "Sarah HR Manager",
    },
  ];

  const handleSubmitRequest = () => {
    if (!startDate || !endDate || !reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRequest: LeaveRequest = {
      id: `LR${String(requests.length + 1).padStart(3, '0')}`,
      staffId: "EMP001",
      staffName: "John Smith",
      type: leaveType === "annual" ? "Annual Leave" : leaveType === "sick" ? "Sick Leave" : "Personal Leave",
      startDate: format(startDate, "MMM dd, yyyy"),
      endDate: format(endDate, "MMM dd, yyyy"),
      days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1,
      reason,
      status: "pending",
      submittedDate: format(new Date(), "MMM dd, yyyy"),
    };

    setRequests([newRequest, ...requests]);
    
    // Reset form
    setStartDate(undefined);
    setEndDate(undefined);
    setReason("");
    setLeaveType("annual");
    
    toast.success("Leave request submitted successfully!");
  };

  const handleViewDetails = (request: LeaveRequest | any) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? { ...req, status: "approved" as const, approverName: "Sarah HR Manager", hrComment: "Approved" }
          : req
      )
    );
    toast.success("Leave request approved!");
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? { ...req, status: "rejected" as const, approverName: "Sarah HR Manager", hrComment: "Rejected" }
          : req
      )
    );
    toast.error("Leave request rejected!");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-[#FFD400] text-[#1F2937]",
      approved: "bg-[#1F6E4A] text-white",
      rejected: "bg-[#ef4444] text-white",
    };
    return styles[status as keyof typeof styles] || "bg-[#6b7280] text-white";
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <Check className="w-4 h-4" />;
    if (status === "rejected") return <X className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const isAdmin = userRole === "superadmin" || userRole === "hr" || userRole === "management";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[#1F2937] mb-2">Leave Management</h1>
        <p className="text-[#6b7280]">
          {isAdmin ? "Manage team leave requests" : "Request and track your leave"}
        </p>
      </div>

      {/* Leave Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[#1F6E4A] to-[#1a5a3d] text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Annual Leave</p>
              <CalendarIcon className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-1">{leaveBalance.annual.remaining}</p>
            <p className="text-sm opacity-90">days remaining</p>
            <Progress 
              value={(leaveBalance.annual.remaining / leaveBalance.annual.total) * 100} 
              className="h-2 mt-3 bg-white/20" 
            />
            <p className="text-xs opacity-75 mt-2">
              {leaveBalance.annual.used} used of {leaveBalance.annual.total} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[#1F6E4A] shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#6b7280]">Sick Leave</p>
              <CalendarIcon className="w-5 h-5 text-[#1F6E4A]" />
            </div>
            <p className="text-3xl font-bold text-[#1F2937] mb-1">{leaveBalance.sick.remaining}</p>
            <p className="text-sm text-[#6b7280]">days remaining</p>
            <Progress 
              value={(leaveBalance.sick.remaining / leaveBalance.sick.total) * 100} 
              className="h-2 mt-3" 
            />
            <p className="text-xs text-[#6b7280] mt-2">
              {leaveBalance.sick.used} used of {leaveBalance.sick.total} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[#e5e7eb] shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#6b7280]">Personal Leave</p>
              <CalendarIcon className="w-5 h-5 text-[#FFD400]" />
            </div>
            <p className="text-3xl font-bold text-[#1F2937] mb-1">{leaveBalance.personal.remaining}</p>
            <p className="text-sm text-[#6b7280]">days remaining</p>
            <Progress 
              value={(leaveBalance.personal.remaining / leaveBalance.personal.total) * 100} 
              className="h-2 mt-3" 
            />
            <p className="text-xs text-[#6b7280] mt-2">
              {leaveBalance.personal.used} used of {leaveBalance.personal.total} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Request New Leave - Now available to everyone including HR */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Request New Leave</CardTitle>
          <CardDescription className="text-[#6b7280]">
            Submit a leave request for approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Leave Type *</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason / Note *</Label>
            <Textarea
              placeholder="Provide details about your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSubmitRequest}
            className="w-full bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
          >
            Submit Leave Request
          </Button>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1F2937]">
                {isAdmin ? "Pending Requests" : "My Leave Requests"}
              </CardTitle>
              <CardDescription className="text-[#6b7280]">
                {isAdmin ? "Review and approve team leave requests" : "Track your submitted requests"}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-[#FFD400] text-[#1F2937]">
              {requests.filter((r) => r.status === "pending").length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Staff</TableHead>}
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow 
                  key={request.id}
                  className="cursor-pointer hover:bg-[#F5F7F8]"
                  onClick={() => handleViewDetails(request)}
                >
                  {isAdmin && (
                    <TableCell>
                      <div>
                        <p className="text-sm text-[#1F2937]">{request.staffName}</p>
                        <p className="text-xs text-[#6b7280]">{request.staffId}</p>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-[#1F2937]">{request.type}</TableCell>
                  <TableCell className="text-[#6b7280]">{request.startDate}</TableCell>
                  <TableCell className="text-[#6b7280]">{request.endDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[#F5F7F8] text-[#1F2937]">
                      {request.days} {request.days === 1 ? 'day' : 'days'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(request.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(request);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {isAdmin && request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(request.id);
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(request.id);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave History */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Leave History</CardTitle>
          <CardDescription className="text-[#6b7280]">
            Your past leave records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveHistory.map((item, index) => (
                <TableRow 
                  key={index}
                  className="cursor-pointer hover:bg-[#F5F7F8]"
                  onClick={() => handleViewDetails(item)}
                >
                  <TableCell className="text-[#1F2937]">{item.period}</TableCell>
                  <TableCell className="text-[#6b7280]">{item.type}</TableCell>
                  <TableCell className="text-[#6b7280] text-sm">
                    {item.startDate} - {item.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[#F5F7F8] text-[#1F2937]">
                      {item.days} {item.days === 1 ? 'day' : 'days'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#1F6E4A] text-white">
                      <Check className="w-3 h-3 mr-1" />
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1F6E4A]" />
              Leave Request Details
            </DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Complete information about this leave request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              {/* Request ID */}
              <div className="flex items-center justify-between p-3 bg-[#F5F7F8] rounded-lg">
                <span className="text-sm text-[#6b7280]">Request ID</span>
                <span className="text-sm text-[#1F2937]">{selectedRequest.id}</span>
              </div>

              {/* Staff Info (if admin) */}
              {isAdmin && selectedRequest.staffName && (
                <div className="p-3 bg-[#f0fdf4] rounded-lg border border-[#1F6E4A]">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-[#1F6E4A]" />
                    <span className="text-sm text-[#6b7280]">Staff Member</span>
                  </div>
                  <p className="text-[#1F2937]">{selectedRequest.staffName}</p>
                  <p className="text-xs text-[#6b7280]">{selectedRequest.staffId}</p>
                </div>
              )}

              {/* Leave Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[#6b7280]">Leave Type</Label>
                  <p className="text-[#1F2937] mt-1">{selectedRequest.type}</p>
                </div>
                <div>
                  <Label className="text-xs text-[#6b7280]">Duration</Label>
                  <p className="text-[#1F2937] mt-1">{selectedRequest.days} {selectedRequest.days === 1 ? 'day' : 'days'}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[#6b7280]">Start Date</Label>
                  <p className="text-[#1F2937] mt-1">{selectedRequest.startDate}</p>
                </div>
                <div>
                  <Label className="text-xs text-[#6b7280]">End Date</Label>
                  <p className="text-[#1F2937] mt-1">{selectedRequest.endDate}</p>
                </div>
              </div>

              {/* Submission Date */}
              {selectedRequest.submittedDate && (
                <div>
                  <Label className="text-xs text-[#6b7280]">Submitted On</Label>
                  <p className="text-[#1F2937] mt-1">{selectedRequest.submittedDate}</p>
                </div>
              )}

              {/* Reason */}
              <div>
                <Label className="text-xs text-[#6b7280]">Reason / Note</Label>
                <p className="text-sm text-[#1F2937] mt-2 p-3 bg-[#F5F7F8] rounded-lg">
                  {selectedRequest.reason}
                </p>
              </div>

              {/* Status */}
              <div>
                <Label className="text-xs text-[#6b7280]">Current Status</Label>
                <div className="mt-2">
                  <Badge className={`${getStatusBadge(selectedRequest.status)} text-sm px-3 py-1`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedRequest.status)}
                      {selectedRequest.status.toUpperCase()}
                    </span>
                  </Badge>
                </div>
              </div>

              {/* Approver Info */}
              {selectedRequest.approverName && (
                <div className="p-3 bg-[#fff9e6] rounded-lg border border-[#FFD400]">
                  <Label className="text-xs text-[#6b7280]">Approver</Label>
                  <p className="text-sm text-[#1F2937] mt-1">{selectedRequest.approverName}</p>
                </div>
              )}

              {/* HR Comment */}
              {selectedRequest.hrComment && (
                <div className={`p-3 rounded-lg border ${
                  selectedRequest.status === 'approved' 
                    ? 'bg-[#f0fdf4] border-[#1F6E4A]' 
                    : 'bg-[#fef2f2] border-[#ef4444]'
                }`}>
                  <Label className="text-xs text-[#6b7280]">HR Comment</Label>
                  <p className="text-sm text-[#1F2937] mt-1">{selectedRequest.hrComment}</p>
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && selectedRequest.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setShowDetailsModal(false);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setShowDetailsModal(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}