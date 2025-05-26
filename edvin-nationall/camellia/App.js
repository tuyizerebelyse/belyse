import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegisterCandidatePage from './components/RegisterCandidatePage';
import AddPostPage from './components/AddPostPage';
import ManageCandidatePage from './components/ManageCandidatePage';
import ManagePostsPage from './components/ManagePostsPage';
import SettingsPage from './components/SettingsPage';
import EditCandidatePage from './components/EditCandidatePage';
import EditPostPage from './components/EditPostPage';

function App() {
  return (
    <div className="h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/register-candidate" element={<RegisterCandidatePage />} />
        <Route path="/add-post" element={<AddPostPage />} />
        <Route path="/manage-candidates" element={<ManageCandidatePage/>} />
        <Route path="/manage-posts" element={<ManagePostsPage/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/edit-candidate/:candidateNationalId" element={<EditCandidatePage/>} />
        <Route path="/edit-post/:postId" element={<EditPostPage/>} />
        <Route path="*" element={<h1 className="p-6">404 — Not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
