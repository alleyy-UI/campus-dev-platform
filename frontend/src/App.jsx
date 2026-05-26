import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import CodeRunner from './pages/CodeRunner';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>加载中...</div>;
  }
  return user ? children : <Login />;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={
        <PrivateRoute>
          <Layout>
            <Home />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/post/:id" element={
        <PrivateRoute>
          <Layout>
            <PostDetail />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/create" element={
        <PrivateRoute>
          <Layout>
            <CreatePost />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/code" element={
        <PrivateRoute>
          <Layout>
            <CodeRunner />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/profile/:id" element={
        <PrivateRoute>
          <Layout>
            <Profile />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <Layout>
            <Chat />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
