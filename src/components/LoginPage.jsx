import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  Input,
  FormLabel,
  Button,
  Grid,
  CssBaseline
} from '@mui/joy';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { LINK_API } from '../utils/config.json'

function LoginPage({ setIsAuthenticated, setIsRoles, setIsUsername, setIsDivision }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedState = localStorage.getItem('loginState')
    if (storedState) {
      setIsAuthenticated(storedState)
    }
  }, [setIsAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Cek login dengan data statis

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const dataRaw = JSON.stringify({
      "username": username,
      "password": password
    });

    if (!username) {
      toast.error('Username tidak boleh kosong!')
    }

    if (!password) {
      toast.error('Password tidak boleh kosong!')
    }

    if (username && password) {
      const options = {
        method: "POST",
        headers: myHeaders,
        body: dataRaw,
        redirect: "follow"
      }
  
      try {
        await fetch(`${LINK_API}api/login`, options).then((response) => response.json())
          .then((result) => {
            if (result.statusCode === 401) {
              setLoading(true);
              toast.error(result.message);
              // console.clear()
    
              setTimeout(() => {
                setLoading(false);
              }, 1000)
            } else {
              setLoading(true);
              toast.success(result.message);
      
              setTimeout(() => {
                const loginLog = {
                  _token: result.data._user._token,
                  state: true,
                }

                const tokenString = JSON.stringify(loginLog);
                localStorage.setItem('loginState', tokenString);
                setIsAuthenticated(true)
                setIsRoles(result.data._user._role);
                setIsUsername(result.data._user._username)
                setIsDivision(result.data._user._divisi)
                navigate('/');
              }, 2000)
            }
          })
          .catch((err) => 
            console.error("Error fetching login: ", err)
          )
      } catch (err) {
        console.log(err);
      }
    }


    // if (username === 'user' && password === 'password') {
    //   toast.success('Login berhasil!')
    //   setLoading(true);
      
    //   setTimeout(() => {
    //     localStorage.setItem('loginState', true)
    //     setIsAuthenticated(true);
    //     navigate('/')
    //   }, 2000)
    // } else {
    //   setLoading(true)
    //   toast.error('Login gagal. Coba lagi.')

    //   setTimeout(() => {
    //     setLoading(false)
    //   }, 1000)
    // }
  };

  return (
    <>
      <CssBaseline />
      <FormLabel sx={{ color: '#ffffff', marginBottom: '12px' }}>
          <h2>Login page</h2>
        </FormLabel>
        <form onSubmit={handleLogin}>
          <FormControl 
            sx={{ marginBottom: '10px' }}
          >
            <FormLabel sx={{ color: '#ffffff' }}>Username</FormLabel>
            <Input 
              type='text'
              placeholder='Username...'
              size='md'
              variant='soft'
              value={username}
              autoComplete='username'
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: '#ffffff' }}>Password</FormLabel>
            <Input 
              type='password'
              placeholder='Password...'
              size='md'
              variant='soft'
              value={password}
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button
            type='submit'
            color='primary'
            size='md'
            variant='soft'
            sx={{ marginTop: '10px', backgroundColor: '#e33d61', color: '#ffffff' }}
            loading={loading}
            className='button-login'
          >
            Login
          </Button>
        </form>

        <Grid container spacing={2} textAlign='start' marginTop='2px' fontSize='13px'>
          <Grid md={12}>
            Tidak punya akun? hubungi admin
          </Grid>
        </Grid>

        <ToastContainer
          theme='dark'
          position='bottom-center'
        />
    </>
  );
}

export default LoginPage;
