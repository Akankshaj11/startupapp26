import { useEffect, useState } from "react";
import { Mail, User, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { toast } from "@/hooks/use-toast";

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
  status: ApplicantStatus;
}

/* ---------------- HARDCODED DATA ---------------- */

const selectedCandidates: Applicant[] = [
  {
    id: "1",
    jobId: 101,
    name: "Neha Patil",
    email: "neha@gmail.com",
    role: "Frontend Developer",
    status: "Selected",
  },
  {
    id: "2",
    jobId: 102,
    name: "Priya Kulkarni",
    email: "priya@gmail.com",
    role: "Backend Developer",
    status: "Selected",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function Selected() {
  const [selected, setSelected] = useState<Applicant[]>([]);

  /* Email modal state */
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  /* Load selected candidates */
  useEffect(() => {
    setSelected(selectedCandidates);
  }, []);

  /* Open email modal */
  const openEmailModal = (candidate: Applicant) => {
    setEmailData({
      to: candidate.email,
      subject: "",
      message: "",
    });
    setIsEmailModalOpen(true);
  };

  /* Send email */
  const sendSelectionEmail = () => {
    toast({
      title: "Selection Email Sent",
      description: `Selection email sent to ${emailData.to}`,
    });
    setIsEmailModalOpen(false);
  };

  return (
    <StartupLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Selected Candidates</h1>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selected.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {c.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p>Email: {c.email}</p>
                <p>Role: {c.role}</p>

                <Button
                  className="w-full mt-3 bg-teal-500 hover:bg-teal-600"
                  onClick={() => openEmailModal(c)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Selection Email
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* -------- EMAIL MODAL -------- */}
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
                  Send Selection Email
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
                    placeholder="Offer Letter – Congratulations!"
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
                    rows={6}
                    placeholder="Email message"
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData({ ...emailData, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  className="w-full bg-teal-500 hover:bg-teal-600"
                  disabled={!emailData.subject || !emailData.message}
                  onClick={sendSelectionEmail}
                >
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
