import { Box, Button, Grid, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import React from "react";
import DatatablesDoujinOwner from "../datatables/DatatablesDoujinOwner";
import DatatablesManhwaOwner from "../datatables/DatatablesManhwaOwner";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";

function ComponentOwner({ isProfile, setIsProfile }) {
  const [isModalRequest, setIsModalRequest] = useState(false);
  const [isRequestData, setIsRequestData] = useState();

  useEffect(() => {
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        try {
          const headersGetAll = new Headers();
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
                setIsRequestData(result.data);
              }
            }).catch((err) => {
              console.error('Error list withdraw: ', err);
              toast.error('Terjadi kesalahan!');
            })
        } catch (err) {
          console.error('Error catching: ', err);
          toast.error('Terjadi kesahalan!');
        }
      }
    }
  }, [setIsRequestData, isProfile])

  const rowNumberTemplate = (row, column) => {
    const rowIndex = isRequestData.indexOf(row) + 1;
    return rowIndex;
  }

  return (
    <>
    <Box
      sx={{
        flexGrow: 1
      }}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          md={12}
        >
          <Button
            variant="solid"
            color="primary"
            startDecorator={<AccountBalanceWalletIcon />}
            onClick={() => setIsModalRequest(true)}
          >
            List Withdraw
          </Button>

          <Modal
            open={isModalRequest}
            onClose={(event, reason) => {
              if (reason && reason === 'backdropClick') {
                return;
              }
              setIsModalRequest(false);
            }}
            sx={{
              zIndex: 1,
              display:'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: 1000,
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
                height: 'auto'
              }}
            >
              
              <Grid
                container
                spacing={2}
              >
                <Grid
                  md={12}
                >
                  <ModalClose 
                    variant="plain"
                    sx={{ m: 1 }}
                  />
                </Grid>

                <Grid
                  md={12}
                >
                  <DataTable
                    value={isRequestData}
                    size="small"
                    scrollable
                    scrollHeight="500px"
                    rows={10}
                    paginator
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    removableSort
                    tableStyle={{ 
                      minWidth: '50rem' 
                    }}
                  >
                    <Column 
                      header="Nomor"
                      footer="Nomor"
                      body={rowNumberTemplate}
                      style={{ width: '5%' }}
                      frozen
                    />

                    <Column 
                      field="user.displayUsername"
                      header="Staff"
                      footer="Staff"
                      sortable
                      style={{
                        width: '20%',
                        fontWeight: 'bold'
                      }}
                    />
                  </DataTable>
                </Grid>
              </Grid>
            </Sheet>
          </Modal>
        </Grid>

        {/* DATATABLE UNTUK DOUJIN */}
        <Grid
          md={12}
        >
          <DatatablesDoujinOwner
            isProfile={isProfile}
            setIsProfile={setIsProfile}
          />
        </Grid>

        {/* DATATABLE UNTUK MANHWA */}
        <Grid
          md={12}
        >
          <DatatablesManhwaOwner 
            isProfile={isProfile}
            setIsProfile={setIsProfile}
          />
        </Grid>
      </Grid>
    </Box>
    </>
  )
}

export default ComponentOwner;