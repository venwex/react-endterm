import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

interface Props {
  children: React.ReactElement;
}

const GuardedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useGlobal();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default GuardedRoute;