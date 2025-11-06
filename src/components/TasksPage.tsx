import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  ListChecks,
  Clock,
  AlertCircle,
  TrendingUp,
  Trophy,
  Target,
  ChevronRight,
  X,
  Paperclip,
  MessageSquare,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  assignedBy: string;
  assignedByName: string;
  assignedToName: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  status: "todo" | "in-progress" | "completed" | "blocked";
  progress: number;
  comments: Comment[];
  description?: string;
  createdAt: string;
  assignedTimestamp: string;
  subtasks?: Subtask[];
  tags?: string[];
  department?: string;
  project?: string;
  attachments?: Attachment[];
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

interface TasksPageProps {
  userRole: string;
}

// Mock monthly performance data
const monthlyData = [
  { month: "Jan", completed: 12, inProgress: 8, total: 20 },
  { month: "Feb", completed: 15, inProgress: 10, total: 25 },
  { month: "Mar", completed: 18, inProgress: 7, total: 25 },
  { month: "Apr", completed: 22, inProgress: 13, total: 35 },
  { month: "May", completed: 20, inProgress: 15, total: 35 },
  { month: "Jun", completed: 25, inProgress: 10, total: 35 },
];

const DraggableTaskCard = ({
  task,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  task: Task;
  onViewDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const isOverdue = new Date(task.dueDate) < new Date();
  const priorityColors = {
    high: "bg-[#fef2f2] text-[#ef4444] border-[#fecaca]",
    medium: "bg-[#fef9c3] text-[#d97706] border-[#fde68a]",
    low: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]",
  };

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card
        className="mb-3 border border-[#e5e7eb] hover:shadow-lg transition-all cursor-pointer group rounded-2xl"
        onClick={() => onViewDetails(task)}
      >
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-[#1F2937] flex-1 pr-2 line-clamp-2">{task.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:bg-[#f3f4f6]"
                >
                  <MoreVertical className="w-4 h-4 text-[#6b7280]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(task);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-[#1E3D34] text-white text-xs">
                {task.assignedToName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-[#1F2937]">{task.assignedToName}</span>
              <span className="text-[10px] text-[#6b7280]">{task.assignedTo}</span>
            </div>
          </div>

          {task.department && (
            <Badge
              variant="outline"
              className="bg-[#f0fdf4] text-[#15803d] border-[#86efac] text-[10px]"
            >
              {task.department}
            </Badge>
          )}

          <div className="flex items-center gap-2">
            <Calendar
              className={`w-3.5 h-3.5 ${
                isOverdue ? "text-[#ef4444]" : "text-[#6b7280]"
              }`}
            />
            <span
              className={`text-xs ${
                isOverdue ? "text-[#ef4444]" : "text-[#6b7280]"
              }`}
            >
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            {isOverdue && (
              <Badge className="bg-[#fef2f2] text-[#ef4444] border-[#fecaca] text-[10px] ml-auto">
                Overdue
              </Badge>
            )}
          </div>

          <Badge className={`text-[10px] ${priorityColors[task.priority]}`}>
            {task.priority === "high"
              ? "Urgent"
              : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#6b7280]">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}{" "}
                Subtasks
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6b7280]">Progress</span>
              <span className="text-[#1E3D34]">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DropZone = ({
  status,
  tasks,
  title,
  color,
  onDrop,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  status: string;
  tasks: Task[];
  title: string;
  color: string;
  onDrop: (task: Task, newStatus: string) => void;
  onViewDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { task: Task }) => {
      if (item.task.status !== status) {
        onDrop(item.task, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`space-y-4 min-h-[600px] ${
        isOver ? "bg-[#f0fdf4] rounded-2xl p-2 transition-colors" : ""
      }`}
    >
      <div className="flex items-center justify-between sticky top-0 bg-[#F5F7F8] pb-2 z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          <h3 className="text-[#1F2937]">{title}</h3>
          <Badge variant="secondary" className="bg-white border border-[#e5e7eb]">
            {tasks.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="text-center py-12 text-sm text-[#6b7280] bg-white rounded-2xl border-2 border-dashed border-[#e5e7eb]">
            <ListChecks className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No tasks in this column</p>
          </div>
        )}
      </div>
    </div>
  );
};

export function TasksPage({ userRole }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design user dashboard mockups for new platform",
      assignedTo: "EMP014",
      assignedToName: "Bardo Wilson",
      assignedBy: "EMP009",
      assignedByName: "Lisa Park",
      priority: "high",
      dueDate: "2025-02-16",
      status: "todo",
      progress: 65,
      description: "Create comprehensive mockups for the new dashboard interface",
      createdAt: "Nov 1, 2025",
      assignedTimestamp: "Nov 1, 2025 - 09:30 AM",
      department: "Design",
      project: "Platform Redesign",
      subtasks: [
        { id: "1-1", title: "Research user needs", completed: true },
        { id: "1-2", title: "Create wireframes", completed: true },
        { id: "1-3", title: "Design high-fidelity mockups", completed: false },
      ],
      tags: ["design", "ui/ux"],
      comments: [],
      attachments: [],
    },
    {
      id: "2",
      title: "Implement user authentication system",
      assignedTo: "EMP008",
      assignedToName: "Mike Chen",
      assignedBy: "EMP009",
      assignedByName: "Lisa Park",
      priority: "high",
      dueDate: "2025-02-20",
      status: "in-progress",
      progress: 45,
      description: "Set up authentication flow with JWT and OAuth integration",
      createdAt: "Nov 2, 2025",
      assignedTimestamp: "Nov 2, 2025 - 10:15 AM",
      department: "Engineering",
      project: "Security Enhancement",
      subtasks: [
        { id: "2-1", title: "Setup JWT tokens", completed: true },
        { id: "2-2", title: "Implement OAuth", completed: false },
      ],
      tags: ["backend", "security"],
      comments: [],
      attachments: [],
    },
    {
      id: "3",
      title: "Set up CI/CD pipeline for automated deployment",
      assignedTo: "EMP001",
      assignedToName: "John Rodriguez",
      assignedBy: "EMP009",
      assignedByName: "Lisa Park",
      priority: "medium",
      dueDate: "2025-11-19",
      status: "in-progress",
      progress: 30,
      description: "Configure automated deployment with Docker and Kubernetes",
      createdAt: "Oct 28, 2025",
      assignedTimestamp: "Oct 28, 2025 - 02:45 PM",
      department: "DevOps",
      project: "Infrastructure",
      subtasks: [
        { id: "3-1", title: "Setup Docker containers", completed: true },
        { id: "3-2", title: "Configure Kubernetes", completed: false },
        { id: "3-3", title: "Setup monitoring", completed: false },
      ],
      tags: ["devops", "automation"],
      comments: [],
      attachments: [],
    },
    {
      id: "4",
      title: "Update API documentation",
      assignedTo: "EMP008",
      assignedToName: "Mike Chen",
      assignedBy: "EMP009",
      assignedByName: "Lisa Park",
      priority: "low",
      dueDate: "2025-11-25",
      status: "todo",
      progress: 0,
      description: "Document all API endpoints with examples",
      createdAt: "Nov 5, 2025",
      assignedTimestamp: "Nov 5, 2025 - 11:00 AM",
      department: "Engineering",
      project: "Documentation",
      subtasks: [],
      tags: ["documentation", "api"],
      comments: [],
      attachments: [],
    },
    {
      id: "5",
      title: "Database schema migration",
      assignedTo: "EMP001",
      assignedToName: "John Rodriguez",
      assignedBy: "EMP009",
      assignedByName: "Lisa Park",
      priority: "high",
      dueDate: "2025-11-10",
      status: "blocked",
      progress: 20,
      description: "Migrate to new database schema for improved performance",
      createdAt: "Oct 30, 2025",
      assignedTimestamp: "Oct 30, 2025 - 03:15 PM",
      department: "Engineering",
      project: "Database Optimization",
      subtasks: [],
      tags: ["database", "backend"],
      comments: [],
      attachments: [],
    },
    {
      id: "6",
      title: "Create marketing landing page",
      assignedTo: "EMP014",
      assignedToName: "Bardo Wilson",
      assignedBy: "EMP009",
      assignedByName: "Lisa Park",
      priority: "medium",
      dueDate: "2025-10-15",
      status: "completed",
      progress: 100,
      description: "Design and develop new landing page for campaign",
      createdAt: "Oct 1, 2025",
      assignedTimestamp: "Oct 1, 2025 - 09:00 AM",
      department: "Marketing",
      project: "Campaign Q4",
      subtasks: [],
      tags: ["design", "marketing"],
      comments: [],
      attachments: [],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [chartView, setChartView] = useState<"staff" | "department" | "all">("all");

  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    description: "",
    department: "",
    project: "",
  });

  const [newComment, setNewComment] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  const isManager =
    userRole === "management" || userRole === "superadmin" || userRole === "hr";

  // Calculate stats
  const activeTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "blocked"
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;
  const completedThisMonth = tasks.filter(
    (t) =>
      t.status === "completed" &&
      new Date(t.createdAt).getMonth() === new Date().getMonth()
  ).length;
  const overdueTasks = tasks.filter(
    (t) => new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const searchMatch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    const departmentMatch =
      selectedDepartment === "all" || task.department === selectedDepartment;
    const staffMatch = selectedStaff === "all" || task.assignedTo === selectedStaff;
    const projectMatch = selectedProject === "all" || task.project === selectedProject;
    const statusMatch =
      selectedStatusFilter === "all" || task.status === selectedStatusFilter;

    return searchMatch && departmentMatch && staffMatch && projectMatch && statusMatch;
  });

  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    blocked: filteredTasks.filter((t) => t.status === "blocked"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      assignedToName: newTask.assignedTo,
      assignedBy: "EMP001",
      assignedByName: "John Smith",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      status: "todo",
      progress: 0,
      description: newTask.description,
      createdAt: new Date().toLocaleDateString(),
      assignedTimestamp: new Date().toLocaleString(),
      department: newTask.department,
      project: newTask.project,
      comments: [],
      subtasks: [],
      tags: [],
      attachments: [],
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
      description: "",
      department: "",
      project: "",
    });
    setShowCreateDialog(false);
    toast.success("Task created successfully!");
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;

    setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setShowEditDialog(false);
    setEditingTask(null);
    toast.success("Task updated successfully!");
  };

  const handleDrop = (task: Task, newStatus: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus as "todo" | "in-progress" | "completed" | "blocked",
              progress: newStatus === "completed" ? 100 : t.progress,
            }
          : t
      )
    );
    toast.success("Task status updated!");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    toast.success("Task deleted!");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditDialog(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      authorAvatar: "CU",
      text: newComment,
      timestamp: "Just now",
    };

    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? { ...task, comments: [...task.comments, comment] }
          : task
      )
    );

    // Update selectedTask
    setSelectedTask({
      ...selectedTask,
      comments: [...selectedTask.comments, comment],
    });

    setNewComment("");
    toast.success("Comment added!");
  };

  const handleDownloadReport = () => {
    // Filter tasks by selected month
    const [year, month] = selectedMonth.split('-');
    const monthTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getFullYear() === parseInt(year) && 
             taskDate.getMonth() + 1 === parseInt(month);
    });

    // Generate CSV content
    const csvContent = [
      // Header
      ['Task Report', `Month: ${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`],
      [''],
      ['Task ID', 'Title', 'Assigned To', 'Assigned By', 'Department', 'Project', 'Priority', 'Status', 'Progress', 'Due Date', 'Created At'],
      // Data rows
      ...monthTasks.map(task => [
        task.id,
        task.title,
        `${task.assignedToName} (${task.assignedTo})`,
        task.assignedByName,
        task.department || 'N/A',
        task.project || 'N/A',
        task.priority.toUpperCase(),
        task.status,
        `${task.progress}%`,
        new Date(task.dueDate).toLocaleDateString(),
        task.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `task-report-${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloaded report for ${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    percentage,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    percentage: number;
  }) => (
    <Card className="border border-[#e5e7eb] rounded-2xl hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-[#6b7280]">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-[#1F2937]">{value}</h3>
              <span className={`text-xs ${color}`}>+{percentage}%</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${color.replace("text-", "bg-").replace(/\[.*?\]/, "[#f0fdf4]")}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
        <div className="mt-4">
          <Progress value={percentage} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#1F2937] mb-2">Tasks Management</h1>
            <p className="text-sm text-[#6b7280]">
              Track and manage project tasks across teams
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3D34] hover:bg-[#16302a] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-[#1F2937]">Create New Task</DialogTitle>
                <DialogDescription className="text-[#6b7280]">
                  {isManager
                    ? "Assign a task to a team member"
                    : "Create a task for yourself"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Task Title *</Label>
                  <Input
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assign To (Staff ID) *</Label>
                  <Input
                    placeholder="e.g., EMP001"
                    value={newTask.assignedTo}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignedTo: e.target.value })
                    }
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={newTask.department}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, department: value })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Input
                      placeholder="Project name"
                      value={newTask.project}
                      onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority *</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: any) =>
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Task details and requirements"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="bg-white min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleCreateTask}
                  className="w-full bg-[#1E3D34] hover:bg-[#16302a] text-white"
                >
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Active Tasks"
            value={activeTasks}
            icon={ListChecks}
            color="text-[#1E3D34]"
            percentage={12}
          />
          <StatCard
            title="Pending Tasks"
            value={pendingTasks}
            icon={Clock}
            color="text-[#d97706]"
            percentage={8}
          />
          <StatCard
            title="Completed This Month"
            value={completedThisMonth}
            icon={Target}
            color="text-[#15803d]"
            percentage={25}
          />
          <StatCard
            title="Overdue Tasks"
            value={overdueTasks}
            icon={AlertCircle}
            color="text-[#ef4444]"
            percentage={5}
          />
        </div>

        {/* Filter Bar */}
        <Card className="border border-[#e5e7eb] rounded-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <Input
                  placeholder="Search tasks, staff, or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-[#e5e7eb]"
                />
              </div>
              {isManager && (
                <>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-full lg:w-[160px] bg-white">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger className="w-full lg:w-[160px] bg-white">
                      <SelectValue placeholder="Staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      <SelectItem value="EMP001">John Rodriguez</SelectItem>
                      <SelectItem value="EMP008">Mike Chen</SelectItem>
                      <SelectItem value="EMP014">Bardo Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-full lg:w-[160px] bg-white">
                      <SelectValue placeholder="Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="Platform Redesign">Platform Redesign</SelectItem>
                      <SelectItem value="Security Enhancement">
                        Security Enhancement
                      </SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              <Select
                value={selectedStatusFilter}
                onValueChange={setSelectedStatusFilter}
              >
                <SelectTrigger className="w-full lg:w-[140px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {isManager && (
                <>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full lg:w-[140px] bg-white">
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
                    variant="outline"
                    onClick={handleDownloadReport}
                    className="border-[#e5e7eb]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <DropZone
            status="todo"
            tasks={tasksByStatus.todo}
            title="To Do"
            color="bg-[#94a3b8]"
            onDrop={handleDrop}
            onViewDetails={setSelectedTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <DropZone
            status="in-progress"
            tasks={tasksByStatus["in-progress"]}
            title="In Progress"
            color="bg-[#FFD43B]"
            onDrop={handleDrop}
            onViewDetails={setSelectedTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <DropZone
            status="blocked"
            tasks={tasksByStatus.blocked}
            title="Blocked"
            color="bg-[#ef4444]"
            onDrop={handleDrop}
            onViewDetails={setSelectedTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <DropZone
            status="completed"
            tasks={tasksByStatus.completed}
            title="Completed"
            color="bg-[#15803d]"
            onDrop={handleDrop}
            onViewDetails={setSelectedTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </div>

        {/* Monthly Summary Chart */}
        {isManager && (
          <Card className="border border-[#e5e7eb] rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#1F2937]">Monthly Performance Summary</h3>
                  <p className="text-sm text-[#6b7280]">
                    Track task completion trends over time
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={chartView} onValueChange={setChartView as any}>
                    <SelectTrigger className="w-[140px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="staff">By Staff</SelectItem>
                      <SelectItem value="department">By Department</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
                    className="border-[#e5e7eb]"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadReport}
                    className="border-[#e5e7eb]"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "line" ? (
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any, name: string) => {
                        if (chartView === "department") {
                          return [value, `${name} - Engineering Dept`];
                        } else if (chartView === "staff") {
                          return [value, `${name} - John Rodriguez`];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#15803d"
                      strokeWidth={2}
                      name="Completed"
                    />
                    <Line
                      type="monotone"
                      dataKey="inProgress"
                      stroke="#FFD43B"
                      strokeWidth={2}
                      name="In Progress"
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#1E3D34"
                      strokeWidth={2}
                      name="Total"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any, name: string) => {
                        if (chartView === "department") {
                          return [value, `${name} - Engineering Dept`];
                        } else if (chartView === "staff") {
                          return [value, `${name} - John Rodriguez`];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="#15803d" name="Completed" />
                    <Bar dataKey="inProgress" fill="#FFD43B" name="In Progress" />
                    <Bar dataKey="total" fill="#1E3D34" name="Total" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Edit Task Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#1F2937]">Edit Task</DialogTitle>
              <DialogDescription className="text-[#6b7280]">
                Update task details
              </DialogDescription>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Task Title *</Label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority *</Label>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(value: any) =>
                        setEditingTask({ ...editingTask, priority: value })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, dueDate: e.target.value })
                      }
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editingTask.progress}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        progress: parseInt(e.target.value),
                      })
                    }
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, description: e.target.value })
                    }
                    className="bg-white min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleUpdateTask}
                  className="w-full bg-[#1E3D34] hover:bg-[#16302a] text-white"
                >
                  Update Task
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Task Detail Sheet */}
        {selectedTask && (
          <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-[#1F2937] pr-8">
                  {selectedTask.title}
                </SheetTitle>
                <SheetDescription className="text-[#6b7280]">
                  Task Details and Activity
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Task Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-[#6b7280]">Assigned To</Label>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-[#1E3D34] text-white text-xs">
                          {selectedTask.assignedToName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#1F2937]">
                          {selectedTask.assignedToName}
                        </span>
                        <span className="text-xs text-[#6b7280]">
                          {selectedTask.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-[#6b7280]">Assigned By</Label>
                    <span className="text-sm text-[#1F2937] block">
                      {selectedTask.assignedByName}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-[#6b7280]">Priority</Label>
                    <Badge
                      className={`text-xs ${
                        selectedTask.priority === "high"
                          ? "bg-[#fef2f2] text-[#ef4444] border-[#fecaca]"
                          : selectedTask.priority === "medium"
                          ? "bg-[#fef9c3] text-[#d97706] border-[#fde68a]"
                          : "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]"
                      }`}
                    >
                      {selectedTask.priority === "high"
                        ? "Urgent"
                        : selectedTask.priority.charAt(0).toUpperCase() +
                          selectedTask.priority.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-[#6b7280]">Due Date</Label>
                    <span className="text-sm text-[#1F2937] block">
                      {new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {selectedTask.department && (
                    <div className="space-y-1">
                      <Label className="text-xs text-[#6b7280]">Department</Label>
                      <span className="text-sm text-[#1F2937] block">
                        {selectedTask.department}
                      </span>
                    </div>
                  )}

                  {selectedTask.project && (
                    <div className="space-y-1">
                      <Label className="text-xs text-[#6b7280]">Project</Label>
                      <span className="text-sm text-[#1F2937] block">
                        {selectedTask.project}
                      </span>
                    </div>
                  )}
                </div>

                {/* Assignment Timestamp */}
                <div className="p-3 border border-[#e5e7eb] rounded-xl bg-[#f9fafb]">
                  <p className="text-xs text-[#6b7280]">
                    Task assigned on {selectedTask.assignedTimestamp}
                  </p>
                </div>

                {/* Description */}
                {selectedTask.description && (
                  <div className="space-y-2">
                    <Label className="text-[#1F2937]">Description</Label>
                    <p className="text-sm text-[#6b7280] p-4 border border-[#e5e7eb] rounded-xl bg-white">
                      {selectedTask.description}
                    </p>
                  </div>
                )}

                {/* Subtasks */}
                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-[#1F2937]">
                      Subtasks ({selectedTask.subtasks.filter((s) => s.completed).length}/
                      {selectedTask.subtasks.length})
                    </Label>
                    <div className="space-y-2">
                      {selectedTask.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-3 p-3 border border-[#e5e7eb] rounded-xl bg-white"
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              subtask.completed
                                ? "bg-[#1E3D34] border-[#1E3D34]"
                                : "border-[#e5e7eb]"
                            }`}
                          >
                            {subtask.completed && (
                              <CheckSquare className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              subtask.completed
                                ? "text-[#6b7280] line-through"
                                : "text-[#1F2937]"
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#1F2937]">Progress</Label>
                    <span className="text-sm text-[#1E3D34]">
                      {selectedTask.progress}%
                    </span>
                  </div>
                  <Progress value={selectedTask.progress} className="h-2.5" />
                </div>

                {/* Status Update */}
                <div className="space-y-2">
                  <Label className="text-[#1F2937]">Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value: any) => {
                      handleDrop(selectedTask, value);
                      setSelectedTask({ ...selectedTask, status: value });
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comments Section */}
                <div className="space-y-4 border-t border-[#e5e7eb] pt-6">
                  <Label className="text-[#1F2937]">
                    Activity & Comments ({selectedTask.comments.length})
                  </Label>
                  <div className="space-y-4">
                    {selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-[#1E3D34] text-white text-xs">
                            {comment.authorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#1F2937]">
                              {comment.author}
                            </span>
                            <span className="text-xs text-[#6b7280]">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-[#6b7280] border border-[#e5e7eb] rounded-xl p-3 bg-white">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-white min-h-[60px] rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleAddComment}
                    className="w-full bg-[#1E3D34] hover:bg-[#16302a] text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </DndProvider>
  );
}