import { useState, useEffect, ChangeEvent } from "react";
import {
  Building,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Users,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";
import { useAuth } from "@/contexts/AuthContext";

interface EditStartupProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const industries = [
  "FinTech", "EdTech", "HealthTech", "AI/ML", "SaaS", "E-Commerce", "Web3", "Other"
] as const;

const stages = ["Idea", "MVP", "Early Traction", "Growth", "Scaling"] as const;

type Industry = typeof industries[number];
type Stage = typeof stages[number];

interface StartupFormData {
  _id: string;
  startupName: string;
  tagline: string;
  aboutus: string;
  productOrService: string;
  cultureAndValues: string;
  industry: Industry;
  stage: Stage;
  website: string;
  linkedin: string;
  twitter: string;
  github: string;
  foundedYear: string;
  teamSize: string;
  numberOfEmployees: string;
  city: string;
  country: string;
  hiring: boolean;
  leadershipTeam: Array<{ user: string; role: string }>;
}

export function EditStartupProfileModal({ open, onOpenChange }: EditStartupProfileModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<StartupFormData>({
    _id: "",
    startupName: "",
    tagline: "",
    aboutus: "",
    productOrService: "",
    cultureAndValues: "",
    industry: "FinTech",
    stage: "MVP",
    website: "",
    linkedin: "",
    twitter: "",
    github: "",
    foundedYear: "2023",
    teamSize: "1",
    numberOfEmployees: "1",
    city: "",
    country: "",
    hiring: true,
    leadershipTeam: [{ user: "", role: "" }],
  });

  const handleLeaderChange = (index: number, key: "user" | "role", value: string) => {
    setFormData((prev) => ({
      ...prev,
      leadershipTeam: prev.leadershipTeam.map((member, idx) =>
        idx === index ? { ...member, [key]: value } : member
      ),
    }));
  };

  const addLeader = () => {
    setFormData((prev) => ({
      ...prev,
      leadershipTeam: [...prev.leadershipTeam, { user: "", role: "" }],
    }));
  };

  const removeLeader = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      leadershipTeam: prev.leadershipTeam.filter((_, idx) => idx !== index),
    }));
  };

  // Fetch existing profile when modal opens
  useEffect(() => {
    if (open) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const result = await startupProfileService.getMyProfile();
          if (result.success && result.data) {
            const profile = result.data;
            const socialLinks = profile.socialLinks || {};
            const rawLocation = profile.location as { city?: string; country?: string } | string | undefined;
            let city = "";
            let country = "";

            if (rawLocation && typeof rawLocation === "object") {
              city = rawLocation.city || "";
              country = rawLocation.country || "";
            } else if (typeof rawLocation === "string") {
              const parts = rawLocation.split(",").map((part) => part.trim());
              city = parts[0] || "";
              country = parts[1] || "";
            }

            setFormData({
              _id: profile._id,
              startupName: profile.startupName || "",
              tagline: profile.tagline || "",
              aboutus: profile.aboutus || "",
              productOrService: profile.productOrService || "",
              cultureAndValues: profile.cultureAndValues || "",
              industry: (profile.industry as Industry) || "FinTech",
              stage: (profile.stage as Stage) || "MVP",
              website: profile.website || "",
              linkedin: socialLinks.linkedin || "",
              twitter: socialLinks.twitter || "",
              github: socialLinks.github || "",
              foundedYear: profile.foundedYear ? String(profile.foundedYear) : "2023",
              teamSize: profile.teamSize ? String(profile.teamSize) : "1",
              numberOfEmployees: profile.numberOfEmployees ? String(profile.numberOfEmployees) : "1",
              city,
              country,
              hiring: profile.hiring || false,
              leadershipTeam: profile.leadershipTeam?.length
                ? profile.leadershipTeam.map((member) => ({
                    user: member.user ? String(member.user) : "",
                    role: member.role || "",
                  }))
                : [{ user: "", role: "" }],
            });
          }
        } catch (error) {
          console.error("Failed to fetch startup profile:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const toNumber = (value: string) => (value ? Number(value) : undefined);

      const updateData = {
        startupName: formData.startupName,
        tagline: formData.tagline,
        aboutus: formData.aboutus,
        productOrService: formData.productOrService,
        cultureAndValues: formData.cultureAndValues,
        industry: formData.industry,
        stage: formData.stage,
        website: formData.website,
        socialLinks: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          github: formData.github,
        },
        foundedYear: toNumber(formData.foundedYear),
        teamSize: toNumber(formData.teamSize),
        numberOfEmployees: toNumber(formData.numberOfEmployees),
        location: {
          city: formData.city || undefined,
          country: formData.country || undefined,
        },
        hiring: formData.hiring,
        leadershipTeam: formData.leadershipTeam
          .map((member) => ({
            user: member.user.trim() || undefined,
            role: member.role.trim() || undefined,
          }))
          .filter((member) => member.user || member.role),
      };

      let result;
      if (formData._id) {
        result = await startupProfileService.updateProfile(formData._id, updateData);
      } else {
        result = await startupProfileService.createProfile({
          userId: user?._id || "",
          ...updateData,
        });
      }

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your startup profile has been saved.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="h-5 w-5 text-accent" />
            Edit Startup Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Startup Name <span className="text-destructive">*</span></Label>
              <Input
                name="startupName"
                value={formData.startupName}
                onChange={handleChange}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label>About Us</Label>
            <Textarea
              name="aboutus"
              value={formData.aboutus}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about your startup..."
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Product or Service</Label>
            <Textarea
              name="productOrService"
              value={formData.productOrService}
              onChange={handleChange}
              rows={3}
              placeholder="What do you build or provide?"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Culture and Values</Label>
            <Textarea
              name="cultureAndValues"
              value={formData.cultureAndValues}
              onChange={handleChange}
              rows={3}
              placeholder="Share your team culture and values"
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value: Industry) => setFormData((prev) => ({ ...prev, industry: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value: Stage) => setFormData((prev) => ({ ...prev, stage: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((st) => (
                    <SelectItem key={st} value={st}>{st}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> Website
              </Label>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" /> LinkedIn
              </Label>
              <Input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Twitter className="h-3 w-3" /> Twitter
              </Label>
              <Input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Github className="h-3 w-3" /> GitHub
              </Label>
              <Input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Founded Year</Label>
              <Input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                min={1990}
                max={new Date().getFullYear()}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Users className="h-3 w-3" /> Team Size
              </Label>
              <Input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min={1}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Number of Employees</Label>
              <Input
                type="number"
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleChange}
                min={1}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="hiring"
              checked={formData.hiring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hiring: !!checked }))}
            />
            <Label htmlFor="hiring" className="cursor-pointer">Currently Hiring</Label>
          </div>

          <div>
            <Label>Leadership Team</Label>
            <div className="mt-2 space-y-4">
              {formData.leadershipTeam.map((member, index) => (
                <div key={`leader-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-3">
                    <Input
                      value={member.user}
                      onChange={(e) => handleLeaderChange(index, "user", e.target.value)}
                      placeholder="Leader User ID"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      value={member.role}
                      onChange={(e) => handleLeaderChange(index, "role", e.target.value)}
                      placeholder="Role (e.g., CEO)"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="md:col-span-5 flex justify-end">
                    {formData.leadershipTeam.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeLeader(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addLeader}>
                Add Leader
              </Button>
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full gap-2" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
