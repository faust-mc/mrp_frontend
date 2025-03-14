import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { UserProvider } from './components/ControlComponents/UserContext';
import ProtectedRoute from './components/ControlComponents/ProtectedRoute';
import RestrictRoute from './components/ControlComponents/RestrictRoute';
import Sidebar from './components/SidebarComponents/Sidebar'; // Import Sidebar
import Home from './pages/Home';
import Reports from './pages/Reports';
import Logs from './pages/Logs';
import Mrp from './pages/Mrp';
import User from './components/UserComponents/UserComponent';
import UserRoles from './components/RoleComponents/UserRoles';
import NotFound from './pages/NotFound';
import AreaConfig from './pages/AreaConfig';
import Transactional from './pages/Transactional';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import ContainerDetails from './pages/ContainerDetails';
import { ModuleProvider, useModuleContext } from "./components/ControlComponents/ModuleContext";


function Logout() {
  window.localStorage.clear();
  return <Navigate to='/login' />;
}


function AppRoutes() {
  // Access modules using the context
  const { modules } = useModuleContext();

  return (
   <BrowserRouter>
  
        <Routes>
          {/* Sidebar routes */}
          <Route element={
                  <ProtectedRoute>
                    <Sidebar modules={modules?modules:"no modules"} />
                  </ProtectedRoute>

          }>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                 
                  <Home />
                
                </ProtectedRoute>
              }
            />
            <Route
              path="/masterdata/user/"
              element={

                <RestrictRoute modules={modules} requiredModuleSlug="masterdata">
                      <ProtectedRoute>
                  <User />
                    </ProtectedRoute>
                  </RestrictRoute>
              }
            />
            <Route
              path="/masterdata/roles/"
              element={
                
                <ProtectedRoute>
                <RestrictRoute modules={modules} requiredModuleSlug="masterdata">
                  <UserRoles />
                  </RestrictRoute>
                </ProtectedRoute>
                
              }
            />

            <Route
              path="/masterdata/location_config/branch/"
              element={

                <ProtectedRoute>
                <RestrictRoute modules={modules} requiredModuleSlug="masterdata">
                  <AreaConfig />
                  </RestrictRoute>
                </ProtectedRoute>

              }
            />
            
            <Route
              path="/transactional/"
              element={
                <RestrictRoute modules={modules} requiredModuleSlug="transactional">
                     <ProtectedRoute>
                  <Transactional />
                   </ProtectedRoute>
                  </RestrictRoute>
              }
            />
            <Route
              path="/reports/"
              element={
                
                <ProtectedRoute>
                <RestrictRoute modules={modules} requiredModuleSlug="reports">
                  <Reports />
                  </RestrictRoute>
                </ProtectedRoute>
                
              }
            />
            <Route
              path="/inventory/*"
              element={
                <ProtectedRoute>
                  <RestrictRoute modules={modules} requiredModuleSlug="inventory">
                    <Routes>
                      <Route path="/" element={<Inventory />} />
                      <Route path="mrp/reports/:idofinventory" element={<Mrp />} />
                    </Routes>
                  </RestrictRoute>
                </ProtectedRoute>
              }
            />


            <Route
              path="/logs/daily"
              element={
                <ProtectedRoute>
                <RestrictRoute modules={modules} requiredModuleSlug="logs">
                  <Logs />
                  </RestrictRoute>
                </ProtectedRoute>
              }
            />
          </Route>


          {/* Other routes */}
          <Route path="/login/" element={<Login />}></Route>
          <Route path="/logout/" element={<Logout />}></Route>
           <Route path="*" element={<NotFound />} ></Route>
        </Routes>
       </BrowserRouter>
 
  );
}

function App() {
  return (
    <ModuleProvider>
     
        <AppRoutes />
     
    </ModuleProvider>
  );
}

export default App;