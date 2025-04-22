import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics');
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;
  if (error) return <div className="analytics-error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="analytics-container">
      <h2>Website Analytics Dashboard 📊</h2>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Visits</h3>
          <p className="analytics-number">{stats.totalVisits}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Unique Visitors</h3>
          <p className="analytics-number">{stats.uniqueVisitors}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Today's Visits</h3>
          <p className="analytics-number">
            {stats.dailyVisits[new Date().toISOString().split('T')[0]] || 0}
          </p>
        </div>
      </div>

      <div className="analytics-recent">
        <h3>Recent Visits</h3>
        <div className="analytics-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Path</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {stats.lastVisits.map((visit, index) => (
                <tr key={index}>
                  <td>{new Date(visit.timestamp).toLocaleString()}</td>
                  <td>{visit.path}</td>
                  <td>{visit.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 