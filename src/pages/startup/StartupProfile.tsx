import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Role = "STUDENT" | "STARTUP";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface StartupProfile {
  id: string;
  companyName: string;
  domain: string;
  location: string;
  jobsCount?: number;
}

interface StudentProfile {
  id: string;
  fullName: string;
  college: string;
  degree: string;
  graduationYear: number;
  applicationsCount?: number;
}

export default function StartupProfile() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<
    StartupProfile | StudentProfile | null
  >(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Users ---------------- */
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  /* ---------------- Fetch Profile ---------------- */
  const loadProfile = async (user: User) => {
    setSelectedUser(user);
    setLoading(true);
    setProfile(null);

    const endpoint =
      user.role === "STARTUP"
        ? `/startupProfile/${user.id}`
        : `/studentProfile/${user.id}`;

    const res = await fetch(endpoint);
    if (res.ok) {
      setProfile(await res.json());
    }

    setLoading(false);
  };

  /* ---------------- Filtered Users ---------------- */
  const filteredUsers =
    roleFilter === "ALL"
      ? users
      : users.filter((u) => u.role === roleFilter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Users & Profiles</h1>

      {/* ---------- Filter ---------- */}
      <div className="w-60">
        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="STARTUP">Startup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- Users List ---------- */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => loadProfile(user)}
                className="flex justify-between items-center p-3 rounded-md border cursor-pointer hover:bg-muted"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <Badge variant="outline">{user.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ---------- Profile Section ---------- */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>

          <CardContent>
            {!selectedUser && (
              <p className="text-muted-foreground">
                Select a user to view profile
              </p>
            )}

            {loading && <p>Loading profile...</p>}

            {selectedUser && !loading && !profile && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Profile not created yet
                </p>
                <Button>
                  Create {selectedUser.role.toLowerCase()} profile
                </Button>
              </div>
            )}

            {/* ---------- Startup Profile ---------- */}
            {"companyName" in (profile || {}) && (
              <div className="space-y-2">
                <p>
                  <strong>Company:</strong>{" "}
                  {(profile as StartupProfile).companyName}
                </p>
                <p>
                  <strong>Domain:</strong>{" "}
                  {(profile as StartupProfile).domain}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {(profile as StartupProfile).location}
                </p>
                <p>
                  <strong>Jobs Posted:</strong>{" "}
                  {(profile as StartupProfile).jobsCount ?? 0}
                </p>
              </div>
            )}

            {/* ---------- Student Profile ---------- */}
            {"college" in (profile || {}) && (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong>{" "}
                  {(profile as StudentProfile).fullName}
                </p>
                <p>
                  <strong>College:</strong>{" "}
                  {(profile as StudentProfile).college}
                </p>
                <p>
                  <strong>Degree:</strong>{" "}
                  {(profile as StudentProfile).degree}
                </p>
                <p>
                  <strong>Graduation Year:</strong>{" "}
                  {(profile as StudentProfile).graduationYear}
                </p>
                <p>
                  <strong>Applications:</strong>{" "}
                  {(profile as StudentProfile).applicationsCount ?? 0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
