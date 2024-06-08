import React, { useEffect, useState } from 'react';
import { fetchActivityData } from '../services/api';
import ActivityChart from './ActivityChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityData()
      .then(response => {
        console.log('Fetched data:', response); 
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Developer Activity Dashboard</h1>
      </header>
      <div className="main-content">
        <section className="content">
          <div className="cards">
            <div className="card">
              <h3>Total Commits</h3>
              <p>{data.AuthorWorklog.rows.reduce((acc: number, row: any) => acc + row.totalActivity.find((activity: any) => activity.name === 'Commits').value, 0)}</p>
            </div>
            <div className="card">
              <h3>Total PRs Opened</h3>
              <p>{data.AuthorWorklog.rows.reduce((acc: number, row: any) => acc + row.totalActivity.find((activity: any) => activity.name === 'PR Open').value, 0)}</p>
            </div>
            <div className="card">
              <h3>Total PRs Merged</h3>
              <p>{data.AuthorWorklog.rows.reduce((acc: number, row: any) => acc + row.totalActivity.find((activity: any) => activity.name === 'PR Merged').value, 0)}</p>
            </div>
     
          </div>
          <ActivityChart data={data} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
