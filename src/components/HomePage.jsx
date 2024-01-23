// Home.js
import { Box, Button, FormControl, FormLabel, Grid, Input, Modal, ModalClose, Option, Select, Sheet, Tooltip, Typography, styled } from '@mui/joy';
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
import { Dialog } from 'primereact/dialog';

const ItemGrid = styled(Paper)(({ theme }) => ({
  backgroundColor: '#e97991',
  padding: '20px',
  textAlign: 'start',
  color: '#ffffff',
  borderRadius: '10px',
}))

const formatToCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const dataVia = [
  {
    id: 1,
    name: 'OVO'
  },
  {
    id: 2,
    name: 'DANA'
  },
  {
    id: 3,
    name: 'GOPAY'
  },
  {
    id: 4,
    name: 'Shopee Pay'
  }
];

function HomePage({ isRoles, isDivision, setIsDivision }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));
  const [isProfile, setIsProfile] = useState(0);
  const [isInfoWihtdraw, setIsInfoWithdraw] = useState(0);
  const [isModalWithdraw, setIsModalWithdraw] = useState(false);
  const [isLoadingWihtdraw, setIsLoadingWithdraw] = useState(false);
  const [isFormWithdraw, setIsFormWithdraw] = useState({
    userId: '',
    via: '',
    nomor: ''
  });

  const upperCaseStatus = (text) => {
    return text?.charAt(0).toUpperCase() + text?.slice(1);
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
                  setIsFormWithdraw((prevFormData) => ({
                    ...prevFormData,
                    userId: result.data._user.displayId,
                  }));
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

  useEffect(() => {
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        try {
          const headersWithdraw = new Headers();
          headersWithdraw.append('Content-Type', "application/json")
          headersWithdraw.append('Authorization', `Bearer ${parseStorage._token}`)

          const headersOptions = {
            method: 'GET',
            headers: headersWithdraw,
            redirect: 'follow'
          };

          fetch(`${LINK_API}api/withdraw`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              setIsInfoWithdraw(result.data);
            })

        } catch (err) {
          toast.error('Tidak bisa mendapatkan Information Withdraw!');
          console.error(err);
        }
      }
    }
  }, [setIsInfoWithdraw])

  const handleSelectVia = (event, newValue) => {
    setIsFormWithdraw((prevFormData) => ({
      ...prevFormData,
      via: newValue
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setIsFormWithdraw((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmitRequest = () => {
    setIsLoadingWithdraw(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    const headersSubmit = new Headers();
    headersSubmit.append("Content-Type", "application/json");
    headersSubmit.append("Authorization", `Bearer ${parseStorage._token}`);

    const bodyRaw = JSON.stringify({
      userId: isFormWithdraw?.userId,
      amount: isProfile?.amount[0].amount,
      via: isFormWithdraw?.via,
      nomor: isFormWithdraw?.nomor
    });

    const requestOptions = {
      method: 'POST',
      headers: headersSubmit,
      body: bodyRaw,
      redirect: 'follow'
    };

    fetch(`${LINK_API}api/withdraw`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsProfile(result.data._user);
        setIsInfoWithdraw(result.data._withdraw);
        
        setTimeout(() => {
          setIsModalWithdraw(false);
          setIsLoadingWithdraw(false);
          toast.success(result.message);
        }, 2000);
      }).catch((err) => {
        toast.error('Terjadi kesalahan saat request withdraw');
        setIsLoadingWithdraw(false);
        console.error(err);
      })
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: '70px' }}>
        {/* Box Balance, Profile, Status */}
        <Grid 
          container
          spacing={2}
          padding='10px 15px'
          marginBottom={(isRoles == 'staff') ? '20px' : ''}
          border={(isRoles == 'staff') ? '1px solid #e97991' : ''}
          borderRadius={(isRoles == 'staff') ? '20px' : ''}
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

          {(isRoles == 'staff') ? 
            <>
              {/* COMPONENT UNTUK BALANCE AMOUNT */}
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
                      {(isProfile === 0) ? 'Loading...' :
                        <Tooltip 
                          title={`Last Withdraw ${showFormattedDate(isProfile.amount[0].lastWithdraw)}`}
                          followCursor
                        >
                          <Button
                            fullWidth
                            sx={{
                              fontSize: '17px',
                              backgroundColor: '#d1d1d1',
                              color: '#000000',
                              width: '100%'
                            }}
                            className='button-tarik'
                            onClick={() => {
                              if (isInfoWihtdraw?.status == 'pending') {
                                toast.warn('Request Withdraw sedang dilakukan!')
                              }else {
                                setIsModalWithdraw(true)
                              }
                            }}
                          >
                            Withdraw
                          </Button>
                        </Tooltip>
                      }
                    </Grid>
                  </Grid>
                </ItemGrid>
              </Grid>

              {/* COMPONENT UNTUK STATUS WITHDRAW */}
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
                            <AccessTimeFilledOutlinedIcon /> Information Withdraw
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
                        (isInfoWihtdraw?.status === 'pending') ? 
                        <>
                          <Typography
                            fontSize='13px'
                            color='#ffffff'
                            fontFamily='Titillium Web'
                            sx={{
                              backgroundColor: 'limegreen',
                              padding: '3px 10px',
                              borderRadius: '10px',
                              margin: '0px 3px'
                            }}
                          >
                            {formatToCurrency(isInfoWihtdraw?.amount)}
                          </Typography>

                          <Typography
                            fontSize='13px'
                            color='#ffffff'
                            fontFamily='Titillium Web'
                            sx={{
                              backgroundColor: '#4c2a86',
                              padding: '3px 10px',
                              borderRadius: '10px',
                              margin: '0px 3px'
                            }}
                          >
                            {isInfoWihtdraw?.via}
                          </Typography>

                          <Typography
                            fontSize='13px'
                            fontFamily='Titillium Web'
                            sx={{
                              backgroundColor: '#ebebeb',
                              padding: '3px 10px',
                              borderRadius: '10px',
                              margin: '0px 3px',
                              color: '#000000'
                            }}
                          >
                            {showFormattedDate(isInfoWihtdraw?.dateWithdraw)}
                          </Typography>

                          <Typography
                            fontSize='13px'
                            fontFamily='Titillium Web'
                            sx={{
                              backgroundColor: '#000000',
                              padding: '3px 10px',
                              borderRadius: '10px',
                              margin: '0px 3px',
                              color: '#ffffff'
                            }}
                          >
                            {isInfoWihtdraw?.nomor}
                          </Typography>
                        </>
                    : (
                      <Typography
                        fontSize='13px'
                        color='#ffffff'
                        fontFamily='Titillium Web'
                        sx={{
                          backgroundColor: 'limegreen',
                          padding: '3px 10px',
                          borderRadius: '10px',
                          margin: '0px 3px'
                        }}
                      >
                        Tidak ada Request
                      </Typography>
                    ) }
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
                        <Button
                        fullWidth
                        sx={{
                          fontSize: '17px',
                          backgroundColor: (isInfoWihtdraw?.status === 'pending') ? '#ffca2c' : (isInfoWihtdraw?.status === 'success') ? '#22bf76' : '#5c636a',
                          color: '#000000',
                          width: '100%'
                        }}
                        className='button-status'
                      >
                        {(isInfoWihtdraw?.status == undefined) ? 'None' :  upperCaseStatus(isInfoWihtdraw?.status)}
                      </Button>
                      }
                    </Grid>
                  </Grid>
                </ItemGrid>
              </Grid>
            </>
          : ''}
        </Grid>

        {/* Box Input, List data */}
        <Grid
          container
          spacing={2}
          padding='10px 15px'
          border={(isRoles == 'staff') ? '1px solid #e97991' : ''}
          borderRadius={(isRoles == 'staff') ? '20px' : ''}
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

      <Modal
        open={isModalWithdraw}
        onClose={(event, reason) => {
          if (reason && reason === 'backdropClick') {
            return;
          }
          setIsModalWithdraw(false);
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Sheet
          variant='outlined'
          sx={{
            width: '100%',
            maxWidth: 700,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg'
          }}
        >
          <ModalClose variant='plain' sx={{ m: 1 }} />
          <form>
            <FormLabel>
              <h4>Amount Withdraw</h4>
            </FormLabel>
            <FormControl>
              <Input 
                type='text'
                size='md'
                name='amount'
                variant='soft'
                value={(isProfile !== 0) ? formatToCurrency(isProfile?.amount[0].amount) : 'Loading...'}
                disabled
                autoComplete='Amount'
              />
            </FormControl>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item="true"
                md={6}
                xs={6}
              >
                <FormLabel>
                  <h4>Via</h4>
                </FormLabel>
                <FormControl>
                  <Select
                    placeholder="Choose one..."
                    name='via'
                    variant='soft'
                    value={isFormWithdraw?.via}
                    style={{ zIndex: 1100 }}
                    onChange={handleSelectVia}
                  >
                    {dataVia.map((via) => (
                      <Option
                        key={via.id}
                        value={via.name}
                      >
                        {via.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item="true"
                md={6}
                xs={6}
              >
                <FormLabel>
                  <h4>Nomor</h4>
                </FormLabel>
                <FormControl>
                  <Input 
                    type='number'
                    name='nomor'
                    placeholder='Your Number...'
                    variant='soft'
                    value={isFormWithdraw?.nomor}
                    autoComplete='Nomor'
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>

              <Grid
                item="true"
                md={12}
                xs={12}
              >
                <Button
                  variant='solid'
                  color='success'
                  fullWidth
                  onClick={handleSubmitRequest}
                  loading={isLoadingWihtdraw}
                >
                  Request
                </Button>
              </Grid>
            </Grid>
        </form>
        </Sheet>
      </Modal>
      
      <ToastContainer
          theme='dark'
          position='bottom-center'
      />
    </>
  );
}

export default HomePage;
