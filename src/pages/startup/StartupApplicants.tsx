import { useState } from "react";
import {
  MoreVertical,
  Search,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

/* ---------------- Types ---------------- */

type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "REJECTED";

interface Application {
  id: number;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  skills: string[];
  appliedAt: string;
  status: ApplicationStatus;
}

/* ---------------- Dummy Data ---------------- */

const initialApplications: Application[] = [
  {
    id: 1,
    candidateName: "Amit Sharma",
    candidateEmail: "amit@gmail.com",
    jobTitle: "Frontend Developer",
    skills: ["React", "TypeScript"],
    appliedAt: "12 Jan 2026",
    status: "PENDING",
  },
  {
    id: 2,
    candidateName: "Neha Patil",
    candidateEmail: "neha@gmail.com",
    jobTitle: "Backend Engineer",
    skills: ["Node.js", "MongoDB"],
    appliedAt: "13 Jan 2026",
    status: "SHORTLISTED",
  },
  {
    id: 3,
    candidateName: "Rahul Verma",
    candidateEmail: "rahul@gmail.com",
    jobTitle: "UI/UX Designer",
    skills: ["Figma", "UX"],
    appliedAt: "14 Jan 2026",
    status: "REJECTED",
  },
];

/* ---------------- Page ---------------- */

export default function StartupApplicants() {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  /* -------- Status Update -------- */

  const updateStatus = (id: number, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status } : a
      )
    );

    toast({
      title: "Status Updated",
      description: `Applicant marked as ${status}`,
    });
  };

  /* -------- Filtering -------- */

  const filteredApplications = applications.filter((a) => {
    const matchSearch =
      a.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || a.status === statusFilter;

    return matchSearch && matchStatus;
  });

  /* ---------------- UI ---------------- */

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-7 w-7 text-accent" />
            Applications
          </h1>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidate or job..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              No applications found.
            </p>
          )}

          {filteredApplications.map((app) => (
            <Card key={app.id} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {app.candidateName}
                  </CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatus(app.id, "PENDING")
                        }
                      >
                        Mark Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatus(app.id, "SHORTLISTED")
                        }
                      >
                        Shortlist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatus(app.id, "REJECTED")
                        }
                      >
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Job */}
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{app.jobTitle}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Applied on {app.appliedAt}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {app.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Status */}
                <Badge
                  variant={
                    app.status === "REJECTED"
                      ? "destructive"
                      : app.status === "SHORTLISTED"
                      ? "accent"
                      : "secondary"
                  }
                >
                  {app.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StartupLayout>
  );
}
