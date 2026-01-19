import { useState } from "react";
import {
  Mail,
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle,
  Loader2,
  Briefcase,
} from "lucide-react";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */

type Status =
  | "SELECTED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED";

interface Application {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: Status;
}

/* ---------------- MOCK DATA ---------------- */

const applications: Application[] = [
  {
    id: "1",
    name: "Amit Sharma",
    email: "amit@gmail.com",
    jobTitle: "Frontend Developer",
    status: "SELECTED",
  },
  {
    id: "2",
    name: "Neha Patil",
    email: "neha@gmail.com",
    jobTitle: "Backend Engineer",
    status: "SELECTED",
  },
  {
    id: "3",
    name: "Rahul Verma",
    email: "rahul@gmail.com",
    jobTitle: "UI/UX Designer",
    status: "SHORTLISTED",
  },
];

/* ---------------- PAGE ---------------- */

export default function StartupUpdates() {
  /* ---------- Selected Candidates ---------- */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emailModal, setEmailModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  


  const selectedCandidates = applications.filter(
    (a) => a.status === "SELECTED"
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const sendSelectionEmail = async () => {
    setSending(true);

    // Simulated API delay
    setTimeout(() => {
      setSending(false);
      setEmailModal(false);
      setSelectedIds([]);
      toast({
        title: "Emails Sent",
        description: `Selection emails sent to ${selectedIds.length} candidates.`,
      });
    }, 1500);
  };

  /* ---------- Interview Schedule ---------- */
  const [schedule, setSchedule] = useState({
    applicationId: "",
    date: "",
    time: "",
    mode: "Online",
    link: "",
    interviewer: "",
    notes: "",
  });

  const shortlisted = applications.filter(
    (a) => a.status === "SHORTLISTED"
  );

  const scheduleInterview = () => {
    toast({
      title: "Interview Scheduled",
      description: "Interview email has been sent to the candidate.",
    });

    setSchedule({
      applicationId: "",
      date: "",
      time: "",
      mode: "Online",
      link: "",
      interviewer: "",
      notes: "",
    });
  };

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold flex items-center gap-3">
  <Mail className="h-8 w-8 text-accent" />
  Updates
</h1>


        {/* ================= SELECTED CANDIDATES ================= */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-accent" />
              Selected Candidates
            </CardTitle>

            <Button
              disabled={selectedIds.length === 0}
              onClick={() => setEmailModal(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Selection Email
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {selectedCandidates.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.includes(c.id)}
                    onCheckedChange={() => toggleSelect(c.id)}
                  />
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.jobTitle}
                    </p>
                  </div>
                </div>
                <Badge variant="accent">SELECTED</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ================= INTERVIEW SCHEDULE ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-accent" />
              Interview Schedule
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Candidate</Label>
                <Select
                  value={schedule.applicationId}
                  onValueChange={(v) =>
                    setSchedule({ ...schedule, applicationId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {shortlisted.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} — {a.jobTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Interview Mode</Label>
                <Select
                  value={schedule.mode}
                  onValueChange={(v) =>
                    setSchedule({ ...schedule, mode: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="In-person">In-person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={schedule.date}
                  onChange={(e) =>
                    setSchedule({ ...schedule, date: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={schedule.time}
                  onChange={(e) =>
                    setSchedule({ ...schedule, time: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Interview Link / Location</Label>
                <Input
                  placeholder="Google Meet / Office address"
                  value={schedule.link}
                  onChange={(e) =>
                    setSchedule({ ...schedule, link: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Interviewer</Label>
                <Input
                  placeholder="Name of interviewer"
                  value={schedule.interviewer}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      interviewer: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional instructions"
                  value={schedule.notes}
                  onChange={(e) =>
                    setSchedule({ ...schedule, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              className="w-full mt-4"
              onClick={scheduleInterview}
              disabled={!schedule.applicationId}
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </CardContent>
        </Card>

        {/* ================= EMAIL MODAL ================= */}
        <Dialog open={emailModal} onOpenChange={setEmailModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Selection Email</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                placeholder="Email message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />

              <Button
                className="w-full"
                onClick={sendSelectionEmail}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Confirm & Send"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StartupLayout>
  );
}
