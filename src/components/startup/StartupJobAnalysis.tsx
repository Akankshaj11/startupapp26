import { useEffect, useState } from "react";
import {
  BarChart3,
  LineChart,
  GraduationCap,
  Layers,
  Download,
} from "lucide-react";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */

interface TrendPoint {
  date: string;
  count: number;
}

interface DistributionItem {
  label: string;
  value: number;
}

/* ---------------- MOCK API DATA ---------------- */

const trendData: TrendPoint[] = [
  { date: "10 Jan", count: 2 },
  { date: "11 Jan", count: 5 },
  { date: "12 Jan", count: 3 },
  { date: "13 Jan", count: 7 },
  { date: "14 Jan", count: 4 },
];

const educationData: DistributionItem[] = [
  { label: "B.Tech", value: 18 },
  { label: "M.Tech", value: 6 },
  { label: "BCA", value: 9 },
  { label: "MCA", value: 5 },
];

const skillsData: DistributionItem[] = [
  { label: "React", value: 15 },
  { label: "Node.js", value: 11 },
  { label: "MongoDB", value: 8 },
  { label: "Docker", value: 6 },
];

/* ---------------- PAGE ---------------- */

export default function StartupJobAnalysis() {
  const [educationBy, setEducationBy] = useState<"degree" | "college" | "graduationYear">("degree");
  const [selectedJob, setSelectedJob] = useState<string>("all");

  useEffect(() => {
    // Later: fetch(`/get-job-post-day-wise-trend`)
    // Later: fetch(`/get-job-post-education?by=${educationBy}&jobId=${selectedJob}`)
    // Later: fetch(`/get-main-skills?jobId=${selectedJob}`)
  }, [educationBy, selectedJob]);

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-accent" />
            Job Analysis
          </h1>

          <div className="flex gap-3">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="1">Frontend Developer</SelectItem>
                <SelectItem value="2">Backend Engineer</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* ================= LINE TREND ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-accent" />
              Applications – Last 7 Days
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-end gap-4 h-40">
              {trendData.map((p) => (
                <div key={p.date} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 rounded-md bg-accent/80"
                    style={{ height: `${p.count * 20}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ================= DISTRIBUTIONS ================= */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* EDUCATION */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Education Distribution
              </CardTitle>

              <Select value={educationBy} onValueChange={(v) => setEducationBy(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">By Degree</SelectItem>
                  <SelectItem value="college">By College</SelectItem>
                  <SelectItem value="graduationYear">By Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent className="space-y-3">
              {educationData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Badge variant="outline">{item.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SKILLS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent" />
                Skills Distribution
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {skillsData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* UX NOTE */}
        <p className="text-xs text-muted-foreground">
          Showing top results. Use filters or export for detailed data.
        </p>
      </div>
    </StartupLayout>
  );
}
