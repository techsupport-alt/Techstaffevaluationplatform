import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { UserPlus, Search, Edit, Trash2, CheckCircle, XCircle, Download, Upload } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  position: string;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Pending";
}

interface StaffEnrollmentPageProps {
  userRole: string;
}

const departments = [
  "Video & Production",
  "Project Management",
  "Product Team",
  "Content & Brand Comms",
  "Interns",
  "Incubator Team",
  "Skillup Team",
  "DAF Team",
  "Graphics Design",
  "Accounting",
  "Business Development",
];

const roles = ["Staff", "Management", "HR"];

const positions = [
  "Video Editor",
  "Producer",
  "Project Manager",
  "Product Manager",
  "Content Writer",
  "Brand Manager",
  "Intern",
  "Tech Trainer",
  "Programs Coordinator",
  "Graphic Designer",
  "Accountant",
  "Business Developer",
];

const mockStaff: StaffMember[] = [
  {
    id: "1",
    employeeId: "EMP001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@reachall.com",
    department: "Video & Production",
    role: "Staff",
    position: "Video Editor",
    enrollmentDate: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    employeeId: "EMP002",
    firstName: "John",
    lastName: "Rodriguez",
    email: "john.rodriguez@reachall.com",
    department: "Project Management",
    role: "Management",
    position: "Project Manager",
    enrollmentDate: "2024-01-10",
    status: "Active",
  },
  {
    id: "3",
    employeeId: "EMP003",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@reachall.com",
    department: "Product Team",
    role: "Staff",
    position: "Product Manager",
    enrollmentDate: "2024-02-01",
    status: "Active",
  },
  {
    id: "4",
    employeeId: "EMP004",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@reachall.com",
    department: "Content & Brand Comms",
    role: "Staff",
    position: "Content Writer",
    enrollmentDate: "2024-01-20",
    status: "Pending",
  },
];

