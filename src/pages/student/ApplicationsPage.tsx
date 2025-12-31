import { useState } from "react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  Building2,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Eye,
} from "lucide-react";

type ApplicationStatus = "applied" | "shortlisted" | "rejected" | "all";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  appliedDate: string;
  status: "applied" | "shortlisted" | "rejected";
  timeline: {
    date: string;
    event: string;
    description: string;
  }[];
}

const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    company: "TechVenture Labs",
    companyLogo: "TV",
    location: "Bangalore, India",
    appliedDate: "Dec 28, 2025",
    status: "shortlisted",
    timeline: [
      { date: "Dec 28, 2025", event: "Application Submitted", description: "Your application was successfully submitted" },
      { date: "Dec 29, 2025", event: "Application Viewed", description: "Recruiter viewed your application" },
      { date: "Dec 30, 2025", event: "Shortlisted", description: "You've been shortlisted for the next round!" },
    ],
  },
  {
    id: "2",
    jobTitle: "Product Design Intern",
    company: "DesignFirst",
    companyLogo: "DF",
    location: "Remote",
    appliedDate: "Dec 25, 2025",
    status: "applied",
    timeline: [
      { date: "Dec 25, 2025", event: "Application Submitted", description: "Your application was successfully submitted" },
    ],
  },
  {
    id: "3",
    jobTitle: "Backend Engineer",
    company: "CloudScale AI",
    companyLogo: "CS",
    location: "Mumbai, India",
    appliedDate: "Dec 20, 2025",
    status: "rejected",
    timeline: [
      { date: "Dec 20, 2025", event: "Application Submitted", description: "Your application was successfully submitted" },
      { date: "Dec 22, 2025", event: "Application Viewed", description: "Recruiter viewed your application" },
      { date: "Dec 24, 2025", event: "Not Selected", description: "Unfortunately, your profile wasn't selected for this role" },
    ],
  },
  {
    id: "4",
    jobTitle: "Full Stack Developer",
    company: "StartupHub",
    companyLogo: "SH",
    location: "Delhi, India",
    appliedDate: "Dec 22, 2025",
    status: "shortlisted",
    timeline: [
      { date: "Dec 22, 2025", event: "Application Submitted", description: "Your application was successfully submitted" },
      { date: "Dec 23, 2025", event: "Application Viewed", description: "Recruiter viewed your application" },
      { date: "Dec 26, 2025", event: "Shortlisted", description: "You've been shortlisted for a technical interview!" },
    ],
  },
  {
    id: "5",
    jobTitle: "Data Analyst",
    company: "DataDriven Co",
    companyLogo: "DD",
    location: "Hyderabad, India",
    appliedDate: "Dec 18, 2025",
    status: "applied",
    timeline: [
      { date: "Dec 18, 2025", event: "Application Submitted", description: "Your application was successfully submitted" },
      { date: "Dec 20, 2025", event: "Application Viewed", description: "Recruiter viewed your application" },
    ],
  },
];

const statusConfig = {
  applied: {
    label: "Applied",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-accent/10 text-accent border-accent/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
};

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("all");
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockApplications.length,
    applied: mockApplications.filter((a) => a.status === "applied").length,
    shortlisted: mockApplications.filter((a) => a.status === "shortlisted").length,
    rejected: mockApplications.filter((a) => a.status === "rejected").length,
  };

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            My Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(["all", "applied", "shortlisted", "rejected"] as const).map((status) => {
            const isActive = statusFilter === status;
            const config = status === "all" ? null : statusConfig[status];
            
            return (
              <Card
                key={status}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isActive ? "ring-2 ring-accent" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {status === "all" ? "Total" : status}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {statusCounts[status]}
                      </p>
                    </div>
                    {config ? (
                      <config.icon className={`h-8 w-8 ${
                        status === "applied" ? "text-blue-400" :
                        status === "shortlisted" ? "text-accent" : "text-destructive"
                      }`} />
                    ) : (
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ApplicationStatus)}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No applications found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start applying to jobs to see them here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => {
              const config = statusConfig[application.status];
              const isExpanded = expandedApplication === application.id;

              return (
                <Card
                  key={application.id}
                  className="overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  <CardContent className="p-0">
                    {/* Main Application Info */}
                    <div className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Company Logo */}
                        <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-accent">
                            {application.companyLogo}
                          </span>
                        </div>

                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
                            <h3 className="text-lg font-semibold text-foreground truncate">
                              {application.jobTitle}
                            </h3>
                            <Badge className={config.color}>
                              <config.icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {application.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {application.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Applied {application.appliedDate}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Job
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedApplication(isExpanded ? null : application.id)
                            }
                            className="gap-1"
                          >
                            Timeline
                            <ChevronRight
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Section */}
                    {isExpanded && (
                      <div className="border-t border-border bg-muted/30 p-4 lg:p-6 animate-fade-in">
                        <h4 className="text-sm font-medium text-foreground mb-4">
                          Application Timeline
                        </h4>
                        <div className="relative pl-6">
                          {/* Timeline Line */}
                          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                          
                          {/* Timeline Events */}
                          <div className="space-y-4">
                            {application.timeline.map((event, index) => (
                              <div key={index} className="relative">
                                {/* Timeline Dot */}
                                <div
                                  className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                                    index === application.timeline.length - 1
                                      ? application.status === "shortlisted"
                                        ? "bg-accent border-accent"
                                        : application.status === "rejected"
                                        ? "bg-destructive border-destructive"
                                        : "bg-blue-400 border-blue-400"
                                      : "bg-muted border-border"
                                  }`}
                                />
                                
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">
                                      {event.event}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {event.date}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {event.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
