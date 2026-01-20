import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { InterviewCalendar, Interview } from "@/components/startup/InterviewCalendar";
import { InterviewDetailPanel } from "@/components/startup/InterviewDetailPanel";

// Mock data for interviews
const mockInterviews: Interview[] = [
  {
    id: "1",
    candidateName: "John Doe",
    candidateEmail: "john.doe@email.com",
    jobTitle: "Frontend Developer",
    jobId: "job-1",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    mode: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewer: "Sarah Johnson",
    stage: "technical",
    status: "scheduled",
    notes: "Focus on React and TypeScript skills. Prepare coding exercise.",
  },
  {
    id: "2",
    candidateName: "Jane Smith",
    candidateEmail: "jane.smith@email.com",
    jobTitle: "Backend Developer",
    jobId: "job-2",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    mode: "offline",
    location: "Office - Meeting Room 3",
    interviewer: "Mike Chen",
    stage: "hr",
    status: "scheduled",
    notes: "Discuss salary expectations and work culture fit.",
  },
  {
    id: "3",
    candidateName: "Alex Johnson",
    candidateEmail: "alex.j@email.com",
    jobTitle: "Frontend Developer",
    jobId: "job-1",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    time: "11:00",
    mode: "online",
    meetingLink: "https://zoom.us/j/123456789",
    interviewer: "Sarah Johnson",
    stage: "screening",
    status: "scheduled",
  },
  {
    id: "4",
    candidateName: "Emily Brown",
    candidateEmail: "emily.b@email.com",
    jobTitle: "UI/UX Designer",
    jobId: "job-3",
    date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // Day after tomorrow
    time: "15:00",
    mode: "online",
    meetingLink: "https://meet.google.com/xyz-uvwx-rst",
    interviewer: "Lisa Park",
    stage: "final",
    status: "scheduled",
    notes: "Portfolio review and design challenge discussion.",
  },
  {
    id: "5",
    candidateName: "Michael Lee",
    candidateEmail: "michael.lee@email.com",
    jobTitle: "Backend Developer",
    jobId: "job-2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    time: "09:00",
    mode: "offline",
    location: "Office - Conference Room A",
    interviewer: "Mike Chen",
    stage: "technical",
    status: "completed",
  },
  {
    id: "6",
    candidateName: "Sarah Wilson",
    candidateEmail: "sarah.w@email.com",
    jobTitle: "Frontend Developer",
    jobId: "job-1",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], // 2 days ago
    time: "16:00",
    mode: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewer: "Sarah Johnson",
    stage: "screening",
    status: "no-show",
  },
  {
    id: "7",
    candidateName: "David Kim",
    candidateEmail: "david.kim@email.com",
    jobTitle: "UI/UX Designer",
    jobId: "job-3",
    date: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0], // 5 days from now
    time: "10:30",
    mode: "online",
    meetingLink: "https://zoom.us/j/987654321",
    interviewer: "Lisa Park",
    stage: "technical",
    status: "scheduled",
  },
  {
    id: "8",
    candidateName: "Rachel Green",
    candidateEmail: "rachel.g@email.com",
    jobTitle: "Frontend Developer",
    jobId: "job-1",
    date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0], // 1 week from now
    time: "14:30",
    mode: "offline",
    location: "Office - Meeting Room 2",
    interviewer: "Sarah Johnson",
    stage: "final",
    status: "scheduled",
    notes: "Final round with CTO. Discuss team dynamics and growth opportunities.",
  },
];

export default function InterviewCalendarPage() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setDetailPanelOpen(true);
  };

  const handleStatusChange = (interviewId: string, status: Interview["status"]) => {
    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === interviewId ? { ...interview, status } : interview
      )
    );
    if (selectedInterview?.id === interviewId) {
      setSelectedInterview((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <StartupLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Interview Calendar</h1>
              <p className="text-muted-foreground">
                View and manage all scheduled interviews
              </p>
            </div>
          </div>
        </div>

        {/* Interview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Today's Interviews</p>
            <p className="text-2xl font-bold text-accent">
              {interviews.filter((i) => i.date === new Date().toISOString().split("T")[0]).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">
              {interviews.filter((i) => {
                const date = new Date(i.date);
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);
                return date >= weekStart && date < weekEnd;
              }).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-success">
              {interviews.filter((i) => i.status === "completed").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">No Shows</p>
            <p className="text-2xl font-bold text-destructive">
              {interviews.filter((i) => i.status === "no-show").length}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <InterviewCalendar
          interviews={interviews}
          onInterviewClick={handleInterviewClick}
        />

        {/* Detail Panel */}
        <InterviewDetailPanel
          interview={selectedInterview}
          open={detailPanelOpen}
          onOpenChange={setDetailPanelOpen}
          onStatusChange={handleStatusChange}
        />
      </div>
    </StartupLayout>
  );
}
