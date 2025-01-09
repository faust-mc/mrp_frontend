import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { UserProvider } from './components/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import RestrictRoute from './components/RestrictRoute';
import Sidebar from './components/Sidebar'; // Import Sidebar
import Home from './pages/Home';
import Reports from './pages/Reports';
import Mrp from './pages/Mrp';
import User from './components/UserComponent';
import UserRoles from './components/UserRoles';
import NotFound from './pages/NotFound';
import Transactional from './pages/Transactional';
import Login from './pages/Login';
import ContainerDetails from './pages/ContainerDetails';
import { ModuleProvider, useModuleContext } from "./components/ModuleContext";


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
                   <RestrictRoute modules={modules} requiredModuleSlug="masterdata">
                  <Home />
                    </RestrictRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/masterdata/user/"
              element={
                <ProtectedRoute>
                <RestrictRoute modules={modules} requiredModuleSlug="masterdata">
                  <User />
                  </RestrictRoute>
                </ProtectedRoute>
                
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
              path="/transactional/"
              element={
                
                <ProtectedRoute>
                <RestrictRoute modules={modules} requiredModuleSlug="transactional">
                  <Transactional />
                  </RestrictRoute>
                </ProtectedRoute>
                
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
              path="/mrp/"
              element={
                
                <ProtectedRoute>
                <RestrictRoute modules={modules} requiredModuleSlug="mrp">
                  <Mrp />
                </RestrictRoute>
                </ProtectedRoute>
                
              }
            />
            <Route
              path="/container-details/:containerId"
              element={
               
                 <ProtectedRoute>
                  <RestrictRoute modules={modules} requiredModuleSlug="reports">
                  <ContainerDetails />
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