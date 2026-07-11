import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import WorkerDetailsPage from './pages/WorkerDetailsPage'
import CreateWorkerProfile from './pages/CreateWorkerProfile'
import MyProfilePage from './pages/MyProfilePage'
import JobsPage from './pages/JobsPage'
import PostJobPage from './pages/PostJobPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workers/:id" element={<WorkerDetailsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/create-profile"
            element={
              <ProtectedRoute>
                <CreateWorkerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
