import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { Check, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<any[]>("/startupProfiles");
      if (response.success && response.data) {
        setStartups(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch startups:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyStartup = async (id: string, status: boolean) => {
      // Logic for verifying startup would go here
      // Currently the backend might need an update to handle verification status toggle
      toast({
          title: status ? "Verified" : "Unverified",
          description: `Startup has been ${status ? "verified" : "unverified"}`
      })
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Startups Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage specific startup profiles
          </p>
        </div>

        <div className="border rounded-lg bg-card bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Team Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : startups.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No startups found.</TableCell>
                </TableRow>
              ) : (
                startups.map((startup) => (
                  <TableRow key={startup._id}>
                    <TableCell className="font-medium">{startup.startupName}</TableCell>
                    <TableCell>{startup.industry}</TableCell>
                    <TableCell>{startup.teamSize || "N/A"}</TableCell>
                    <TableCell>
                      {startup.verified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Verified</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="icon" onClick={() => verifyStartup(startup._id, !startup.verified)}>
                             {startup.verified ? <X className="h-4 w-4 text-destructive" /> : <Check className="h-4 w-4 text-green-600" />}
                         </Button>
                         <Button variant="ghost" size="icon">
                             <Eye className="h-4 w-4" />
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
