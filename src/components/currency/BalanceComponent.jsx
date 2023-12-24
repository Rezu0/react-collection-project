import React from "react";
import { Typography } from '@mui/joy';

function BalanceComponent({ balance, isXs }) {
  const formatToCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Typography
        fontWeight={600}
        fontSize='25px'
        textAlign={(isXs) ? 'start' : 'end'}
      >
        {formatToCurrency(balance)}
      </Typography>
    </>
  )
}

export default BalanceComponent;