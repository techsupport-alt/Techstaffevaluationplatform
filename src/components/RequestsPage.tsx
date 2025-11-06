import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  FileText,
  Plus,
  Upload,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  Receipt,
  Download,
  Paperclip,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface RequestsPageProps {
  userRole: string;
}

interface Request {
  id: string;
  type: "invoice" | "funds" | "equipment";
  title: string;
  description: string;
  amount?: number;
  project: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  receipts: string[];
  comments: Comment[];
  taggedPerson?: string; // Person involved in the request
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export function RequestsPage({ userRole }: RequestsPageProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Mock requests data
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      type: "funds",
      title: "Server Infrastructure Upgrade",
      description: "Need funding for cloud server upgrade to handle increased traffic",
      amount: 5000,
      project: "Website Redesign",
      status: "approved",
      createdAt: "2024-11-01",
      updatedAt: "2024-11-02",
      attachments: ["quote-aws.pdf"],
      receipts: ["invoice-aws-123.pdf"],
      comments: [
        {
          id: "1",
          author: "HR Manager",
          content: "Approved. Please proceed with the upgrade.",
          timestamp: "2024-11-02T10:30:00",
        },
      ],
    },
    {
      id: "2",
      type: "equipment",
      title: "Design Software Licenses",
      description: "Adobe Creative Cloud licenses for the design team (5 seats)",
      amount: 2500,
      project: "Marketing Campaign Q4",
      status: "pending",
      createdAt: "2024-11-03",
      updatedAt: "2024-11-03",
      attachments: ["adobe-quote.pdf"],
      receipts: [],
      comments: [],
    },
    {
      id: "3",
      type: "invoice",
      title: "Freelance Developer Invoice",
      description: "Payment for frontend developer contract work (40 hours)",
      amount: 4000,
      project: "Mobile App Development",
      status: "pending",
      createdAt: "2024-11-04",
      updatedAt: "2024-11-04",
      attachments: ["freelancer-invoice.pdf", "timesheet.xlsx"],
      receipts: [],
      comments: [],
    },
    {
      id: "4",
      type: "equipment",
      title: "MacBook Pro for New Developer",
      description: "M3 MacBook Pro 16-inch for newly hired backend developer",
      amount: 3500,
      project: "Internal Tools Upgrade",
      status: "declined",
      createdAt: "2024-10-28",
      updatedAt: "2024-10-30",
      attachments: ["apple-quote.pdf"],
      receipts: [],
      comments: [
        {
          id: "1",
          author: "Finance Manager",
          content: "Budget exceeded for Q4. Please submit again in Q1 2025.",
          timestamp: "2024-10-30T14:15:00",
        },
      ],
    },
    {
      id: "5",
      type: "funds",
      title: "Conference Attendance",
      description: "Travel and registration for React Summit 2024",
      amount: 1800,
      project: "Professional Development",
      status: "approved",
      createdAt: "2024-10-20",
      updatedAt: "2024-10-22",
      attachments: ["conference-details.pdf"],
      receipts: ["hotel-receipt.pdf", "flight-receipt.pdf", "registration-receipt.pdf"],
      comments: [
        {
          id: "1",
          author: "HR Manager",
          content: "Approved. Please upload all receipts after the event.",
          timestamp: "2024-10-22T09:00:00",
        },
      ],
    },
  ]);

  const handleCreateRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newRequest: Request = {
      id: String(requests.length + 1),
      type: formData.get("type") as Request["type"],
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      amount: Number(formData.get("amount")) || undefined,
      project: formData.get("project") as string,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      attachments: [],
      receipts: [],
      comments: [],
      taggedPerson: formData.get("taggedPerson") as string | undefined,
    };

    setRequests([newRequest, ...requests]);
    setIsCreateDialogOpen(false);
    toast.success("Request submitted successfully!");
  };

  const handleAddComment = () => {
    if (!selectedRequest || !newComment.trim()) return;

    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          comments: [
            ...req.comments,
            {
              id: String(req.comments.length + 1),
              author: "John Smith",
              content: newComment,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    setSelectedRequest(updatedRequests.find((r) => r.id === selectedRequest.id) || null);
    setNewComment("");
    toast.success("Comment added!");
  };

  const getStatusColor = (status: Request["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status: Request["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "declined":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: Request["type"]) => {
    switch (type) {
      case "funds":
        return <DollarSign className="w-5 h-5" />;
      case "equipment":
        return <Package className="w-5 h-5" />;
      default:
        return <Receipt className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Request["type"]) => {
    switch (type) {
      case "funds":
        return "bg-blue-100 text-blue-800";
      case "equipment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const declinedRequests = requests.filter((r) => r.status === "declined");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2937] mb-2">Requests</h1>
          <p className="text-[#6b7280]">
            Request invoices, funds, or equipment for projects
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1F6E4A] text-white hover:bg-[#1F6E4A]/90">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Request</DialogTitle>
              <DialogDescription>
                Submit a request for invoices, funds, or equipment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Request Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice Payment</SelectItem>
                    <SelectItem value="funds">Funds Request</SelectItem>
                    <SelectItem value="equipment">Equipment Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief title of your request"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about your request"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Related Project</Label>
                  <Select name="project" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign Q4">Marketing Campaign Q4</SelectItem>
                      <SelectItem value="Internal Tools Upgrade">Internal Tools Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taggedPerson">Person Involved (Optional)</Label>
                <Select name="taggedPerson">
                  <SelectTrigger>
                    <SelectValue placeholder="Tag a person related to this request" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                    <SelectItem value="Bob Williams">Bob Williams</SelectItem>
                    <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                    <SelectItem value="David Brown">David Brown</SelectItem>
                    <SelectItem value="Emma Wilson">Emma Wilson</SelectItem>
                    <SelectItem value="Frank Miller">Frank Miller</SelectItem>
                    <SelectItem value="Grace Lee">Grace Lee</SelectItem>
                    <SelectItem value="Henry Chen">Henry Chen</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#6b7280]">
                  Tag a person who is involved in this request (e.g., vendor, team member, freelancer)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-[#6b7280] mx-auto mb-2" />
                  <p className="text-sm text-[#6b7280] mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    PDF, DOC, XLS (Max 10MB)
                  </p>
                  <Input
                    id="attachments"
                    name="attachments"
                    type="file"
                    className="hidden"
                    multiple
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1F6E4A] text-white hover:bg-[#1F6E4A]/90"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280] mb-1">Pending</p>
                <p className="text-2xl text-[#1F2937]">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280] mb-1">Approved</p>
                <p className="text-2xl text-[#1F2937]">{approvedRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280] mb-1">Declined</p>
                <p className="text-2xl text-[#1F2937]">{declinedRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1F2937]">All Requests</CardTitle>
          <CardDescription>Track the status of your submitted requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDetailDialogOpen(true);
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(request.type)}`}>
                          {getTypeIcon(request.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[#1F2937]">{request.title}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-[#6b7280] mb-3">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-[#6b7280]" />
                              <span className="text-[#1F2937]">
                                {request.amount ? `$${request.amount.toLocaleString()}` : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#6b7280]" />
                              <span className="text-[#6b7280]">{request.project}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-4 h-4 text-[#6b7280]" />
                              <span className="text-[#6b7280]">
                                {request.attachments.length} attachment{request.attachments.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {request.receipts.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-[#6b7280]" />
                                <span className="text-[#6b7280]">
                                  {request.receipts.length} receipt{request.receipts.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#6b7280]">
                          Created: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          Updated: {new Date(request.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl mb-2">{selectedRequest.title}</DialogTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {getStatusIcon(selectedRequest.status)}
                        <span className="ml-1 capitalize">{selectedRequest.status}</span>
                      </Badge>
                      <Badge className={getTypeColor(selectedRequest.type)}>
                        <span className="capitalize">{selectedRequest.type}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Details */}
                <div>
                  <h4 className="text-sm mb-2 text-[#1F2937]">Description</h4>
                  <p className="text-sm text-[#6b7280]">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm mb-2 text-[#1F2937]">Amount</h4>
                    <p className="text-sm text-[#6b7280]">
                      {selectedRequest.amount ? `$${selectedRequest.amount.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm mb-2 text-[#1F2937]">Project</h4>
                    <p className="text-sm text-[#6b7280]">{selectedRequest.project}</p>
                  </div>
                </div>

                {/* Tagged Person */}
                {selectedRequest.taggedPerson && (
                  <div>
                    <h4 className="text-sm mb-2 text-[#1F2937]">Person Involved</h4>
                    <div className="flex items-center gap-2 p-3 bg-[#1F6E4A]/5 border border-[#1F6E4A]/20 rounded-lg">
                      <User className="w-4 h-4 text-[#1F6E4A]" />
                      <span className="text-sm text-[#1F2937]">{selectedRequest.taggedPerson}</span>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {selectedRequest.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm mb-2 text-[#1F2937]">Attachments</h4>
                    <div className="space-y-2">
                      {selectedRequest.attachments.map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between p-3 bg-[#F5F7F8] rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-[#6b7280]" />
                            <span className="text-sm text-[#1F2937]">{file}</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Receipts */}
                {selectedRequest.receipts.length > 0 && (
                  <div>
                    <h4 className="text-sm mb-2 text-[#1F2937]">Receipts</h4>
                    <div className="space-y-2">
                      {selectedRequest.receipts.map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-[#1F2937]">{file}</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Receipt (for approved requests) */}
                {selectedRequest.status === "approved" && (
                  <div>
                    <h4 className="text-sm mb-2 text-[#1F2937]">Upload Receipt</h4>
                    <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-4">
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Receipt or Remittance
                      </Button>
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <h4 className="text-sm mb-3 text-[#1F2937]">Comments</h4>
                  <div className="space-y-3 mb-4">
                    {selectedRequest.comments.length === 0 ? (
                      <p className="text-sm text-[#6b7280] text-center py-4">
                        No comments yet
                      </p>
                    ) : (
                      selectedRequest.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-[#F5F7F8] p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#1F2937]">{comment.author}</span>
                            <span className="text-xs text-[#6b7280]">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#6b7280]">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                    />
                    <Button
                      onClick={handleAddComment}
                      className="bg-[#1F6E4A] text-white hover:bg-[#1F6E4A]/90"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}