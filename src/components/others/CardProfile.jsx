import React from "react";
import { Paper } from '@mui/material';
import {
 Grid,
 Typography,
 styled
} from '@mui/joy';

const ItemGridProfile = styled(Paper)(({ theme }) => ({
  backgroundColor: '#e97991',
  padding: '20px',
  color: '#ffffff',
  borderRadius: '10px'
}))

function CardProfile({ isProfile }) {
  return (
    <>
    {(isProfile === 'Loading') ? 'Loading...' :
      <ItemGridProfile>
        <Grid
          container
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Grid
            md={12}
          >
            <Typography
              fontFamily='Titillium Web'
              fontSize='20px'
              color='#ffffff'
              fontWeight='700'
            >
              Username: { isProfile.username }
            </Typography>
          </Grid>
          <Grid
            item="true"
            md={12}
          >
            <Typography
              fontFamily='Titillium Web'
              fontSize='20px'
              color='#ffffff'
              fontWeight='700'
            >
              Divisi & Role: { isProfile.divisi } - { isProfile.role }
            </Typography>
          </Grid>
        </Grid>
      </ItemGridProfile>
    }
    </>
  );
}

export default CardProfile;