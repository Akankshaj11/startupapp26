import { useState, useEffect } from "react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<Notification[]>("/notifications");
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
        console.error("Error marking as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
        const response = await apiFetch("/notifications/read-all", { method: "PUT" });
        if(response.success){
            setNotifications(prev => prev.map(n => ({...n, read: true})));
            toast({
                title: "All cleared",
                description: "All notifications marked as read",
            });
        }
    } catch(error){
        console.error("failed to mark all as read");
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <StudentLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your job applications and profile activity.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No cancellations yet</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">
                  We'll notify you when there's an update on your applications or jobs.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification._id} 
                className={`transition-all hover:shadow-md ${!notification.read ? 'bg-accent/5 border-l-4 border-l-accent' : ''}`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-accent mt-2"></div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
