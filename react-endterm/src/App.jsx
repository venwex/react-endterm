// src/App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import ItemsList from "./routes/ItemsList";
import ItemDetails from "./routes/ItemDetails";
import Favorites from "./routes/Favorites";
import Profile from "./routes/Profile";

import Navbar from "./components/Layout/Navbar";
import ProtectedRoute from "./components/Layout/ProtectedRoute";

import { subscribeToAuthChanges } from "./services/authService";
import { setUser, clearUser } from "./store/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = subscribeToAuthChanges((user) => {
      if (user) dispatch(setUser(user));
      else dispatch(clearUser());
    });

    return () => unsub();
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<ItemsList />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/favorites" element={<Favorites />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </>
  );
}
