import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{
        width: '200px',
        padding: '20px',
        background:'violet',
        height: '100vh',
        boxShadow: '2px 0 5px rgba(13, 249, 226, 0.93)'
      }}>
        <h2>Dashboard</h2>
        <button onClick={() => navigate('department')}>Add Department</button><br /><br />
        <button onClick={() => navigate('employee')}>Add Employee</button><br /><br />
        <button onClick={() => navigate('salary')}>Add Salary</button><br /><br />
        <button onClick={() => navigate('report')}>View Report</button><br /><br />
        <button onClick={() => navigate('report1')}>Employee Report</button><br /><br />
        <button onClick={() => navigate('report2')}>Department Report</button><br /><br />
        <button onClick={() => navigate('report3')}>Salary Report</button><br /><br /><br />
          <button onClick={() => navigate('/login')}>Logout</button><br /><br /><br />
      </aside>

      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
