import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ComponentGenerator from './pages/ComponentGenerator';
import PricingPage from './pages/Pricingpage';
import ComponentsPage from './pages/Componentspage';
import MyComponentsPage from './pages/MyComponentsPage';

import {
  setAllComponents,
  setAllUsers,
  setUserData
} from './redux/userSlice';

export const ServerUrl = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  const [authChecked, setAuthChecked] = useState(false);

  // ✅ Auth check (NON-BLOCKING)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/user/currentuser`,
          { withCredentials: true }
        );
        console.log("✅ User authenticated:", res.data.email);
        dispatch(setUserData(res.data));
      } catch (error) {
        // 401/403 means not authenticated - this is normal
        // 5xx errors are server issues
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("📝 User not authenticated (no token)");
          dispatch(setUserData(null));
        } else if (error.response?.status >= 500) {
          console.error("Server error:", error.response.status);
          dispatch(setUserData(null));
        } else {
          console.log("Auth check error:", error.message);
          dispatch(setUserData(null));
        }
      } finally {
        setAuthChecked(true);
      }
    };

    fetchUser();
  }, [dispatch]);

  // ✅ Fetch extra data ONLY if admin/user exists
  useEffect(() => {
    if (!userData) return;

    const fetchExtraData = async () => {
      try {
        const [usersRes, componentsRes] = await Promise.all([
          axios.get(`${ServerUrl}/api/user/all-users`, {
            withCredentials: true
          }),
          axios.get(`${ServerUrl}/api/component/all-components`, {
            withCredentials: true
          })
        ]);

        dispatch(setAllUsers(usersRes.data));
        dispatch(setAllComponents(componentsRes.data));

      } catch (error) {
        console.error("Extra API Error:", error);
      }
    };

    fetchExtraData();
  }, [userData, dispatch]);

  // ❌ REMOVE full screen loader
  // ✔️ Instead allow render immediately

  return (
    <>
      {/* Optional: small top loader */}
      {!authChecked && (
        <div className="fixed top-0 left-0 w-full h-1 bg-purple-500 animate-pulse z-50" />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/generate" element={<ComponentGenerator />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/component" element={<ComponentsPage />} />
        <Route path="/my-components" element={<MyComponentsPage />} />
      </Routes>
    </>
  );
}

export default App;