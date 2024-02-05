import { Box, Button, Container, FormControl, FormLabel, Grid, Input, Option, Select } from "@mui/joy";
import React from "react";
import { CODE_REGIS } from '../utils/config.json';
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { LINK_API } from '../utils/config.json';
import { useNavigate } from 'react-router-dom';

const validationRegister = (args) => {
  for (const key in args) {
    if (args[key] === "") {
      toast.error(`Field ${(key === 'displayUsername') ? 'Pen Name' : key} harus diisi`);
      return;
    }
  }
}

function RegisterPage() {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const optionsDivisi = [
    {
      id: 1,
      value: 'manhwa',
      text: 'Manhwa'
    },
    {
      id: 2,
      value: 'doujin',
      text: 'Doujin'
    }
  ];
  const [isFormRegister, setIsFormRegister] = useState({
    username: "",
    displayUsername: "",
    password: "",
    role: "staff",
    divisi: "",
    code: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setIsFormRegister((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSelectDivisi = (event, newValue) => {
    setIsFormRegister((prev) => ({
      ...prev,
      divisi: newValue
    }))
  }

  const handleOnSubmitRegister = (e) => {
    e.preventDefault();
    setIsLoadingRegister(true);
    validationRegister(isFormRegister);

    if (isFormRegister?.code !== CODE_REGIS) {
      toast.error('Code salah. Hubungi admin!');
      setTimeout(() => {
        setIsLoadingRegister(false);
      }, 2000);
      return;
    }

    const headersRegister = new Headers();
    headersRegister.append("Content-Type", "application/json");

    const bodyRaw = JSON.stringify({
      username: isFormRegister?.username,
      password: isFormRegister?.password,
      displayUsername: isFormRegister?.displayUsername,
      role: isFormRegister?.role,
      divisi: isFormRegister?.divisi
    });

    const requestOptions = {
      method: 'POST',
      headers: headersRegister,
      body: bodyRaw,
      redirect: 'follow'
    }

    fetch(`${LINK_API}api/register`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'success') {
          setTimeout(() => {
            toast.success(result.message);
            setIsFormRegister(() => ({
              username: "",
              displayUsername: "",
              password: "",
              role: "staff",
              divisi: "",
              code: ""
            }));
            setIsLoadingRegister(false);
          }, 2000);

          setTimeout(() => {
            navigate('/login');
          }, 3000)
        }
      }).catch((err) => {
        setIsLoadingRegister(false);
        toast.error('Terjadi kesalahan!');
        console.error(err);
      })
  }

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            border: '1px solid #ffffff',
            padding: '30px',
            borderRadius: '10px'
          }}
        >
          <FormLabel
            sx={{
              color: '#ffffff',
              marginBottom: '12px'
            }}
          >
            <h2>Register Page</h2>
          </FormLabel>
          <form
            onSubmit={handleOnSubmitRegister}
          >
            <FormControl
              sx={{ marginBottom: '10px' }}
            >
              <FormLabel
                sx={{ color: '#ffffff' }}
              >
                Username
              </FormLabel>
              <Input 
                type="text"
                placeholder="Username..."
                size="md"
                variant="soft"
                value={isFormRegister.username}
                name="username"
                autoComplete="username"
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl
              sx={{ marginBottom: '10px' }}
            >
              <FormLabel
                sx={{ color: '#ffffff' }}
              >
                Pen Name
              </FormLabel>
              <Input 
                type="text"
                placeholder="Pen name..."
                size="md"
                variant="soft"
                value={isFormRegister.displayUsername}
                name="displayUsername"
                autoComplete="pen name"
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl
              sx={{ marginBottom: '10px' }}
            >
              <FormLabel
                sx={{ color: '#ffffff' }}
              >
                Password
              </FormLabel>
              <Input 
                type="password"
                placeholder="Password..."
                size="md"
                variant="soft"
                value={isFormRegister.password}
                name="password"
                autoComplete="password"
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl
              sx={{ marginBottom: '10px' }}
            >
              <FormLabel
                sx={{ color: '#ffffff' }}
              >
                Divisi
              </FormLabel>
              <Select
                placeholder="Choose one"
                name="divisi"
                onChange={handleSelectDivisi}
              >
                {optionsDivisi.map((od) => (
                  <Option
                    value={od.value}
                    key={od.id}
                  >
                    {od.text}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{ marginBottom: '10px' }}
            >
              <FormLabel
                sx={{ color: '#ffffff' }}
              >
                Code
              </FormLabel>
              <Input 
                type="text"
                placeholder="Code..."
                size="md"
                variant="soft"
                value={isFormRegister.code}
                name="code"
                autoComplete="code"
                onChange={handleInputChange}
              />
            </FormControl>

            <Button
              type="submit"
              color="primary"
              size="md"
              variant="soft"
              sx={{
                marginTop: '10px',
                backgroundColor: '#e33d61',
                color: '#ffffff'
              }}
              loading={isLoadingRegister}
            >
              Register
            </Button>
          </form>

          <Grid
            container
            spacing={2}
            textAlign='start'
            marginTop='2px'
            fontSize='13px'
          >
            Sudah punya akun? 
            {
              <Link
                to='/login'
                style={{
                  marginLeft: '4px',
                  textDecoration: 'underline',
                  fontSize: '13ppx',
                  color: 'blue'
                }}
              >
                Login disini
              </Link>
            }
          </Grid>
        </Box>
      </Container>

      <ToastContainer 
        theme="dark"
        position="bottom-center"
      />
    </>
  )
}

export default RegisterPage;