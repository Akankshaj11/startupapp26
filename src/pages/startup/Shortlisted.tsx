import { useEffect, useState } from "react";
import { Calendar, Mail, User, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { toast } from "@/hooks/use-toast";

// Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Clock icon
import { Clock } from "lucide-react";

/* ---------------- TYPES ---------------- */

type ApplicantStatus =
  | "Applied"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

interface Applicant {
  id: string;
  jobId: number;
  name: string;
  email: string;
  role: string;
  appliedOn: string;
  skills: string[];
  experience: number;
  education: string;
  status: ApplicantStatus;
}

interface Job {
  id: number;
  title: string;
  applicants: Applicant[];
}

/* ---------------- HARDCODED JOBS ---------------- */

const hardcodedJobs: Job[] = [
  {
    id: 101,
    title: "Frontend Developer",
    applicants: [
      {
        id: "1",
        jobId: 101,
        name: "Neha Patil",
        email: "neha@gmail.com",
        role: "Frontend Developer",
        appliedOn: "2025-01-13",
        skills: ["React", "Tailwind", "JavaScript"],
        experience: 3,
        education: "B.Tech IT",
        status: "Shortlisted",
      },
      {
        id: "2",
        jobId: 101,
        name: "Rohit Kumar",
        email: "rohit@gmail.com",
        role: "Frontend Developer",
        appliedOn: "2025-01-14",
        skills: ["React", "CSS", "JavaScript"],
        experience: 2,
        education: "B.E Computer Engineering",
        status: "Applied",
      },
    ],
  },
  {
    id: 102,
    title: "Backend Developer",
    applicants: [
      {
        id: "3",
        jobId: 102,
        name: "Priya Kulkarni",
        email: "priya@gmail.com",
        role: "Backend Developer",
        appliedOn: "2025-01-15",
        skills: ["Node.js", "Express", "MongoDB"],
        experience: 3,
        education: "B.E Computer Engineering",
        status: "Shortlisted",
      },
    ],
  },
];

/* ---------------- COMPONENT ---------------- */

export default function Shortlisted() {
  const [shortlisted, setShortlisted] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState({
    applicationId: "",
    candidateName: "",
    date: "",
    time: "",
    mode: "Online",
    link: "",
    interviewer: "",
    notes: "",
  });

  /* -------- LOAD SHORTLISTED CANDIDATES -------- */
  useEffect(() => {
    const result: Applicant[] = [];
    hardcodedJobs.forEach((job) => {
      job.applicants.forEach((applicant) => {
        if (applicant.status === "Shortlisted") {
          result.push(applicant);
        }
      });
    });
    setShortlisted(result);
  }, []);

  const openScheduleModal = (applicant: Applicant) => {
    setSchedule({
      ...schedule,
      applicationId: applicant.id,
      candidateName: applicant.name, // set name
    });
    setIsModalOpen(true);
  };

  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const scheduleInterview = () => {
    toast({
      title: "Interview Scheduled",
      description: "Interview email has been sent to the candidate.",
    });
    setSchedule({
      applicationId: "",
      candidateName: "",
      date: "",
      time: "",
      mode: "Online",
      link: "",
      interviewer: "",
      notes: "",
    });
    setIsModalOpen(false);
  };

  const handleSendEmail = (applicant: Applicant) => {
    setEmailData({
      to: applicant.email, // auto-fill candidate email
      subject: "",
      message: "",
    });
    setIsEmailModalOpen(true);
  };

  /* -------- FILTERED CANDIDATES -------- */
  const filtered = shortlisted.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <StartupLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Shortlisted Candidates</h1>
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10"
          />
        </div>

        {/* CANDIDATE CARDS */}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">
            No shortlisted candidates found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {c.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>Email: {c.email}</p>
                  <p>Role: {c.role}</p>

                  {/* Buttons inside each card */}
                  <div className="flex gap-5 pt-2">
                    <Button
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-1"
                      onClick={() => openScheduleModal(c)}
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Interview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleSendEmail(c)}
                    >
                      <Mail className="h-4 w-4" />
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* -------- SCHEDULE INTERVIEW MODAL -------- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <Card className="w-full max-w-2xl relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-accent" />
                  Schedule Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-3 right-3 border-2 border-teal-500 text-teal-500 rounded-full p-1 flex items-center justify-center hover:bg-teal-50 focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <Label>Candidate</Label>

                    <Input value={schedule.candidateName} disabled />
                  </div>

                  <div>
                    <Label>Interview Mode</Label>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={schedule.mode}
                      onChange={(e) =>
                        setSchedule({ ...schedule, mode: e.target.value })
                      }
                    >
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                    </select>
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
                  disabled={
                    !schedule.applicationId || !schedule.date || !schedule.time
                  }
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* -------- SEND EMAIL MODAL -------- */}
        {isEmailModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-xl relative">
              {/* Close Button */}
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute top-2 right-2 border-2 border-teal-500 text-teal-500 rounded-full p-2 hover:bg-teal-50"
              >
                <X className="h-5 w-5" />
              </button>

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-teal-500" />
                  Send Email
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* To */}
                <div>
                  <Label>To</Label>
                  <Input value={emailData.to} disabled />
                </div>

                {/* Subject */}
                <div>
                  <Label>Subject</Label>
                  <Input
                    placeholder="Interview Invitation"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                  />
                </div>

                {/* Message */}
                <div>
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Email message..."
                    rows={6}
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData({ ...emailData, message: e.target.value })
                    }
                  />
                </div>

                {/* Send Button */}
                <Button
                  className="w-full bg-teal-500 hover:bg-teal-600"
                  disabled={!emailData.subject || !emailData.message}
                  onClick={() => {
                    toast({
                      title: "Email Sent",
                      description: `Email sent to ${emailData.to}`,
                    });
                    setIsEmailModalOpen(false);
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StartupLayout>
  );
}