export function StaffEnrollmentPage({ userRole }: StaffEnrollmentPageProps) {
  const [staffList, setStaffList] = useState<StaffMember[]>(mockStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All Departments");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    department: "",
    role: "Staff",
    position: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      department: "",
      role: "Staff",
      position: "",
    });
    setEditingStaff(null);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeId || !formData.firstName || !formData.lastName || 
        !formData.email || !formData.password || !formData.department || !formData.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newStaff: StaffMember = {
      id: Date.now().toString(),
      employeeId: formData.employeeId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      position: formData.position,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: "Active",
    };

    setStaffList((prev) => [...prev, newStaff]);
    toast.success(`${formData.firstName} ${formData.lastName} has been enrolled successfully!`);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      employeeId: staff.employeeId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      password: "",
      department: staff.department,
      role: staff.role,
      position: staff.position,
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStaff) return;

    setStaffList((prev) =>
      prev.map((staff) =>
        staff.id === editingStaff.id
          ? {
              ...staff,
              employeeId: formData.employeeId,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              department: formData.department,
              role: formData.role,
              position: formData.position,
            }
          : staff
      )
    );

    toast.success("Staff information updated successfully!");
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((staff) => staff.id !== id));
    toast.success("Staff member removed successfully");
  };

  const handleToggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((staff) =>
        staff.id === id
          ? { ...staff, status: staff.status === "Active" ? "Inactive" : "Active" }
          : staff
      )
    );
    toast.success("Status updated successfully");
  };

  const handleBulkUpload = () => {
    toast.info("Bulk upload feature coming soon!");
  };

  const handleDownloadTemplate = () => {
    toast.success("CSV template downloaded successfully!");
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      filterDepartment === "All Departments" || staff.department === filterDepartment;

    const matchesStatus =
      filterStatus === "All Status" || staff.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2937] mb-2 flex items-center gap-3">
            <UserPlus className="w-10 h-10 text-[#1F6E4A]" />
            Staff Enrollment
          </h1>
          <p className="text-[#6b7280]">
            Manage and enroll staff members to the ReachAll platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="border-[#1F6E4A] text-[#1F6E4A] hover:bg-[#1F6E4A]/5"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkUpload}
            className="border-[#1F6E4A] text-[#1F6E4A] hover:bg-[#1F6E4A]/5"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Enroll New Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#1F2937]">
                  {editingStaff ? "Edit Staff Information" : "Enroll New Staff Member"}
                </DialogTitle>
                <DialogDescription className="text-[#6b7280]">
                  {editingStaff
                    ? "Update the staff member's information below"
                    : "Fill in the details to enroll a new staff member"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff} className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-[#1F2937]">
                      Employee ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employeeId"
                      placeholder="e.g., EMP001"
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange("employeeId", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#1F2937]">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@reachall.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[#1F2937]">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[#1F2937]">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {!editingStaff && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#1F2937]">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter default password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <p className="text-xs text-[#6b7280]">
                      Staff can change this password after first login
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-[#1F2937]">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-[#1F2937]">
                      Position <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => handleInputChange("position", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#1F2937]">
                    Platform Role <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[#6b7280]">
                    This determines the staff member's access level in the platform
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
                  >
                    {editingStaff ? "Update Staff" : "Enroll Staff"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-2 border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280] mb-1">Total Staff</p>
                <p className="text-3xl text-[#1F2937]">{staffList.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#1F6E4A]/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-[#1F6E4A]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280] mb-1">Active</p>
                <p className="text-3xl text-[#1F2937]">
                  {staffList.filter((s) => s.status === "Active").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280] mb-1">Inactive</p>
                <p className="text-3xl text-[#1F2937]">
                  {staffList.filter((s) => s.status === "Inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b7280] mb-1">Pending</p>
                <p className="text-3xl text-[#1F2937]">
                  {staffList.filter((s) => s.status === "Pending").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="rounded-2xl border-2 border-[#e5e7eb]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[#1F2937]">Search Staff</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <Input
                  placeholder="Search by ID, name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#1F2937]">Filter by Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#1F2937]">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="rounded-2xl border-2 border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Enrolled Staff Members</CardTitle>
          <CardDescription className="text-[#6b7280]">
            Showing {filteredStaff.length} of {staffList.length} staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-[#e5e7eb] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F5F7F8] hover:bg-[#F5F7F8]">
                  <TableHead className="text-[#1F2937]">Staff Member</TableHead>
                  <TableHead className="text-[#1F2937]">Employee ID</TableHead>
                  <TableHead className="text-[#1F2937]">Department</TableHead>
                  <TableHead className="text-[#1F2937]">Position</TableHead>
                  <TableHead className="text-[#1F2937]">Role</TableHead>
                  <TableHead className="text-[#1F2937]">Enrollment Date</TableHead>
                  <TableHead className="text-[#1F2937]">Status</TableHead>
                  <TableHead className="text-[#1F2937] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-[#6b7280]">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-[#F5F7F8]/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-[#e5e7eb]">
                            <AvatarFallback className="bg-[#1F6E4A] text-white text-sm">
                              {getInitials(staff.firstName, staff.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[#1F2937]">
                              {staff.firstName} {staff.lastName}
                            </p>
                            <p className="text-sm text-[#6b7280]">{staff.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#1F2937]">{staff.employeeId}</TableCell>
                      <TableCell className="text-[#6b7280]">{staff.department}</TableCell>
                      <TableCell className="text-[#6b7280]">{staff.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            staff.role === "Management"
                              ? "border-[#1F6E4A] text-[#1F6E4A] bg-[#1F6E4A]/5"
                              : staff.role === "HR"
                              ? "border-blue-500 text-blue-500 bg-blue-50"
                              : "border-gray-400 text-gray-600 bg-gray-50"
                          }
                        >
                          {staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#6b7280]">{staff.enrollmentDate}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            staff.status === "Active"
                              ? "bg-green-100 text-green-700 border-0"
                              : staff.status === "Inactive"
                              ? "bg-red-100 text-red-700 border-0"
                              : "bg-yellow-100 text-yellow-700 border-0"
                          }
                        >
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStaff(staff)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(staff.id)}
                            className="h-8 w-8 p-0"
                          >
                            {staff.status === "Active" ? (
                              <XCircle className="w-4 h-4 text-orange-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
