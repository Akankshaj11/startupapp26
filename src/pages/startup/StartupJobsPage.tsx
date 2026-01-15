import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Filter,
  Plus,
} from "lucide-react";
import { startupJobService, Job } from "@/services/startupJobService";
import { toast } from "sonner";

const industries = [
  "All Industries",
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "Design",
];

const experienceLevels = [
  "All Experience",
  "Entry Level",
  "1-2 years",
  "3-5 years",
  "5+ years",
];

const ITEMS_PER_PAGE = 6;

export default function StartupJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedExperience, setSelectedExperience] = useState("All Experience");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    const result = await startupJobService.getAllJobs();
    if (result.success && result.data) {
      setJobs(result.data);
    } else {
      toast.error(result.error || "Failed to load jobs");
    }
    setIsLoading(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.startup?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry =
      selectedIndustry === "All Industries" ||
      job.industry === selectedIndustry ||
      job.startup?.industry === selectedIndustry;
    const matchesExperience =
      selectedExperience === "All Experience" ||
      job.experienceRequired?.includes(selectedExperience.replace(" years", ""));
    return matchesSearch && matchesIndustry && matchesExperience;
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Job Posts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all your job postings
            </p>
          </div>
          <Link to="/startup/jobs/create">
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title or company..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className={`flex gap-4 ${showFilters ? "flex" : "hidden md:flex"}`}>
                <Select
                  value={selectedIndustry}
                  onValueChange={(value) => {
                    setSelectedIndustry(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedExperience}
                  onValueChange={(value) => {
                    setSelectedExperience(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
              <p className="text-muted-foreground text-center mt-2">
                {searchQuery || selectedIndustry !== "All Industries" || selectedExperience !== "All Experience"
                  ? "Try adjusting your filters or search query"
                  : "Start by posting your first job"}
              </p>
              <Link to="/startup/jobs/create" className="mt-4">
                <Button variant="hero" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post a Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedJobs.map((job) => (
                <Link key={job._id} to={`/startup/jobs/${job._id}`}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                            {job.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {job.startup?.companyName || "Your Company"}
                          </p>
                        </div>
                        <Badge
                          variant={job.status === "active" ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skillsRequired?.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skillsRequired?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skillsRequired.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                        {job.applicationsCount !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{job.applicationsCount} applicants</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </StartupLayout>
  );
}
