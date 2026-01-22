import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  GraduationCap,
  Layers,
  Download,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ---------------- TYPES ---------------- */

interface TrendPoint {
  day: string;
  count: number;
}

interface DistributionItem {
  key: string;
  count: number;
}

/* ---------------- MOCK API DATA ---------------- */

// Simulates /get-job-post-day-wise-trend (summary endpoint)
const trendData: TrendPoint[] = [
  { day: "2024-01-15", count: 4 },
  { day: "2024-01-16", count: 8 },
  { day: "2024-01-17", count: 6 },
  { day: "2024-01-18", count: 12 },
  { day: "2024-01-19", count: 9 },
  { day: "2024-01-20", count: 15 },
  { day: "2024-01-21", count: 11 },
];

// Simulates /get-job-post-education (by degree)
const educationByDegree: DistributionItem[] = [
  { key: "B.Tech", count: 24 },
  { key: "M.Tech", count: 12 },
  { key: "BCA", count: 15 },
  { key: "MCA", count: 8 },
  { key: "BSc CS", count: 6 },
];

// Simulates /get-job-post-education (by college)
const educationByCollege: DistributionItem[] = [
  { key: "IIT Delhi", count: 18 },
  { key: "NIT Trichy", count: 14 },
  { key: "BITS Pilani", count: 12 },
  { key: "VIT", count: 10 },
  { key: "Other", count: 11 },
];

// Simulates /get-job-post-education (by graduationYear)
const educationByYear: DistributionItem[] = [
  { key: "2024", count: 28 },
  { key: "2023", count: 22 },
  { key: "2022", count: 10 },
  { key: "2021", count: 5 },
];

// Simulates /get-main-skills
const skillsData: DistributionItem[] = [
  { key: "React", count: 22 },
  { key: "Node.js", count: 18 },
  { key: "Python", count: 15 },
  { key: "TypeScript", count: 14 },
  { key: "MongoDB", count: 12 },
  { key: "Docker", count: 9 },
  { key: "AWS", count: 7 },
  { key: "SQL", count: 6 },
];

const CHART_COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--chart-3, 197 37% 24%))",
  "hsl(var(--chart-4, 43 74% 66%))",
  "hsl(var(--chart-5, 27 87% 67%))",
  "hsl(var(--muted-foreground))",
];

const mockJobs = [
  { id: "all", title: "All Jobs" },
  { id: "1", title: "Frontend Developer" },
  { id: "2", title: "Backend Engineer" },
  { id: "3", title: "Full Stack Developer" },
];

/* ---------------- PAGE ---------------- */

export default function JobAnalysisPage() {
  const [educationBy, setEducationBy] = useState<"degree" | "college" | "graduationYear">("degree");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Get education data based on selected filter
  const getEducationData = () => {
    switch (educationBy) {
      case "college":
        return educationByCollege;
      case "graduationYear":
        return educationByYear;
      default:
        return educationByDegree;
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate totals
  const totalApplications = trendData.reduce((sum, d) => sum + d.count, 0);
  const avgPerDay = Math.round(totalApplications / trendData.length);
  const peakDay = trendData.reduce((max, d) => (d.count > max.count ? d : max), trendData[0]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // fetch(`/api/startup/graphical-job-analysis/summary`)
    // fetch(`/api/startup/graphical-job-analysis/educational-distribution?by=${educationBy}&jobId=${selectedJob}`)
    // fetch(`/api/startup/graphical-job-analysis/skill-distribution?jobId=${selectedJob}`)
  }, [educationBy, selectedJob]);

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-accent" />
              Job Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Insights and analytics for your job postings
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select Job" />
              </SelectTrigger>
              <SelectContent>
                {mockJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications (7d)</p>
                  <p className="text-3xl font-bold">{totalApplications}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Per Day</p>
                  <p className="text-3xl font-bold">{avgPerDay}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Peak Day</p>
                  <p className="text-3xl font-bold">{peakDay.count}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(peakDay.day)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* APPLICATION TREND CHART */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Application Trend – Last 7 Days
            </CardTitle>
            <CardDescription>Day-wise application submissions</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData.map(d => ({ ...d, day: formatDate(d.day) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(var(--accent))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* DISTRIBUTION CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* EDUCATION DISTRIBUTION */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Education Distribution
                </CardTitle>
                <CardDescription>Applicants by education background</CardDescription>
              </div>

              <Select value={educationBy} onValueChange={(v) => setEducationBy(v as typeof educationBy)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">By Degree</SelectItem>
                  <SelectItem value="college">By College</SelectItem>
                  <SelectItem value="graduationYear">By Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="bar" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                </TabsList>

                <TabsContent value="bar">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getEducationData()} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis 
                          dataKey="key" 
                          type="category" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          width={80}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="pie">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getEducationData()}
                          dataKey="count"
                          nameKey="key"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ key, percent }) => `${key}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {getEducationData().map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* SKILLS DISTRIBUTION */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent" />
                Top Skills Distribution
              </CardTitle>
              <CardDescription>Most common skills among applicants</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="key" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {skillsData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Skills Legend */}
              <div className="mt-4 flex flex-wrap gap-2">
                {skillsData.slice(0, 5).map((skill) => (
                  <Badge key={skill.key} variant="outline" className="text-xs">
                    {skill.key}: {skill.count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* UX NOTE */}
        <p className="text-xs text-muted-foreground text-center">
          Showing analytics for {selectedJob === "all" ? "all jobs" : mockJobs.find(j => j.id === selectedJob)?.title}. 
          Use filters or export for detailed reports.
        </p>
      </div>
    </StartupLayout>
  );
}
