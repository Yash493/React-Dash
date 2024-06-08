import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './ActivityChart.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ActivityChartProps {
  data: any;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const [filter, setFilter] = useState<string>('all');
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    if (data && data.AuthorWorklog && data.AuthorWorklog.rows) {
      console.log('Valid data structure:', data);

      const filteredData = filter === 'all' ? data.AuthorWorklog.rows : data.AuthorWorklog.rows.filter((row: any) => row.totalActivity.some((activity: any) => activity.name === filter));
      
      const labels = filteredData.map((row: any) => row.name);

      const datasets = data.AuthorWorklog.activityMeta
        .filter((activity: any) => filter === 'all' || activity.label === filter)
        .map((activity: any) => {
          return {
            label: activity.label,
            data: filteredData.map((row: any) => row.totalActivity.find((a: any) => a.name === activity.label)?.value || 0),
            borderColor: activity.fillColor,
            backgroundColor: activity.fillColor,
            tension: 0.4,
            fill: false,
            borderWidth: 2,
            pointRadius: 3,
          };
        });

      setChartData({
        labels,
        datasets,
      });
    } else {
      console.error('Invalid data structure:', data);
    }
  }, [data, filter]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Developer Activity Chart',
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="filter-container">
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          {data?.AuthorWorklog?.activityMeta?.map((activity: any) => (
            <option key={activity.label} value={activity.label}>{activity.label}</option>
          ))}
        </select>
      </div>
      {chartData.labels ? (
        <Line data={chartData} options={options} />
      ) : (
        <div>No chart data available</div>
      )}
    </div>
  );
};

export default ActivityChart;
