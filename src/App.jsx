import { useState, useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ContainerDetails from './pages/ContainerDetails';
import Header from './components/Header';
import { UserProvider } from './components/UserContext';
import api from './api'; // Assuming you have an api instance

function Logout() {
  window.localStorage.clear();
  return <Navigate to='/login' />;
}

function App() {

  const token = window.localStorage.getItem(ACCESS_TOKEN); // Access token retrieval


  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/container-details/:containerId'
            element={
              <ProtectedRoute>
                <ContainerDetails />
              </ProtectedRoute>
            }
          />
          <Route exact path='/login/' element={<Login />} />
          <Route exact path='/logout' element={<Logout />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
