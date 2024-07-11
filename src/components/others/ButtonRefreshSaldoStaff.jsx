import { Button, Tooltip } from "@mui/joy";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState } from "react";
import { handlerFetchingAllSaldoStaff } from "../../utils/handler-fetching";
import { toast } from "react-toastify";

function ButtonRefreshSaldoStaff({ setIsAllSaldo }) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const handlerClickRefreshSaldo = async () => {
    setIsLoadingButton(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        const responseFetchingSaldo = await handlerFetchingAllSaldoStaff(parseStorage._token);

        if (!responseFetchingSaldo.status && responseFetchingSaldo.status === 'fail') {
          console.error(responseFetchingSaldo);
          setIsLoadingButton(false);
          toast.error('Ada kesalahan saat refresh data!');
          return;
        }

        return setTimeout(() => {
          setIsLoadingButton(false);
          setIsAllSaldo(responseFetchingSaldo.data);
          toast.success('Data berhasil di refresh!');
        }, 2000)
      }
    }
  }

  return (
    <>
      <Tooltip
        title="Refresh data"
        arrow
        placement="bottom"
      >
        <Button
          variant="plain"
          color="warning"
          startDecorator={<RefreshIcon />}
          sx={{
            "--Button-gap": "0px",
            padding: '0px 10px',
            marginRight: '5px'
          }}
          loading={isLoadingButton}
          onClick={handlerClickRefreshSaldo}
        />
      </Tooltip>
    </>
  )
}

export default ButtonRefreshSaldoStaff;