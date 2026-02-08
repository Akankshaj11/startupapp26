import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Check, X, Flag, MessageSquare, Briefcase, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data for Moderation
const flaggedJobs = [
  { id: 1, type: 'job', title: "Senior Developer", company: "TechScam Ltd", reason: "Suspicious salary range", reporter: "user123", date: "2024-03-15" },
  { id: 2, type: 'job', title: "Marketing Intern", company: "BrandNew", reason: "Inappropriate content", reporter: "user456", date: "2024-03-14" },
];

const flaggedPosts = [
  { id: 3, type: 'post', content: "Crypto scam link...", author: "crypto_king", reason: "Spam", reporter: "user789", date: "2024-03-15" },
  { id: 4, type: 'post', content: "Hate speech example...", author: "hater_1", reason: "Harassment", reporter: "user101", date: "2024-03-13" },
];

export default function AdminModerationPage() {
  const [jobs, setJobs] = useState(flaggedJobs);
  const [posts, setPosts] = useState(flaggedPosts);
  const { toast } = useToast();

  const handleAction = (id: number, type: 'job' | 'post', action: 'approve' | 'delete') => {
    // In a real app, this would make an API call
    if (type === 'job') {
      setJobs(jobs.filter(j => j.id !== id));
    } else {
      setPosts(posts.filter(p => p.id !== id));
    }

    toast({
      title: action === 'approve' ? "Content Approved" : "Content Removed",
      description: `The flagged ${type} has been ${action === 'approve' ? 'kept' : 'deleted'}.`,
      variant: action === 'approve' ? "default" : "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Moderation</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage flagged content across the platform
          </p>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="jobs">Flagged Jobs</TabsTrigger>
            <TabsTrigger value="posts">Flagged Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                  <Check className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p>No flagged jobs to review.</p>
                </div>
              ) : (
                jobs.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {item.reason}
                             </Badge>
                             <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">Company: <span className="font-medium text-foreground">{item.company}</span></p>
                          <p className="text-sm text-muted-foreground">Reported by: {item.reporter}</p>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto">
                          <Button 
                            variant="outline" 
                            className="flex-1 lg:flex-none text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAction(item.id, 'job', 'approve')}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Keep
                          </Button>
                          <Button 
                            variant="destructive"
                            className="flex-1 lg:flex-none"
                            onClick={() => handleAction(item.id, 'job', 'delete')}
                          >
                            <Trash2Icon className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                  <Check className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p>No flagged posts to review.</p>
                </div>
              ) : (
                posts.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                <Flag className="h-3 w-3 mr-1" />
                                {item.reason}
                             </Badge>
                             <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                          
                          <div className="bg-muted p-3 dashed border rounded-md">
                             <p className="italic text-muted-foreground">"{item.content}"</p>
                          </div>

                          <p className="text-sm text-muted-foreground">Author: <span className="font-medium text-foreground">{item.author}</span></p>
                          <p className="text-sm text-muted-foreground">Reported by: {item.reporter}</p>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto">
                          <Button 
                            variant="outline" 
                            className="flex-1 lg:flex-none text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAction(item.id, 'post', 'approve')}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Keep
                          </Button>
                          <Button 
                            variant="destructive"
                            className="flex-1 lg:flex-none"
                            onClick={() => handleAction(item.id, 'post', 'delete')}
                          >
                            <Trash2Icon className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function Trash2Icon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
      </svg>
    )
}
