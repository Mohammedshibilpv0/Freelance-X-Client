import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboard } from '../../../api/admin/adminServices';


interface Metric {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface OverviewData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  name: string;
  Posts: number;
  Users:number;
  Gigs: number;
  Profit: number;
}

interface DashboardData {
  overviewData: OverviewData[];
  monthlyData: MonthlyData[];
  metricsData: Metric[];
}

const MetricCard: React.FC<Metric> = ({ title, value, change, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <span className={`${color}`}>
        <i className={`fas fa-${icon}`}></i> 
      </span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
      {change > 0 ? <i className="fas fa-arrow-up mr-1"></i> : <i className="fas fa-arrow-down mr-1"></i>}
      {Math.abs(change)}%
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    overviewData: [],
    monthlyData: [],
    metricsData: [],
  });

  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboard(); 
      console.log(response)
      if (response && response.dashboard) {
        setDashboardData(response.dashboard); 
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch data'); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDashboardData(); 
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Monthly Statistics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Posts" fill="#10b981" />
                <Bar dataKey="Gigs" fill="#f59e0b" />
                <Bar dataKey="Profit" fill="#ef4444" />
                <Bar dataKey="Users" fill="#3d102e"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

       
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.overviewData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.overviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
