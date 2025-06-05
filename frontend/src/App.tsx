import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import TodoList from '@/pages/TodoList';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from 'antd';
import React from 'react';

const Private: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <Private>
            <TodoList />
          </Private>
        }
      />
    </Routes>
  </Layout>
);

export default App;
