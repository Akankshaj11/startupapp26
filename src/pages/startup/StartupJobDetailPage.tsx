import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Users,
  BarChart3,
  Building2,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import { startupJobService, Job, JobSummary } from "@/services/startupJobService";
import { toast } from "sonner";

export default function StartupJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summary, setSummary] = useState<JobSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string) => {
    setIsLoading(true);
    const result = await startupJobService.getJobById(jobId);
    if (result.success && result.data) {
      setJob(result.data);
    } else {
      toast.error(result.error || "Failed to load job details");
    }
    setIsLoading(false);
  };

  const fetchSummary = async () => {
    if (!id) return;
    setIsSummaryLoading(true);
    setSummaryModalOpen(true);
    const result = await startupJobService.getJobSummary(id);
    if (result.success && result.data) {
      setSummary(result.data);
    } else {
      toast.error(result.error || "Failed to load job summary");
    }
    setIsSummaryLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <StartupLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card className="bg-card border-border">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </StartupLayout>
    );
  }

  if (!job) {
    return (
      <StartupLayout>
        <div className="p-6 lg:p-8">
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Job not found</h3>
              <p className="text-muted-foreground text-center mt-2">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/startup/jobs" className="mt-4">
                <Button variant="outline">Back to Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </StartupLayout>
    );
  }

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Back Button */}
        <Link to="/startup/jobs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {job.title}
                  </CardTitle>
                  <Badge variant={job.status === "active" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {job.startup?.companyName && (
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.startup.companyName}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={fetchSummary}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Summary
                </Button>
                <Link to={`/startup/applicants?jobId=${job._id}`}>
                  <Button variant="hero">
                    <Users className="h-4 w-4 mr-2" />
                    View Applicants
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Details */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired?.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {(!job.skillsRequired || job.skillsRequired.length === 0) && (
                    <p className="text-muted-foreground">No specific skills listed</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Experience</p>
                    <p className="text-sm text-muted-foreground">
                      {job.experienceRequired || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Education</p>
                    <p className="text-sm text-muted-foreground">
                      {job.educationRequired || "Not specified"}
                    </p>
                  </div>
                </div>
                {job.type && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Job Type</p>
                      <p className="text-sm text-muted-foreground">{job.type}</p>
                    </div>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Salary</p>
                      <p className="text-sm text-muted-foreground">{job.salary}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {job.applicationsCount !== undefined && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {job.applicationsCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Applicants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Job Summary Modal */}
        <Dialog open={summaryModalOpen} onOpenChange={setSummaryModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Job Summary</DialogTitle>
            </DialogHeader>
            {isSummaryLoading ? (
              <div className="space-y-4 py-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : summary ? (
              <div className="grid grid-cols-2 gap-4 py-4">
                <Card className="bg-muted/50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Total Applications</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {summary.totalApplications}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Meeting Criteria</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {summary.percentageMeetingCriteria}%
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Average ATS Score</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {summary.averageATS}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Median Experience</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {summary.medianExperience} yrs
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="py-8 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No summary data available</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StartupLayout>
  );
}
