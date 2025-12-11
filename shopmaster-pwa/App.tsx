import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider, useGlobal } from './context/GlobalContext';
import Navbar from './components/Navbar';
import Home, { About } from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import GuardedRoute from './components/GuardedRoute';

const NotificationBanner = () => {
  const { mergeMessage } = useGlobal();
  if (!mergeMessage) return null;
  return (
    <div className="bg-green-600 text-white text-center py-2 px-4 shadow-md animate-bounce sticky top-16 z-40">
      {mergeMessage}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <NotificationBanner />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route 
            path="/profile" 
            element={
              <GuardedRoute>
                <Profile />
              </GuardedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <HashRouter>
      <GlobalProvider>
        <AppRoutes />
      </GlobalProvider>
    </HashRouter>
  );
};

export default App;
