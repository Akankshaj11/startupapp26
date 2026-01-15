import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Calendar,
  Layers,
  GraduationCap,
  Mail,
  CheckCircle,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { StartupLayout } from "@/components/layouts/StartupLayout"; // Integrated Sidebar/Navbar Layout

interface Applicant {
  id: number;
  name: string;
  email: string;
  appliedOn: string;
  status: "Pending" | "Shortlisted" | "Rejected";
}

interface Job {
  id: number;
  title: string;
  description: string;
  experienceRequired: string;
  educationRequired: string;
  skillsRequired: string[];
  applicants: Applicant[];
  postedOn: string;
  status: "Open" | "Closed";
}

const skillsList = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Python",
  "Java",
  "AWS",
  "Docker",
];

export default function StartupJobDetail() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewApplicants, setViewApplicants] = useState(false);
  const [editJob, setEditJob] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);

  const hardcodedJobs: Job[] = [
    {
      id: 101,
      title: "Frontend Developer",
      description: "Looking for a React developer with strong UI skills.",
      experienceRequired: "1-3 years",
      educationRequired: "B.E / B.Tech",
      skillsRequired: ["React", "JavaScript", "CSS"],
      postedOn: "2025-01-10",
      status: "Open",
      applicants: [
        {
          id: 1,
          name: "Amit Sharma",
          email: "amit@gmail.com",
          appliedOn: "2025-01-12",
          status: "Pending",
        },
      ],
    },
    {
      id: 102,
      title: "Backend Developer",
      description: "Node.js developer required for scalable APIs.",
      experienceRequired: "2+ years",
      educationRequired: "B.E / MCA",
      skillsRequired: ["Node.js", "MongoDB", "Express"],
      postedOn: "2025-01-08",
      status: "Open",
      applicants: [],
    },
  ];

  useEffect(() => {
    const storedJobs: Job[] = JSON.parse(
      localStorage.getItem("startup_jobs") || "[]"
    );

    const mergedJobs = [
      ...hardcodedJobs,
      ...storedJobs.filter(
        (stored) => !hardcodedJobs.some((hard) => hard.id === stored.id)
      ),
    ];

    setJobs(mergedJobs);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.skillsRequired.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  const handleStatusUpdate = (
    jobId: number,
    applicantId: number,
    newStatus: Applicant["status"]
  ) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id !== jobId) return j;

      const updatedApplicants = j.applicants.map((a) =>
        a.id === applicantId ? { ...a, status: newStatus } : a
      );

      return { ...j, applicants: updatedApplicants };
    });

    // Update state
    setJobs(updatedJobs);

    // Update selected job (dialog)
    if (selectedJob && selectedJob.id === jobId) {
      const updatedApplicants = selectedJob.applicants.map((a) =>
        a.id === applicantId ? { ...a, status: newStatus } : a
      );
      setSelectedJob({ ...selectedJob, applicants: updatedApplicants });
    }

    // Persist to localStorage
    localStorage.setItem("startup_jobs", JSON.stringify(updatedJobs));

    toast({
      title: "Status Updated",
      description: `Applicant is now ${newStatus}.`,
    });
  };

  const handleEditSave = () => {
    const updatedJobs = jobs.map((j) =>
      j.id === selectedJob.id ? selectedJob : j
    );

    setJobs(updatedJobs);
    localStorage.setItem("startup_jobs", JSON.stringify(updatedJobs));

    setEditJob(false);
    toast({ title: "Updated", description: "Job card updated." });
  };

  const toggleSkill = (skill) => {
    const isSelected = selectedJob.skillsRequired.includes(skill);
    const updatedSkills = isSelected
      ? selectedJob.skillsRequired.filter((s) => s !== skill) // Remove
      : [...selectedJob.skillsRequired, skill]; // Add

    setSelectedJob({ ...selectedJob, skillsRequired: updatedSkills });
  };

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-accent" /> Posted Jobs
          </h1>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or skills..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* One container for ALL cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="flex flex-col border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">
                    {job.title}
                  </CardTitle>
                  {/* Status Badge */}
                  <Badge
                    variant="outline"
                    className={
                      job.status === "Open"
                        ? "bg-teal-500 text-white border-teal-200"
                        : ""
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.description}
                </p>

                {/* Skills - These will update live when you toggle them in Edit Job */}
                <div className="flex flex-wrap gap-1.5">
                  {job.skillsRequired.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-[10px] uppercase"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-accent" />
                  <span
                    className={
                      job.applicants.length > 0
                        ? "font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {job.applicants.length}{" "}
                    {job.applicants.length === 1 ? "Applicant" : "Applicants"}
                  </span>
                </div>

                {/* Action Buttons - No <hr /> lines here */}
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedJob(job);
                      setViewApplicants(true);
                    }}
                  >
                    Applicants
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedJob(job);
                      setEditJob(true);
                    }}
                  >
                    Edit Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Applicants Dialog */}
        <Dialog open={viewApplicants} onOpenChange={setViewApplicants}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mt-4">
              {selectedJob?.applicants.length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                  No applicants yet.
                </p>
              )}
              {selectedJob?.applicants.map((a) => (
                <Card
                  key={a.id}
                  className="bg-muted/30 border-none shadow-none"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          {a.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.email}
                        </p>
                        <p className="text-[10px] mt-1 italic">
                          Applied on {a.appliedOn}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            a.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {a.status}
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  selectedJob.id,
                                  a.id,
                                  "Pending"
                                )
                              }
                            >
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  selectedJob.id,
                                  a.id,
                                  "Shortlisted"
                                )
                              }
                            >
                              Shortlisted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  selectedJob.id,
                                  a.id,
                                  "Rejected"
                                )
                              }
                            >
                              Rejected
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Job Dialog */}
        <Dialog open={editJob} onOpenChange={setEditJob}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Job Details</DialogTitle>
            </DialogHeader>

            {selectedJob && (
              <form
                className="space-y-4 pt-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  {/* <Input defaultValue={selectedJob.title} /> */}
                  <Input
                    value={selectedJob.title}
                    onChange={(e) =>
                      setSelectedJob({ ...selectedJob, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  {/* <Textarea defaultValue={selectedJob.description} className="min-h-[100px]" /> */}

                  <Textarea
                    value={selectedJob.description}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        description: e.target.value,
                      })
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Skills Required (Click to add/remove)
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-3 p-3 border rounded-lg bg-muted/20">
                    {skillsList.map((skill) => {
                      const isSelected =
                        selectedJob.skillsRequired.includes(skill);
                      return (
                        <Badge
                          key={skill}
                          variant={isSelected ? "accent" : "outline"}
                          className="cursor-pointer select-none"
                          onClick={() => {
                            const updated = isSelected
                              ? selectedJob.skillsRequired.filter(
                                  (s) => s !== skill
                                )
                              : [...selectedJob.skillsRequired, skill];
                            setSelectedJob({
                              ...selectedJob,
                              skillsRequired: updated,
                            });
                          }}
                        >
                          {skill} {isSelected ? "×" : "+"}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full gap-2 mt-4"
                  variant="hero"
                  onClick={handleEditSave}
                >
                  <CheckCircle className="h-4 w-4" /> Save Changes
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StartupLayout>
  );
}
