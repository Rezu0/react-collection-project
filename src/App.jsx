import React, { useState } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import NavbarComponent from './components/navbar/NavbarComponent';
import { Box, Container, CssBaseline } from '@mui/joy';
import { useEffect } from 'react';
import LogoutPage from './components/LogoutPage';
import { LINK_API } from './utils/config.json';
import { toast } from 'react-toastify';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRoles, setIsRoles] = useState('staff');
  const [isDivision, setIsDivision] = useState(0);
  const [isUsername, setIsUsername] = useState(0);

  useEffect(() => {
    const storedState = localStorage.getItem('loginState')
    const parseStorage = JSON.parse(storedState);
    
    if (storedState) {
      if (parseStorage.state) {
        try {

          // OPTIONS CHECKING SSO
          const headersLogin = new Headers();
          headersLogin.append("Content-Type", "application/json");
          headersLogin.append("Authorization", `Bearer ${[parseStorage._token]}`);

          const raw = "";

          const optionsLogin = {
            method: 'POST',
            headers: headersLogin,
            body: raw,
            redirect: 'follow'
          };

          fetch(`${LINK_API}api/check-token`, optionsLogin)
            .then((response) => response.json())
            .then((result) => {
              if (result.message === 'Expired token') {
                toast.error('Expired Token');
                
                setTimeout(() => {
                  setIsAuthenticated(false);
                  localStorage.removeItem('loginState');
                }, 2000)
              }

              if (result.status) {
                if (result.status === 'fail') {
                  toast.error(result.message)
                  setIsAuthenticated(false)
                  localStorage.removeItem('loginState')
                } else {
                  toast.success('Berhasil Login kembali!')
                  setIsAuthenticated(parseStorage.state);
                  setIsRoles(result.roles);
                  setIsDivision(result.divisi)
                  setIsUsername(result.username);
                }
              }
            })
            .catch((error) => console.log('error', error));
            // END CHECKING SSO
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [setIsAuthenticated, setIsRoles, setIsUsername, setIsDivision]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" />
              : 
              <Container 
                maxWidth="lg" 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh',
                }}
              >
                <Box
                  border='1px solid #ffffff'
                  padding='30px'
                  borderRadius='10px'
                >
                  <LoginPage 
                    setIsAuthenticated={setIsAuthenticated} setIsRoles={setIsRoles}
                    setIsUsername={setIsUsername}
                    setIsDivision={setIsDivision}
                  />
                </Box>
              </Container>
            } 
          />

          <Route 
            path="/"
            element={
              isAuthenticated ? 
              <>
                <CssBaseline />
                <NavbarComponent 
                  isAuth={isAuthenticated}
                  isUsername={(isUsername === 0) ? 'User': isUsername}
                />
                <Container maxWidth="lg">
                  <Box>
                    <HomePage 
                      isRoles={isRoles}
                      isDivision={(isDivision === 0) ? 'Loading...' : isDivision}
                      setIsDivision={setIsDivision}
                    /> 
                  </Box>
                </Container>
              </>
              : 
              <Navigate to="/login" />
            } 
          />

          <Route
            path='/logout'
            element={
              !isAuthenticated ?
                <Navigate to="/login" />
              : <LogoutPage 
                  setIsAuthenticated={setIsAuthenticated}
                  setIsUsername={setIsUsername}
                  setIsRoles={setIsRoles}
                />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
