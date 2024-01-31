import { Box, Button, Grid, Modal, ModalClose, Sheet, Tooltip, Typography } from "@mui/joy";
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
import { formatDateForHuman, formatToCurrency, formatViaWithdraw, showFormatDateReadable } from "../../utils/dataMenu";
import { Tag } from "primereact/tag";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

function ComponentOwner({ isProfile, setIsProfile }) {
  const [isModalRequest, setIsModalRequest] = useState(false);
  const [isRequestData, setIsRequestData] = useState();
  const [isLoadingDone, setIsLoadingDone] = useState({
    loading: false,
    id: null
  });
  const [isFilter, setIsFilter] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    via: {
      operator: FilterOperator.OR,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS
        }
      ]
    },
    "user.displayUsername": {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.CONTAINS
        }
      ]
    }
  });
  const [via] = useState([
    'DANA',
    'OVO',
    'GOPAY',
    'Shopee Pay'
  ]);

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

  const rowSaldoTemplate = (data) => {
    return `${formatToCurrency(data.amount)}`;
  }

  const rowViaTemplate = (data) => {
    const formatedVia = formatViaWithdraw(data?.via);
    return (
      <>
        <Tag 
          value={formatedVia.via}
          style={{
            backgroundColor: `${formatedVia.colorBtn}`
          }}
        />
      </>
    )
  }

  const viaItemTemplate = (option) => {
    return (
      <>
        <Tag 
          value={option}
          style={{
            backgroundColor: `${formatViaWithdraw(option).colorBtn}`
          }}
        />
      </>
    )
  }

  const rowDateWithdraw = (data) => {
    return (
      <>
        <Tooltip
          title={showFormatDateReadable(data?.dateWithdraw)}
          arrow
          placement="top"
        >
          <Typography>
            {formatDateForHuman(data?.dateWithdraw)}
          </Typography>
        </Tooltip>
      </>
    )
  }

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...isFilter };

    _filters["global"].value = value;
    setIsFilter(_filters);
  }

  const onClickButtonDone = (data) => {
    if (isLoadingDone.loading) {
      return;
    }

    setIsLoadingDone({
      loading: true,
      id: data?.uuid
    });

    setTimeout(() => {
      setIsLoadingDone({
        loading: false,
        id: null
      })
    }, 2000);
  }

  const rowButtonAction = (data) => {
    return (
      <>
        <Button
          variant="solid"
          startDecorator={<CheckCircleIcon fontSize="small" />}
          color="success"
          sx={{
            "--Button-gap": "2px",
            padding: '0 10px',
            fontSize: '13px'
          }}
          onClick={() => onClickButtonDone(data)}
          loading={(isLoadingDone.id === data?.uuid) ? isLoadingDone.loading : false}
        >
          Done
        </Button>
      </>
    )
  }

  const viaRowFilterTemplate = (options) => {
    return (
      <Dropdown 
        value={options.value}
        options={via}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={viaItemTemplate}
        placeholder="Select one..."
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    )
  }

  const value = isFilter["global"] ? isFilter["global"].value : "";

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
                  md={6}
                  xs={12}
                  display='flex'
                  justifyContent='start'
                >
                  <Typography
                    noWrap
                    component="a"
                    sx={{
                      mr: 2,
                      display: { md: 'flex' },
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '25px'
                    }}
                  >
                    List Withdraw
                  </Typography>
                </Grid>

                <Grid
                  md={6}
                  xs={12}
                  margin='15px 0'
                  display='flex'
                  justifyContent='end'
                >
                  <span className="p-input-icon-left">
                    <SearchIcon style={{ marginTop: '-11px' }} />
                    <InputText 
                      type="search"
                      value={value || ""}
                      placeholder="Search here..."
                      size='small'
                      style={{ fontSize: '14px' }}
                      onChange={(e) => onGlobalFilterChange(e)}
                    />
                  </span>
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
                    filters={isFilter}
                    onFilter={(e) => setIsFilter(e.filters)}
                    emptyMessage="No result found withdraw"
                  >
                    <Column 
                      header="No"
                      footer="No"
                      body={rowNumberTemplate}
                      style={{ width: '5%' }}
                      frozen
                    />

                    <Column 
                      field="user.displayUsername"
                      header="Staff"
                      footer="Staff"
                      sortable
                      filter
                      filterPlaceholder="Search here..."
                      style={{
                        width: '20%',
                        fontWeight: 'bold'
                      }}
                    />

                    <Column 
                      field="amount"
                      header="Total Withdraw"
                      footer="Total Withdraw"
                      sortable
                      body={rowSaldoTemplate}
                      style={{
                        width: '20%',
                      }}
                    />

                    <Column 
                      field="via"
                      header="Via"
                      footer="Via"
                      body={rowViaTemplate}
                      style={{
                        width: '20%',
                      }}
                      filter
                      filterElement={viaRowFilterTemplate}
                    />

                    <Column 
                      field="nomor"
                      header="Nomor HP"
                      footer="Nomor HP"
                      style={{
                        width: '20%'
                      }}
                    />

                    <Column 
                      field="dateWithdraw"
                      header="Date Withdraw"
                      footer="Data Wihtdraw"
                      body={rowDateWithdraw}
                    />

                    <Column 
                      header="Action"
                      footer="Action"
                      body={rowButtonAction}
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