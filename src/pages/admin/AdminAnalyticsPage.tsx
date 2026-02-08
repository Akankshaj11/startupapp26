import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Users, Building2, Briefcase } from "lucide-react";

// Mock Data
const userGrowthData = [
  { name: "Jan", students: 400, startups: 24 },
  { name: "Feb", students: 800, startups: 48 },
  { name: "Mar", students: 1400, startups: 72 },
  { name: "Apr", students: 2100, startups: 96 },
  { name: "May", students: 2800, startups: 120 },
  { name: "Jun", students: 3500, startups: 145 },
];

const jobDomainData = [
  { name: "FinTech", value: 400 },
  { name: "EdTech", value: 300 },
  { name: "HealthTech", value: 300 },
  { name: "AI/ML", value: 600 },
  { name: "SaaS", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const activityData = [
  { name: "Mon", applications: 120, logins: 450 },
  { name: "Tue", applications: 132, logins: 480 },
  { name: "Wed", applications: 101, logins: 510 },
  { name: "Thu", applications: 134, logins: 490 },
  { name: "Fri", applications: 90, logins: 460 },
  { name: "Sat", applications: 45, logins: 300 },
  { name: "Sun", applications: 30, logins: 280 },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Detailed insights into platform growth and usage
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                      <Users className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <h3 className="text-2xl font-bold">14,245</h3>
                      <p className="text-xs text-green-600 flex items-center">
                          +12% from last month
                      </p>
                  </div>
              </CardContent>
           </Card>
           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                      <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-muted-foreground">Active Startups</p>
                      <h3 className="text-2xl font-bold">582</h3>
                      <p className="text-xs text-green-600 flex items-center">
                          +5% from last month
                      </p>
                  </div>
              </CardContent>
           </Card>
           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                      <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-muted-foreground">Jobs Posted</p>
                      <h3 className="text-2xl font-bold">2,103</h3>
                      <p className="text-xs text-green-600 flex items-center">
                          +18% from last month
                      </p>
                  </div>
              </CardContent>
           </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New student and startup registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorStartups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Area type="monotone" dataKey="students" stroke="#8884d8" fillOpacity={1} fill="url(#colorStudents)" name="Students" />
                    <Area type="monotone" dataKey="startups" stroke="#82ca9d" fillOpacity={1} fill="url(#colorStartups)" name="Startups" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Daily login and application volumes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="logins" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Logins" />
                    <Bar dataKey="applications" fill="#f97316" radius={[4, 4, 0, 0]} name="Applications" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 shadow-sm">
                <CardHeader>
                    <CardTitle>Jobs by Domain</CardTitle>
                    <CardDescription>Distribution of active job listings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={jobDomainData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {jobDomainData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
