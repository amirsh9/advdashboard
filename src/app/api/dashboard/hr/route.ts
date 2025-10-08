import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'all';
    const department = searchParams.get('department') || 'all';
    
    // Build date filter condition
    let dateCondition = '';
    if (dateRange !== 'all') {
      if (dateRange === '2014') {
        dateCondition = "AND YEAR(e.HireDate) = 2014";
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(e.HireDate) = 2013";
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(e.HireDate) = 2012";
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(e.HireDate) = 2011";
      } else if (dateRange === '2011-2014') {
        dateCondition = "AND YEAR(e.HireDate) BETWEEN 2011 AND 2014";
      }
    }
    
    // Build department filter condition
    let departmentCondition = '';
    if (department !== 'all') {
      departmentCondition = `AND d.Name = '${department}'`;
    }
    
    // Get HR summary metrics
    const hrSummaryQuery = `
      SELECT 
        COUNT(*) AS TotalEmployees,
        COUNT(CASE WHEN CurrentFlag = 1 THEN 1 END) AS ActiveEmployees,
        COUNT(CASE WHEN Gender = 'M' THEN 1 END) AS MaleEmployees,
        COUNT(CASE WHEN Gender = 'F' THEN 1 END) AS FemaleEmployees,
        COUNT(DISTINCT DepartmentID) AS TotalDepartments,
        COUNT(DISTINCT ShiftID) AS TotalShifts,
        AVG(DATEDIFF(YEAR, HireDate, GETDATE())) AS AverageYearsOfService
      FROM HumanResources.Employee e
      JOIN Person.Person p ON e.BusinessEntityID = p.BusinessEntityID
      ${dateCondition}
    `;
    const hrSummary = await executeQuery(hrSummaryQuery);
    
    // Get employees by department
    const employeesByDepartmentQuery = `
      SELECT 
        d.Name AS DepartmentName,
        d.GroupName,
        COUNT(e.BusinessEntityID) AS EmployeeCount,
        AVG(e.VacationHours) AS AverageVacationHours,
        AVG(e.SickLeaveHours) AS AverageSickLeaveHours
      FROM HumanResources.Employee e
      JOIN HumanResources.EmployeeDepartmentHistory edh ON e.BusinessEntityID = edh.BusinessEntityID
      JOIN HumanResources.Department d ON edh.DepartmentID = d.DepartmentID
      WHERE edh.EndDate IS NULL
        ${departmentCondition}
        ${dateCondition}
      GROUP BY d.Name, d.GroupName
      ORDER BY EmployeeCount DESC
    `;
    const employeesByDepartment = await executeQuery(employeesByDepartmentQuery);
    
    // Get employees by shift
    const employeesByShiftQuery = `
      SELECT 
        s.Name AS ShiftName,
        s.StartTime,
        s.EndTime,
        COUNT(e.BusinessEntityID) AS EmployeeCount
      FROM HumanResources.Employee e
      JOIN HumanResources.EmployeeDepartmentHistory edh ON e.BusinessEntityID = edh.BusinessEntityID
      JOIN HumanResources.Shift s ON edh.ShiftID = s.ShiftID
      WHERE edh.EndDate IS NULL
        ${dateCondition}
      GROUP BY s.Name, s.StartTime, s.EndTime
      ORDER BY EmployeeCount DESC
    `;
    const employeesByShift = await executeQuery(employeesByShiftQuery);
    
    // Get recent hires (last 6 months)
    const recentHiresQuery = `
      SELECT TOP 10
        e.BusinessEntityID,
        p.FirstName,
        p.LastName,
        e.HireDate,
        e.JobTitle,
        d.Name AS DepartmentName,
        s.Name AS ShiftName
      FROM HumanResources.Employee e
      JOIN Person.Person p ON e.BusinessEntityID = p.BusinessEntityID
      JOIN HumanResources.EmployeeDepartmentHistory edh ON e.BusinessEntityID = edh.BusinessEntityID
      JOIN HumanResources.Department d ON edh.DepartmentID = d.DepartmentID
      JOIN HumanResources.Shift s ON edh.ShiftID = s.ShiftID
      WHERE edh.EndDate IS NULL
        ${dateCondition}
        ${departmentCondition}
      ORDER BY e.HireDate DESC
    `;
    const recentHires = await executeQuery(recentHiresQuery);
    
    // Get employees with most vacation hours
    const topVacationQuery = `
      SELECT TOP 10
        e.BusinessEntityID,
        p.FirstName,
        p.LastName,
        e.VacationHours,
        e.SickLeaveHours,
        e.HireDate,
        e.JobTitle,
        d.Name AS DepartmentName
      FROM HumanResources.Employee e
      JOIN Person.Person p ON e.BusinessEntityID = p.BusinessEntityID
      JOIN HumanResources.EmployeeDepartmentHistory edh ON e.BusinessEntityID = edh.BusinessEntityID
      JOIN HumanResources.Department d ON edh.DepartmentID = d.DepartmentID
      WHERE edh.EndDate IS NULL
        AND e.CurrentFlag = 1
        ${dateCondition}
        ${departmentCondition}
      ORDER BY e.VacationHours DESC
    `;
    const topVacation = await executeQuery(topVacationQuery);
    
    // Get job titles distribution
    const jobTitlesQuery = `
      SELECT 
        e.JobTitle,
        COUNT(*) AS EmployeeCount,
        AVG(e.VacationHours) AS AverageVacationHours,
        AVG(e.SickLeaveHours) AS AverageSickLeaveHours
      FROM HumanResources.Employee e
      JOIN HumanResources.EmployeeDepartmentHistory edh ON e.BusinessEntityID = edh.BusinessEntityID
      JOIN HumanResources.Department d ON edh.DepartmentID = d.DepartmentID
      WHERE e.CurrentFlag = 1
        AND edh.EndDate IS NULL
        ${dateCondition}
        ${departmentCondition}
      GROUP BY e.JobTitle
      HAVING COUNT(*) >= 2
      ORDER BY EmployeeCount DESC
    `;
    const jobTitles = await executeQuery(jobTitlesQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: hrSummary[0],
        employeesByDepartment,
        employeesByShift,
        recentHires,
        topVacation,
        jobTitles
      }
    });
  } catch (error) {
    console.error('HR dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve HR dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}