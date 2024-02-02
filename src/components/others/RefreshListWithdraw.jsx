import { Button, Tooltip } from "@mui/joy";
import React from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";

function RefreshListWithdraw({ setIsRequestData }) {
  const [isLoadingRefreshData, setIsLoadingRefreshData] = useState(false);

  const onClickRefresh = () => {
    setIsLoadingRefreshData(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        try {
          const headersGetAll = new Headers()
          headersGetAll.append("Content-Type", "application/json");
          headersGetAll.append("Authorization", `Bearer ${parseStorage._token}`);

          const headersOptions = {
            method: 'GET',
            headers: headersGetAll,
            redirect: 'follow'
          };

          fetch(`${LINK_API}api/admin/withdraw`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {
                setTimeout(() => {
                  setIsRequestData(result.data);
                  setIsLoadingRefreshData(false);
                  toast.success('Data telah direfresh');
                }, 2000);
              }
            }).catch((err) => {
              console.error(err);
              toast.error('Terjadi kesalahan!');
            })
        } catch (err) {
          console.error(err);
        }
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
          loading={isLoadingRefreshData}
          onClick={onClickRefresh}
        />
      </Tooltip>
    </>
  )
}

export default RefreshListWithdraw;