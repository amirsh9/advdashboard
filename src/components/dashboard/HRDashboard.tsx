"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Briefcase,
  GraduationCap,
  Heart,
  Clock,
  DollarSign,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw
} from "lucide-react";

interface HRSummary {
  TotalEmployees: number;
  ActiveEmployees: number;
  MaleEmployees: number;
  FemaleEmployees: number;
  TotalDepartments: number;
  TotalShifts: number;
  AverageYearsOfService: number;
}

interface EmployeesByDepartment {
  DepartmentName: string;
  GroupName: string;
  EmployeeCount: number;
  AverageVacationHours: number;
  AverageSickLeaveHours: number;
}

interface EmployeesByShift {
  ShiftName: string;
  StartTime: string;
  EndTime: string;
  EmployeeCount: number;
}

interface RecentHire {
  BusinessEntityID: number;
  FirstName: string;
  LastName: string;
  HireDate: string;
  JobTitle: string;
  DepartmentName: string;
  ShiftName: string;
}

interface TopVacation {
  BusinessEntityID: number;
  FirstName: string;
  LastName: string;
  VacationHours: number;
  SickLeaveHours: number;
  HireDate: string;
  JobTitle: string;
  DepartmentName: string;
}

interface JobTitle {
  JobTitle: string;
  EmployeeCount: number;
  AverageVacationHours: number;
  AverageSickLeaveHours: number;
}

export default function HRDashboard({ filters }: { filters?: any }) {
  const [hrData, setHrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHRData = async (filterParams?: any) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange);
        }
        if (filterParams.department && filterParams.department !== 'all') {
          queryParams.append('department', filterParams.department);
        }
      }
      
      const url = queryParams.toString()
        ? `/api/dashboard/hr?${queryParams.toString()}`
        : '/api/dashboard/hr';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setHrData(result.data);
      } else {
        setError(result.message || 'Failed to fetch HR data');
      }
    } catch (err) {
      setError('Error fetching HR data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRData(filters);
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <UserX className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchHRData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const summary: HRSummary = hrData?.summary || {};
  const employeesByDepartment: EmployeesByDepartment[] = hrData?.employeesByDepartment || [];
  const employeesByShift: EmployeesByShift[] = hrData?.employeesByShift || [];
  const recentHires: RecentHire[] = hrData?.recentHires || [];
  const topVacation: TopVacation[] = hrData?.topVacation || [];
  const jobTitles: JobTitle[] = hrData?.jobTitles || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Resources Dashboard</h1>
          <p className="text-gray-600 mt-1">Complete HR management and analytics</p>
        </div>
        <Button onClick={fetchHRData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalEmployees}</div>
            <p className="text-xs text-green-600 mt-1">
              {summary.ActiveEmployees} active
            </p>
            <p className="text-xs text-gray-500 mt-1">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Departments
            </CardTitle>
            <Building className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalDepartments}</div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.TotalShifts} shifts
            </p>
            <p className="text-xs text-gray-500 mt-1">Organizational units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gender Distribution
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((summary.MaleEmployees / summary.TotalEmployees) * 100)}% / {Math.round((summary.FemaleEmployees / summary.TotalEmployees) * 100)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Male / Female
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {summary.MaleEmployees} / {summary.FemaleEmployees}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Years of Service
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.AverageYearsOfService?.toFixed(1) || '0'}</div>
            <p className="text-xs text-gray-500 mt-1">
              Average tenure
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Years per employee
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="hires">Recent Hires</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Employee Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <UserCheck className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{summary.ActiveEmployees}</span>
                  <span className="text-sm text-green-600">
                    {((summary.ActiveEmployees / summary.TotalEmployees) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(summary.ActiveEmployees / summary.TotalEmployees) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {summary.ActiveEmployees} / {summary.TotalEmployees}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Male Employees</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{summary.MaleEmployees}</span>
                  <span className="text-sm text-blue-600">
                    {((summary.MaleEmployees / summary.TotalEmployees) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(summary.MaleEmployees / summary.TotalEmployees) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {summary.MaleEmployees} / {summary.TotalEmployees}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Female Employees</CardTitle>
                <Users className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{summary.FemaleEmployees}</span>
                  <span className="text-sm text-pink-600">
                    {((summary.FemaleEmployees / summary.TotalEmployees) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(summary.FemaleEmployees / summary.TotalEmployees) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {summary.FemaleEmployees} / {summary.TotalEmployees}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Building className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{summary.TotalDepartments}</span>
                  <span className="text-sm text-gray-600">
                    {summary.TotalShifts} shifts
                  </span>
                </div>
                <Progress value={(summary.TotalDepartments / 20) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Organizational structure
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Hires and Top Vacation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Recent Hires
                </CardTitle>
                <CardDescription>Latest employee additions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentHires.map((hire, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{hire.FirstName} {hire.LastName}</p>
                          <p className="text-sm text-gray-600">{hire.JobTitle}</p>
                          <p className="text-xs text-gray-500">{hire.DepartmentName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(hire.HireDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Most Vacation Hours
                </CardTitle>
                <CardDescription>Employees with highest vacation balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVacation.slice(0, 5).map((employee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{employee.FirstName} {employee.LastName}</p>
                          <p className="text-sm text-gray-600">{employee.JobTitle}</p>
                          <p className="text-xs text-gray-500">{employee.DepartmentName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{employee.VacationHours}h</p>
                        <p className="text-sm text-gray-500">
                          {employee.SickLeaveHours}h sick
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Department Overview
              </CardTitle>
              <CardDescription>Employee distribution and leave balance by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {employeesByDepartment.map((dept, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{dept.DepartmentName}</h3>
                        <p className="text-sm text-gray-600">{dept.GroupName} • {dept.EmployeeCount} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{dept.AverageVacationHours}h</p>
                        <p className="text-sm text-gray-600">avg vacation</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Vacation Hours</span>
                          <span>{dept.AverageVacationHours}h</span>
                        </div>
                        <Progress value={(dept.AverageVacationHours / 100) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sick Leave Hours</span>
                          <span>{dept.AverageSickLeaveHours}h</span>
                        </div>
                        <Progress value={(dept.AverageSickLeaveHours / 50) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Titles Distribution</CardTitle>
              <CardDescription>Employee distribution by job titles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobTitles.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{job.JobTitle}</p>
                      <p className="text-sm text-gray-600">
                        {job.EmployeeCount} employees
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{job.AverageVacationHours}h</p>
                      <p className="text-sm text-gray-500">
                        {job.AverageSickLeaveHours}h sick
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Shift Distribution
              </CardTitle>
              <CardDescription>Employee distribution across work shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeesByShift.map((shift, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{shift.ShiftName}</p>
                      <p className="text-sm text-gray-600">
                        {shift.StartTime} - {shift.EndTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{shift.EmployeeCount}</p>
                      <p className="text-sm text-gray-500">
                        {((shift.EmployeeCount / summary.TotalEmployees) * 100).toFixed(1)}% of workforce
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hires" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Hires</CardTitle>
              <CardDescription>Latest employee additions in the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentHires.map((hire, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{hire.FirstName} {hire.LastName}</p>
                        <p className="text-sm text-gray-600">{hire.JobTitle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {hire.DepartmentName}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {hire.ShiftName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(hire.HireDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.floor((new Date().getTime() - new Date(hire.HireDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}