// Home.js
import { Box, Button, FormControl, FormLabel, Grid, Input, Tooltip, Typography, styled } from '@mui/joy';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { LINK_API } from '../utils/config.json';
import BalanceComponent from './currency/BalanceComponent';
import CardProfile from './others/CardProfile';
import { showFormattedDate } from '../utils/dataMenu';
import InputProject from './others/InputProject';

const ItemGrid = styled(Paper)(({ theme }) => ({
  backgroundColor: '#e97991',
  padding: '20px',
  textAlign: 'start',
  color: '#ffffff',
  borderRadius: '10px',
}))

function HomePage({ isRoles, isDivision, setIsDivision }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));
  const [isProfile, setIsProfile] = useState(0);

  const upperCaseStatus = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken)

    if (storedToken) {
      if (parseStorage.state) {
        try {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append('Authorization', `Bearer ${parseStorage._token}`);

          const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

          fetch(`${LINK_API}api/profile`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if(result.status) {
                if (result.status === 'success') {
                  setIsProfile(result.data._user)
                  setIsDivision(result.data._user.divisi)
                }
              }
            }).catch((err) => {
              console.error('ERROR FETCHING PROFILE', err);
              toast.error('Terjadi kesalahan!')
            })
        } catch (err) {
          toast.error('Ada yang error')
        }
      }
    }
  }, [setIsProfile, setIsDivision])

  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: '70px' }}>
        {/* Box Balance, Profile, Status */}
        <Grid 
          container
          spacing={2}
          padding='10px 15px'
          marginBottom='20px'
          sx={{
            border: '1px solid #e97991',
            borderRadius: '20px'
          }}
        >
          <Grid
            item="true"
            md={12}
            xs={12}
            padding='10px'
          >
            <CardProfile
              isProfile={(isProfile === 0) ? 'Loading' : isProfile}
            />
          </Grid>

          <Grid item="true" xs={12} md={6}>
            <ItemGrid>
              <Grid
                container
                spacing={2}
              >
                <Grid item="true" md={6} xs={12}>
                  <Typography 
                    fontWeight='900'
                    fontSize='25px'
                    color='#ffffff'
                    fontFamily='Titillium Web'
                    letterSpacing='3px'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px', // Adjust the gap as needed
                    }}
                  >
                    <AccountBalanceWalletIcon /> Balance Amount
                  </Typography>
                </Grid>
                <Grid item="true" md={6} xs={12}>
                  <BalanceComponent 
                    balance={(isProfile === 0) ? 'Loading...' : isProfile.amount[0].amount}
                    isXs={isXs}
                  />
                </Grid>

                <Grid item="true" md={12}>
                  <Button
                    fullWidth
                    sx={{
                      fontSize: '17px',
                      backgroundColor: '#d1d1d1',
                      color: '#000000',
                      width: '100%'
                    }}
                    className='button-tarik'
                  >
                    Withdraw
                  </Button>
                </Grid>
              </Grid>
            </ItemGrid>
          </Grid>

          <Grid item="true" xs={12} md={6}>
            <ItemGrid>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item="true"
                  md={12}
                >
                  <Typography 
                    fontWeight='900'
                    fontSize='23px'
                    color='#ffffff'
                    fontFamily='Titillium Web'
                    letterSpacing='3px'
                    textAlign={(isXs) ? 'end' : 'start'}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {(isRoles === 'owner-dd') ?
                      <>
                        <AccessTimeFilledOutlinedIcon /> Admin Status Withdraw
                      </> : 
                      <>
                        <AccessTimeFilledOutlinedIcon /> Status Withdraw
                      </>
                    }
                  </Typography>
                </Grid>
                <Grid
                  item="true"
                  md={12}
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  {(isProfile === 0) ? 'Loading...' :
                    <Tooltip 
                      title={`Last Withdraw ${showFormattedDate(isProfile.amount[0].lastWithdraw)}`}
                      followCursor
                    >
                      <Button
                        fullWidth
                        sx={{
                          fontSize: '17px',
                          backgroundColor: (isProfile.amount[0].status === 'pending') ? '#ffca2c' : (isProfile.amount[0].status === 'success') ? '#22bf76' : '#5c636a',
                          color: '#000000',
                          width: '100%'
                        }}
                        className='button-status'
                      >
                        {
                          upperCaseStatus(isProfile.amount[0].status)
                        }
                      </Button>
                    </Tooltip>
                  }
                </Grid>
              </Grid>
            </ItemGrid>
          </Grid>
        </Grid>

        {/* Box Input, List data */}
        <Grid
          container
          spacing={2}
          padding='10px 15px'
          sx={{
            border: '1px solid #e97991',
            borderRadius: '20px'
          }}
        >
          <Grid
            item="true"
            md={12}
            xs={12}
            padding='10px'
          >
            <ItemGrid>
              <InputProject
                isDivision={isDivision}
                isProfile={(isProfile === 0) ? 'Loading' : isProfile}
                setIsProfile={setIsProfile}
              />
            </ItemGrid>
          </Grid>
        </Grid>
      </Box>
      
      <ToastContainer
          theme='dark'
          position='bottom-center'
      />
    </>
  );
}

export default HomePage;
