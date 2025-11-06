import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Send, Search, Lock, Users, Bell, UserPlus, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatGroup {
  id: string;
  name: string;
  department?: string;
  unread: number;
  lastMessage: string;
  isReadOnly?: boolean;
  isGlobal?: boolean;
}

interface DirectMessage {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  unread: number;
  lastMessage: string;
  timestamp: string;
  isOnline?: boolean;
}

interface ChatPageProps {
  userRole?: string;
  userDepartment?: string;
}

export function ChatPage({ userRole = "staff", userDepartment = "Tech" }: ChatPageProps) {
  const [selectedGroup, setSelectedGroup] = useState("my-team");
  const [selectedDM, setSelectedDM] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("all");
  const [chatType, setChatType] = useState<"channels" | "direct">("channels");
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = userRole === "superadmin" || userRole === "hr" || userRole === "management";

  // All available chat groups
  const allGroups: ChatGroup[] = [
    { id: "my-team", name: "My Team Chat", department: userDepartment, unread: 3, lastMessage: "Great work on the project!" },
    { id: "hr-announcements", name: "HR Announcements", unread: 1, lastMessage: "Benefits enrollment now open", isReadOnly: true, isGlobal: true },
    { id: "support", name: "Support", unread: 0, lastMessage: "How can we help?", isGlobal: true },
    
    // Admin-only chats
    { id: "tech-team", name: "Tech Team", department: "Tech", unread: 2, lastMessage: "Sprint planning tomorrow" },
    { id: "design-team", name: "Design Team", department: "Design", unread: 0, lastMessage: "New mockups ready" },
    { id: "marketing-team", name: "Marketing Team", department: "Marketing", unread: 1, lastMessage: "Campaign results" },
    { id: "sales-team", name: "Sales Team", department: "Sales", unread: 0, lastMessage: "Q4 targets met!" },
    { id: "hr-team", name: "HR Team", department: "HR", unread: 0, lastMessage: "Onboarding schedule" },
    { id: "finance-team", name: "Finance Team", department: "Finance", unread: 1, lastMessage: "Budget review" },
  ];

  // Filter groups based on user role
  const availableGroups = isAdmin 
    ? allGroups
    : allGroups.filter(g => g.isGlobal || g.id === "my-team");

  // Further filter by department if admin has selected a filter
  const filteredGroups = isAdmin && selectedDepartmentFilter !== "all"
    ? availableGroups.filter(g => g.isGlobal || g.department === selectedDepartmentFilter)
    : availableGroups;

  const departments = ["Tech", "Design", "Marketing", "Sales", "HR", "Finance"];

  // Direct messages with staff from different departments
  const directMessages: DirectMessage[] = [
    { id: "dm-1", name: "Sarah Martinez", department: "Design", position: "UI/UX Designer", avatar: "SM", unread: 2, lastMessage: "Can you review the mockups?", timestamp: "5 min ago", isOnline: true },
    { id: "dm-2", name: "David Kim", department: "Marketing", position: "Content Manager", avatar: "DK", unread: 0, lastMessage: "Thanks for the info!", timestamp: "1 hour ago", isOnline: true },
    { id: "dm-3", name: "Emily Chen", department: "Finance", position: "Financial Analyst", avatar: "EC", unread: 1, lastMessage: "Budget approval needed", timestamp: "2 hours ago", isOnline: false },
    { id: "dm-4", name: "Michael Brown", department: "Operations", position: "Project Manager", avatar: "MB", unread: 0, lastMessage: "Meeting at 3 PM", timestamp: "Yesterday", isOnline: false },
    { id: "dm-5", name: "Jessica Taylor", department: "HR", position: "HR Specialist", avatar: "JT", unread: 0, lastMessage: "Leave request approved", timestamp: "Yesterday", isOnline: true },
    { id: "dm-6", name: "Robert Wilson", department: "Sales", position: "Sales Manager", avatar: "RW", unread: 3, lastMessage: "New client demo tomorrow", timestamp: "3 hours ago", isOnline: true },
    { id: "dm-7", name: "Lisa Anderson", department: "Tech", position: "Backend Developer", avatar: "LA", unread: 0, lastMessage: "Code review complete", timestamp: "2 days ago", isOnline: false },
  ];

  const filteredDMs = searchTerm
    ? directMessages.filter(dm => 
        dm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dm.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : directMessages;

  const messages: { [key: string]: Message[] } = {
    "my-team": [
      {
        id: "1",
        sender: "Alice Johnson",
        avatar: "AJ",
        content: "Hey team, just pushed the latest updates to the evaluation module.",
        timestamp: "10:30 AM",
        isOwn: false,
      },
      {
        id: "2",
        sender: "You",
        avatar: "ME",
        content: "Thanks Alice! I'll review it this afternoon.",
        timestamp: "10:35 AM",
        isOwn: true,
      },
      {
        id: "3",
        sender: "Bob Williams",
        avatar: "BW",
        content: "Great work on the project! The new charts look amazing.",
        timestamp: "10:42 AM",
        isOwn: false,
      },
      {
        id: "4",
        sender: "Alice Johnson",
        avatar: "AJ",
        content: "Thanks Bob! Let me know if you spot any issues.",
        timestamp: "10:45 AM",
        isOwn: false,
      },
    ],
    "hr-announcements": [
      {
        id: "1",
        sender: "HR Department",
        avatar: "HR",
        content: "🎉 Benefits enrollment is now open! Please review your options by November 15th.",
        timestamp: "Yesterday",
        isOwn: false,
      },
      {
        id: "2",
        sender: "HR Department",
        avatar: "HR",
        content: "Reminder: Holiday schedule will be posted next week.",
        timestamp: "2 days ago",
        isOwn: false,
      },
    ],
    "support": [
      {
        id: "1",
        sender: "Support Team",
        avatar: "ST",
        content: "Welcome to Support! How can we help you today?",
        timestamp: "9:00 AM",
        isOwn: false,
      },
    ],
    "tech-team": [
      {
        id: "1",
        sender: "Mike Chen",
        avatar: "MC",
        content: "Sprint planning meeting tomorrow at 10 AM",
        timestamp: "11:20 AM",
        isOwn: false,
      },
      {
        id: "2",
        sender: "Sarah Lee",
        avatar: "SL",
        content: "I'll prepare the backlog review",
        timestamp: "11:25 AM",
        isOwn: false,
      },
    ],
    "design-team": [
      {
        id: "1",
        sender: "Emma Davis",
        avatar: "ED",
        content: "New mockups are ready for review in Figma",
        timestamp: "2:30 PM",
        isOwn: false,
      },
    ],
    "marketing-team": [
      {
        id: "1",
        sender: "John Marketing",
        avatar: "JM",
        content: "Campaign results exceeded expectations!",
        timestamp: "1:45 PM",
        isOwn: false,
      },
    ],
    // Direct message conversations
    "dm-1": [
      { id: "1", sender: "Sarah Martinez", avatar: "SM", content: "Hey! I just finished the new dashboard mockups. Can you review them?", timestamp: "10:15 AM", isOwn: false },
      { id: "2", sender: "You", avatar: "ME", content: "Sure! I'll take a look now.", timestamp: "10:18 AM", isOwn: true },
      { id: "3", sender: "Sarah Martinez", avatar: "SM", content: "Thanks! Let me know if you have any feedback.", timestamp: "10:20 AM", isOwn: false },
    ],
    "dm-2": [
      { id: "1", sender: "David Kim", avatar: "DK", content: "Do you have the analytics data from last week?", timestamp: "9:30 AM", isOwn: false },
      { id: "2", sender: "You", avatar: "ME", content: "Yes, I'll send it over in a few minutes.", timestamp: "9:35 AM", isOwn: true },
      { id: "3", sender: "David Kim", avatar: "DK", content: "Thanks for the info!", timestamp: "11:00 AM", isOwn: false },
    ],
    "dm-3": [
      { id: "1", sender: "Emily Chen", avatar: "EC", content: "Hi, I need approval for the Q4 budget allocation.", timestamp: "Yesterday", isOwn: false },
      { id: "2", sender: "You", avatar: "ME", content: "I'll review it today and get back to you.", timestamp: "Yesterday", isOwn: true },
    ],
    "dm-6": [
      { id: "1", sender: "Robert Wilson", avatar: "RW", content: "We have a new client demo scheduled for tomorrow at 2 PM.", timestamp: "3 hours ago", isOwn: false },
      { id: "2", sender: "Robert Wilson", avatar: "RW", content: "Can you prepare the presentation slides?", timestamp: "3 hours ago", isOwn: false },
      { id: "3", sender: "Robert Wilson", avatar: "RW", content: "Let me know if you need any materials.", timestamp: "3 hours ago", isOwn: false },
    ],
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // Message sending logic
    setMessageText("");
  };

  const selectedGroupData = filteredGroups.find(g => g.id === selectedGroup);
  const selectedDMData = directMessages.find(dm => dm.id === selectedDM);
  const currentMessages = chatType === "direct" && selectedDM 
    ? messages[selectedDM] || []
    : messages[selectedGroup] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#1F2937] mb-2">Team Chat</h1>
        <p className="text-[#6b7280]">
          {isAdmin ? "Access all team communications" : "Communicate with your team"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Sidebar - Chat Groups & Direct Messages */}
        <Card className="bg-white shadow-sm lg:col-span-1 flex flex-col">
          <CardHeader className="border-b border-[#e5e7eb] pb-3">
            <Tabs value={chatType} onValueChange={(v) => setChatType(v as "channels" | "direct")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#F5F7F8]">
                <TabsTrigger value="channels" className="text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  Channels
                </TabsTrigger>
                <TabsTrigger value="direct" className="text-xs">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Direct
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-y-auto">
            {chatType === "channels" ? (
              <>
                {isAdmin && (
                  <div className="p-3 border-b border-[#e5e7eb]">
                    <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}>
                      <SelectTrigger className="bg-white h-9 text-xs">
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-1 p-2">
                  {filteredGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => {
                        setSelectedGroup(group.id);
                        setSelectedDM(null);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                        selectedGroup === group.id && !selectedDM
                          ? "bg-[#1F6E4A] text-white"
                          : "hover:bg-[#F5F7F8] text-[#1F2937]"
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className={selectedGroup === group.id && !selectedDM ? "bg-white/20 text-white" : "bg-[#1F6E4A] text-white"}>
                            {group.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {group.unread > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#ef4444] text-white text-xs">
                            {group.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${selectedGroup === group.id && !selectedDM ? "text-white" : "text-[#1F2937]"}`}>
                            {group.name}
                          </p>
                          {group.isReadOnly && (
                            <Lock className={`w-3 h-3 ${selectedGroup === group.id && !selectedDM ? "text-white" : "text-[#6b7280]"}`} />
                          )}
                          {group.isGlobal && (
                            <Bell className={`w-3 h-3 ${selectedGroup === group.id && !selectedDM ? "text-white" : "text-[#6b7280]"}`} />
                          )}
                        </div>
                        <p className={`text-xs truncate ${selectedGroup === group.id && !selectedDM ? "text-white/80" : "text-[#6b7280]"}`}>
                          {group.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="p-3 border-b border-[#e5e7eb]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <Input
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1 p-2">
                  {filteredDMs.map((dm) => (
                    <button
                      key={dm.id}
                      onClick={() => {
                        setSelectedDM(dm.id);
                        setChatType("direct");
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                        selectedDM === dm.id
                          ? "bg-[#1F6E4A] text-white"
                          : "hover:bg-[#F5F7F8] text-[#1F2937]"
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className={selectedDM === dm.id ? "bg-white/20 text-white" : "bg-[#1F6E4A] text-white"}>
                            {dm.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {dm.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                        {dm.unread > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#ef4444] text-white text-xs">
                            {dm.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${selectedDM === dm.id ? "text-white" : "text-[#1F2937]"}`}>
                            {dm.name}
                          </p>
                          <p className={`text-xs ${selectedDM === dm.id ? "text-white/70" : "text-[#6b7280]"}`}>
                            {dm.timestamp}
                          </p>
                        </div>
                        <p className={`text-xs truncate ${selectedDM === dm.id ? "text-white/80" : "text-[#6b7280]"}`}>
                          {dm.department} • {dm.position}
                        </p>
                        <p className={`text-xs truncate ${selectedDM === dm.id ? "text-white/70" : "text-[#6b7280]"}`}>
                          {dm.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="bg-white shadow-sm lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[#1F6E4A] text-white">
                      {chatType === "direct" && selectedDMData 
                        ? selectedDMData.avatar
                        : selectedGroupData?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {chatType === "direct" && selectedDMData?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-[#1F2937] flex items-center gap-2">
                    {chatType === "direct" && selectedDMData 
                      ? selectedDMData.name
                      : selectedGroupData?.name}
                    {selectedGroupData?.isReadOnly && chatType === "channels" && (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Read Only
                      </Badge>
                    )}
                    {chatType === "direct" && selectedDMData?.isOnline && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Online
                      </Badge>
                    )}
                  </CardTitle>
                  {chatType === "direct" && selectedDMData ? (
                    <p className="text-xs text-[#6b7280]">{selectedDMData.position} • {selectedDMData.department}</p>
                  ) : selectedGroupData?.department ? (
                    <p className="text-xs text-[#6b7280]">{selectedGroupData.department} Department</p>
                  ) : null}
                </div>
              </div>
              {chatType === "direct" && selectedDMData && (
                <Badge variant="secondary" className="bg-[#F5F7F8] text-[#6b7280]">
                  {selectedDMData.department}
                </Badge>
              )}
              {isAdmin && chatType === "channels" && selectedGroupData?.department && (
                <Badge variant="secondary" className="bg-[#F5F7F8] text-[#6b7280]">
                  {selectedGroupData.department}
                </Badge>
              )}
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={message.isOwn ? "bg-[#FFD400] text-[#1F2937]" : "bg-[#1F6E4A] text-white"}>
                    {message.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${message.isOwn ? "flex flex-col items-end" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-[#1F2937]">{message.sender}</span>
                    <span className="text-xs text-[#6b7280]">{message.timestamp}</span>
                  </div>
                  <div
                    className={`inline-block p-3 rounded-lg max-w-lg ${
                      message.isOwn
                        ? "bg-[#1F6E4A] text-white"
                        : "bg-[#F5F7F8] text-[#1F2937]"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-[#e5e7eb] p-4">
            {selectedGroupData?.isReadOnly ? (
              <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280] py-2">
                <Lock className="w-4 h-4" />
                <span>This is a read-only channel</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-white flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#1F6E4A] hover:bg-[#1a5a3d] text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
