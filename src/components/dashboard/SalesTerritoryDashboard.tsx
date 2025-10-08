"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  TrendingUp, 
  Users, 
  DollarSign,
  RefreshCw,
  BarChart3,
  MapPin,
  Target
} from "lucide-react";

interface TerritorySummary {
  TotalTerritories: number;
  TotalCountries: number;
  TotalGroups: number;
  TotalSalesPeople: number;
  TotalSales: number;
  AverageSalePerTerritory: number;
}

interface TerritorySales {
  TerritoryID: number;
  TerritoryName: string;
  CountryRegionCode: string;
  Group: string;
  SalesYTD: number;
  SalesLastYear: number;
  OrderCount: number;
  TotalSales: number;
  AverageOrderValue: number;
  CustomerCount: number;
  SalesPersonCount: number;
}

interface CountrySales {
  CountryRegionCode: string;
  TerritoryCount: number;
  OrderCount: number;
  TotalSales: number;
  AverageOrderValue: number;
  CustomerCount: number;
}

interface GroupSales {
  Group: string;
  TerritoryCount: number;
  OrderCount: number;
  TotalSales: number;
  AverageOrderValue: number;
  CustomerCount: number;
}

interface TopTerritory {
  TerritoryID: number;
  TerritoryName: string;
  CountryRegionCode: string;
  Group: string;
  SalesYTD: number;
  SalesLastYear: number;
  YearOverYearChange: number;
  OrderCount: number;
  TotalSales: number;
  CustomerCount: number;
}

interface SalesPersonPerformance {
  TerritoryID: number;
  TerritoryName: string;
  BusinessEntityID: number;
  SalesPersonName: string;
  JobTitle: string;
  OrderCount: number;
  TotalSales: number;
  AverageOrderValue: number;
  CustomerCount: number;
}

export default function SalesTerritoryDashboard({ filters }: { filters?: any }) {
  const [territoryData, setTerritoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerritoryData = async (filterParams?: any) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange);
        }
        if (filterParams.territory && filterParams.territory !== 'all') {
          queryParams.append('territory', filterParams.territory);
        }
        if (filterParams.status && filterParams.status !== 'all') {
          queryParams.append('status', filterParams.status);
        }
        if (filterParams.category && filterParams.category !== 'all') {
          queryParams.append('category', filterParams.category);
        }
      }
      
      const url = queryParams.toString()
        ? `/api/dashboard/sales-territory?${queryParams.toString()}`
        : '/api/dashboard/sales-territory';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setTerritoryData(result.data);
      } else {
        setError(result.message || 'Failed to fetch territory data');
      }
    } catch (err) {
      setError('Error fetching territory data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerritoryData(filters);
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
          <Target className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchTerritoryData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const summary: TerritorySummary = territoryData?.summary || {};
  const salesByTerritory: TerritorySales[] = territoryData?.salesByTerritory || [];
  const salesByCountry: CountrySales[] = territoryData?.salesByCountry || [];
  const salesByGroup: GroupSales[] = territoryData?.salesByGroup || [];
  const topTerritories: TopTerritory[] = territoryData?.topTerritories || [];
  const salesPeopleByTerritory: SalesPersonPerformance[] = territoryData?.salesPeopleByTerritory || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Territory Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor sales performance across territories and regions for {filters?.dateRange || '2014'}
          </p>
        </div>
        <Button onClick={fetchTerritoryData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Territories</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalTerritories}</div>
            <p className="text-xs text-muted-foreground">
              {summary.TotalCountries} countries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales People</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalSalesPeople}</div>
            <p className="text-xs text-muted-foreground">
              Active representatives
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(summary.TotalSales / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              All territories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Territory</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(summary.AverageSalePerTerritory / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Average performance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalGroups}</div>
            <p className="text-xs text-muted-foreground">
              Territory groups
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Territory</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {topTerritories[0]?.TerritoryName || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${(topTerritories[0]?.TotalSales / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="territories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="performers">Top Performers</TabsTrigger>
          <TabsTrigger value="salespeople">Sales People</TabsTrigger>
        </TabsList>
        
        <TabsContent value="territories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {salesByTerritory.map((territory, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{territory.TerritoryName}</CardTitle>
                    <Badge variant="outline">{territory.CountryRegionCode}</Badge>
                  </div>
                  <CardDescription>
                    {territory.Group} • {territory.CustomerCount} customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Sales</span>
                      <span className="font-medium">
                        ${(territory.TotalSales / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Orders</span>
                      <span className="font-medium">{territory.OrderCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Order Value</span>
                      <span className="font-medium">
                        ${territory.AverageOrderValue?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sales People</span>
                      <span className="font-medium">{territory.SalesPersonCount}</span>
                    </div>
                    <Progress 
                      value={(territory.TotalSales / summary.TotalSales) * 100} 
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Country</CardTitle>
              <CardDescription>
                Performance breakdown by country/region for {filters?.dateRange || '2014'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByCountry.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{country.CountryRegionCode}</p>
                      <p className="text-sm text-muted-foreground">
                        {country.TerritoryCount} territories • {country.CustomerCount} customers
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${(country.TotalSales / 1000000).toFixed(2)}M
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {country.OrderCount.toLocaleString()} orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Territory Group</CardTitle>
              <CardDescription>
                Performance breakdown by territory groups for {filters?.dateRange || '2014'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByGroup.map((group, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{group.Group}</p>
                      <p className="text-sm text-muted-foreground">
                        {group.TerritoryCount} territories • {group.CustomerCount} customers
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${(group.TotalSales / 1000000).toFixed(2)}M
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {group.OrderCount.toLocaleString()} orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Territories</CardTitle>
              <CardDescription>
                Territories with highest sales performance in {filters?.dateRange || '2014'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTerritories.map((territory, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{territory.TerritoryName}</p>
                      <p className="text-sm text-muted-foreground">
                        {territory.CountryRegionCode} • {territory.CustomerCount} customers
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          {territory.Group}
                        </Badge>
                        {territory.YearOverYearChange > 0 ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +${(territory.YearOverYearChange / 1000).toFixed(0)}K
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            ${(territory.YearOverYearChange / 1000).toFixed(0)}K
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${(territory.TotalSales / 1000000).toFixed(2)}M
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {territory.OrderCount.toLocaleString()} orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salespeople" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales People Performance</CardTitle>
              <CardDescription>
                Individual sales performance by territory for {filters?.dateRange || '2014'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesPeopleByTerritory.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{person.SalesPersonName}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.JobTitle} • {person.TerritoryName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${(person.TotalSales / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {person.OrderCount} orders • {person.CustomerCount} customers
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